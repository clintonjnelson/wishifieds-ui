import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { WishifiedsApi } from '../../core/api/wishifieds-api.service';
import { GeoInfo } from '../../shared/models/geo-info.model';
import { Listing } from '../listing.model';
import { ApiLocationsService } from '../../core/api/api-locations.service';
declare let L;
declare let OverlappingMarkerSpiderfier;

// NOTE: objects are not directly added to the map, but are added to a featureGroup and then
//     the feature group is added to the map. This is for easy clearing using <group>.clearLayers();



@Component({
  moduleId: module.id,
  selector: 'listings-search-map',
  templateUrl: 'listings-search-map.component.html',
  styleUrls:  ['listings-search-map.component.css']
})

export class ListingsSearchMapComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('mapDiv') mapCont;
  @Input() listings: Listing[];
  @Input() readOnly: boolean = true;
  @Input() searchInfo: any;  //{distMiles: 25, displayType: circle, showSearch: true, centerCoords}
  origMarkerInfo: any;
  defaultMapZoom: number = 12; // Higher num means closer in
  map: any;  // The map
  markersGroup: any;  // Feature markersGroup
  markers: any[] = [];  // Markers for each listing on the map
  mapCenter: number[];  // Calculated center of the map (mean lat/long)
  ready: boolean = false;
  radiusCircle: any;
  circleGroup: any;
  overlappingMarkerSpiderfier: any;

  constructor(private wishifiedsApi: WishifiedsApi,
              private locationService: ApiLocationsService) {

  }

  // TODO:  CREATE A MAPS SERVICE THAT USES THE ROUTE & CAN DO MOST OF THESE ACTIONS EASILY VIA FUNCTION
  ngOnInit() {
    const that = this;
    this.calcAndSetCenter();
    console.log("SEARCHINFO IS: ", this.searchInfo);

    // Build map
    this.map = L.map(
      this.mapCont.nativeElement,  // Name of the map - take from DOM
      {scrollWheelZoom: false, center: this.mapCenter, zoom: this.defaultMapZoom} // Default map options
    );
    L.tileLayer(
        that.wishifiedsApi.routes['mapsApi'],  // Define endpoint for tiles API
        {attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://github.com/Overv/openstreetmap-tile-server">Alexander Overvoorde</a>'
      })
     .addTo(this.map);

     // Prep the spiderifier
     this.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(this.map, {keepSpiderfied: true});
     this.overlappingMarkerSpiderfier.addListener('spiderfy', function(markers) {
       that.map.closePopup();
     });

     // L.circle([47.6155, -122.2072], {radius: (25*1609.34), color:'yellow',opacity:1,fillColor: 'blue',fillOpacity:.4})
     // .addTo(that.map);

    // Create Feature markersGroup & populate map with markers
    this.displayMapMarkers();
    console.log("ALL SEARCH LISTINGS ARE: ", this.listings);
    console.log("ALL MARKERS ARE: ", this.markers);
    this.ready = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("MAP READY IS CURRENTLY: ", this.ready);
    if(this.ready) {
      console.log("CHANGES FOUND, REBUILD MARKERS...");
      this.markersGroup.clearLayers();
      this.markers = [];  // Clear markers
      this.calcAndSetCenter();
      this.displayMapMarkers();
    }
  }

  ngOnDestroy() {
    const that = this;
    if(this.markers) {
      this.markersGroup.clearLayers();
      // !!!!!!!!! CLEAR GROUP: markersGroup.clearLayers();   https://github.com/Leaflet/Leaflet/issues/1495
      // this.markers.forEach(function(marker) {
      //   that.map.removeLayer(marker);
      // });
    }
    if(this.map) { this.map.remove(); }
    if(this.markersGroup) { this.markersGroup.clearLayers(); }
  }

  // Create the markers array, put them on map, fit the map to markers
  private displayMapMarkers() {
    const that = this;

    this.createMarkers();
    this.markersGroup = L.featureGroup(this.markers).addTo(this.map);
    this.rebuildSearchExtentsCircle(function(isCircleCreated) {
      // Optional logic based on success/fail
      that.setZoom();
    });
  }

  private createMarkers() {
    const that = this;
    // Populate the component markers object & coords object
    this.listings.forEach(function (listing) {
      if(listing.location && listing.location['geoInfo']) {
        const geoInfo = listing.location['geoInfo'];

        console.log("Creating marker & adding to map...", geoInfo);
        let listingLink = listing.ownerUsername + '/listings/' + listing.id;
        let popup = buildPopup(listing.hero, listingLink, listing.price, listing.title);
        let newMarker = new L.marker([geoInfo.latitude, geoInfo.longitude], {riseOnHover: true}).bindPopup(popup);
        that.markers.push(newMarker);
        that.overlappingMarkerSpiderfier.addMarker(newMarker);
      }
    });

    function buildPopup(heroImgUrl, listingLink, price, title) {
      const html = `
        <div class="listing-marker-popup-info" style="text-align:center;">
          <a href="/${listingLink}">
            <img src="${heroImgUrl}" alt="picture of the ${title}" width="80px" height="80px"/>
          </a>
          <p style="margin:0;text-align:left"><strong style="color:black;">$ ${price}</strong></p>
        </div>
       `;
      // console.log("POPUP HTML IS: ", html);
      return html;
    }
  }

  private rebuildSearchExtentsCircle(callback) {
    const that = this;
    // console.log("Rebuilding extents. SearchInfo: ", this.searchInfo);
    // Clear any existing circles
    if(this.circleGroup) { this.circleGroup.clearLayers(); }

    this.searchInfo['showExtentsOnMap'] = (this.searchInfo['distance'] !== 'any');
    // console.log("Should show extents on map logic is: ", this.searchInfo['distance'] !== 'any');
    // console.log("Should show extents on map is: ", this.searchInfo['showExtentsOnMap']);

    // Only do this if need circle & dont have coords ("any" distance searches don't need circle)
    if(this.searchInfo['showExtentsOnMap'] && (this.searchInfo['centerCoords'] && Object.getOwnPropertyNames(this.searchInfo['centerCoords']).length < 2) && this.searchInfo['location']) {
      const cityAndState = parseLocation();
      const maxResults = '1';
      const leafletCoords = {
        lng: that.searchInfo['centerCoords'] && that.searchInfo['centerCoords']['longitude'],
        lat: that.searchInfo['centerCoords'] && that.searchInfo['centerCoords']['latitude']
      };
      this.locationService
        .locationTypeahead(this.searchInfo.postal, cityAndState.city, cityAndState.stateCode, maxResults)
        .subscribe(
          results => {
            that.searchInfo['centerCoords'] = results.locations[0]['geoInfo'];
            console.log("RESULTS OF LOCATION SEARCH FOR MAP: ", results);
            that.radiusCircle = L.circle(
              leafletCoords,
              {radius: that.searchInfo.distance*1609.34, color: 'white', fillColor: 'gray'});
            that.circleGroup = L.featureGroup([that.radiusCircle]).addTo(that.map);
            callback(true);
          },
          error => {
            // If can't get center, turn circle off & load rest
            that.searchInfo['showExtentsOnMap'] = false;
            console.log("ERROR GETTING TYPEAHEAD RESULTS: ", error);
            callback(false)
          });
    }
    else if(this.searchInfo['showExtentsOnMap'] && (this.searchInfo['centerCoords'] && Object.getOwnPropertyNames(this.searchInfo['centerCoords']).length === 2)) {
      const leafletCoords = {
        lng: that.searchInfo['centerCoords'] && that.searchInfo['centerCoords']['longitude'],
        lat: that.searchInfo['centerCoords'] && that.searchInfo['centerCoords']['latitude']
      };
      that.radiusCircle = L.circle(
        leafletCoords,
        {radius: that.searchInfo.distance*1609.34, color: 'white', fillColor: 'gray'});
      that.circleGroup = L.featureGroup([that.radiusCircle]).addTo(that.map);
      callback(true);
    }
    else {
      this.searchInfo['showExtentsOnMap'] = false;
      console.log("Unable to get center coords for extents circle, so turning circle off.");
      callback(false);
    }


    function parseLocation() {
      const cityStatePostal: any = {};

      try {
        const postal = parseInt(that.searchInfo['location']);
        // Postal NOT an int? Use city/state
        if(Number.isNaN(postal)) {
          const parsedCityState = that.searchInfo['location'].split(',');
          cityStatePostal['city'] = parsedCityState[0];
          cityStatePostal['stateCode'] = (parsedCityState.length > 1 ? parsedCityState[1].trim() : '');
        }
        // Postal is an int - use it
        else {
          cityStatePostal['postal'] = postal;
        }
      }
      catch(e) {
        console.log("Could not use provided location. Error: ", e);
      }

      return cityStatePostal;
    }
  }

  private calcAndSetCenter() {
    // Probably provide some better validations on this data...
    const totals = this.listings.reduce(function(total, current){
        console.log("This listing is: ", current);
        return {
          latitude: (Number(total.latitude) + Number(current.location['geoInfo']['latitude'])),
          longitude: (Number(total.longitude) + Number(current.location['geoInfo']['longitude']))
        };
      },
      {latitude: 0, longitude: 0}  // Starting values
    );

    this.mapCenter = [
      (totals.latitude / this.listings.length),
      (totals.longitude / this.listings.length)
    ];
  }

  // Must be done after RadiusCircle & Group are created
  private setZoom() {
    const showCircle = (this.searchInfo && this.searchInfo['showExtentsOnMap']);
    const circleBounds = (this.circleGroup && this.circleGroup.getBounds());
    const markersBounds = (this.markersGroup && this.markersGroup.getBounds());

    if(showCircle && circleBounds) {
      this.map.fitBounds(circleBounds, {maxZoom: this.defaultMapZoom});
    }
    else if(markersBounds) {
      this.map.fitBounds(markersBounds, {maxZoom: this.defaultMapZoom});
    }
    // Else, leave the default map zoom level
  }
}
