import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { WishifiedsApi } from '../../core/api/wishifieds-api.service';
import { GeoInfo } from '../../shared/models/geo-info.model';
declare let L;

@Component({
  moduleId: module.id,
  selector: 'marker-map',
  templateUrl: 'marker-map.component.html',
  styleUrls:  ['marker-map.component.css']
})

export class MarkerMapComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('mapDiv') mapCont;
  @Input() geoInfo: GeoInfo;
  @Input() readOnly: boolean = true;
  @Output() markerEE = new EventEmitter<any>();
  origMarkerInfo: any;
  defaultMapZoom: number = 13;
  map: any;
  marker: any;
  markerGroup: any;
  ready: boolean = false;

  constructor(private wishifiedsApi: WishifiedsApi) {}

  // TODO:  CREATE A MAPS SERVICE THAT USES THE ROUTE & CAN DO MOST OF THESE ACTIONS EASILY VIA FUNCTION
  ngOnInit() {
    const that = this;
    const centerCoords = [this.geoInfo.latitude, this.geoInfo.longitude];

    // Build map
    this.map = L.map(this.mapCont.nativeElement).setView(centerCoords, this.defaultMapZoom);
    L.tileLayer(that.wishifiedsApi.routes['mapsApi'], {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
     .addTo(this.map);

    // Add Marker
    this.createMarkerAndGroup(centerCoords)
    // this.marker = new L.marker(geoPair, this.getMarkerSettings()).addTo(this.map);  //.openPopup()
    // this.marker.on("dragend", this.sendUpdatedMarkerGeoInfo.bind(this));  // TMYK: Won't have access to "this" if don't bind its context!!!
    this.ready = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.ready) {
      console.log("Changes found to map, rebuilding...");
      this.markerGroup.clearLayers();
      this.createMarkerAndGroup([this.geoInfo.latitude, this.geoInfo.longitude]);
      this.map.fitBounds(this.markerGroup.getBounds(), {maxZoom: this.defaultMapZoom})
    }
  }

  private createMarkerAndGroup(centerCoords) {
    this.marker = new L.marker(centerCoords, this.getMarkerSettings());//.addTo(this.map);  //.openPopup()
    this.marker.on("dragend", this.sendUpdatedMarkerGeoInfo.bind(this));  // TMYK: Won't have access to "this" if don't bind its context!!!
    this.markerGroup = L.featureGroup([this.marker]).addTo(this.map);
  }

  ngOnDestroy() {
    if(this.marker) {this.map.removeLayer(this.marker); }
    if(this.map) { this.map.remove(); }
  }

  // We "bind" our "this" context when call this function, because otherwise will have different "this" context
  sendUpdatedMarkerGeoInfo(event) {
    console.log("New Marker Location is: ", event.target.getLatLng());
    this.markerEE.emit(event.target.getLatLng());  // Can also get geoJson POINT with toGeoJSON()
  }

  private getMarkerSettings() {
    console.log("About to get settings for ReadOnly: ", this.readOnly);
    return (this.readOnly ? {} : {draggable: true, autoPan: true} );
  }
}
