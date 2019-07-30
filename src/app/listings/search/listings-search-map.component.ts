import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { WishifiedsApi } from '../../core/api/wishifieds-api.service';
import { GeoInfo } from '../../shared/models/geo-info.model';
import { Listing } from '../listing.model';
declare let L;

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
  origMarkerInfo: any;
  defaultMapZoom: number = 12; // Higher num means closer in
  map: any;  // The map
  group: any;  // Feature group
  markers: any[] = [];  // Markers for each listing on the map
  mapCenter: number[];  // Calculated center of the map (mean lat/long)
  ready: boolean = false;

  constructor(private wishifiedsApi: WishifiedsApi) {}

  // TODO:  CREATE A MAPS SERVICE THAT USES THE ROUTE & CAN DO MOST OF THESE ACTIONS EASILY VIA FUNCTION
  ngOnInit() {
    const that = this;
    this.calcAndSetCenter();

    // Build map
    this.map = L.map(
      this.mapCont.nativeElement,  // Name of the map - take from DOM
      {scrollWheelZoom: false, center: this.mapCenter}  // Map options
    );
    L.tileLayer(
        that.wishifiedsApi.routes['mapsApi'],  // Define endpoint for tiles API
        {attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://github.com/Overv/openstreetmap-tile-server">Alexander Overvoorde</a>'
      })
     .addTo(this.map);

    // Create Feature group & populate map with markers
    this.displayMapMarkers();
    console.log("ALL SEARCH LISTINGS ARE: ", this.listings);
    console.log("ALL MARKERS ARE: ", this.markers);
    this.ready = true;
  }

  ngOnChanges() {
    if(this.ready) {
      console.log("CHANGES FOUND, REBUILD MARKERS...");
      this.group.clearLayers();
      this.markers = [];  // Clear markers
      this.calcAndSetCenter();
      this.displayMapMarkers();
    }
  }

  ngOnDestroy() {
    const that = this;
    if(this.markers) {
      this.group.clearLayers();
      // !!!!!!!!! CLEAR GROUP: group.clearLayers();   https://github.com/Leaflet/Leaflet/issues/1495
      // this.markers.forEach(function(marker) {
      //   that.map.removeLayer(marker);
      // });
    }
    if(this.map) { this.map.remove(); }
  }

  // Create the markers array, put them on map, fit the map to markers
  displayMapMarkers() {
    const that = this;
    this.createMarkers();
    this.group = L.featureGroup(this.markers).addTo(this.map);
    this.map.fitBounds(this.group.getBounds(), {maxZoom: that.defaultMapZoom});
  }

  createMarkers() {
    const that = this;
    console.log()
    // Populate the component markers object & coords object
    this.listings.forEach(function (listing) {
      if(listing.location && listing.location['geoInfo']) {
        const geoInfo = listing.location['geoInfo'];

        console.log("Creating marker & adding to map...", geoInfo);
        // that.coords.lats.push(geoInfo['latitude']);
        // that.coords.longs.push(geoInfo['longitude']);
        that.markers.push(new L.marker([geoInfo.latitude, geoInfo.longitude]));
      }
    });
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
}
