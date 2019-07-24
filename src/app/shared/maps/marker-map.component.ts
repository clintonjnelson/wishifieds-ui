import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WishifiedsApi } from '../../core/api/wishifieds-api.service';
import { GeoInfo } from '../../shared/models/geo-info.model';
declare let L;

@Component({
  moduleId: module.id,
  selector: 'marker-map',
  templateUrl: 'marker-map.component.html',
  styleUrls:  ['marker-map.component.css']
})

export class MarkerMapComponent implements OnInit {
  @Input() geoInfo: GeoInfo;
  @Input() readOnly: boolean = true;
  // @Output() markerEE = new EventEmitter<any>();
  origMarkerInfo: any;
  defaultMapHeight: number = 13;

  constructor(private wishifiedsApi: WishifiedsApi) {}

  // TODO:  CREATE A MAPS SERVICE THAT USES THE ROUTE & CAN DO MOST OF THESE ACTIONS EASILY VIA FUNCTION
  ngOnInit() {
    const that = this;
    console.log("GEOINFO OBJECT IS: ", this.geoInfo);
    // origMarkerInfo = Object.assign({}, markerInfo);
    const geoPair = [this.geoInfo.latitude, this.geoInfo.longitude];
    const map = L.map('map').setView(geoPair, this.defaultMapHeight);
    // const map = L.map('map').setView([markerInfo.geo.lat, marker.geo.long], defaultHeight);
    L.tileLayer(that.wishifiedsApi.routes['mapsApi'], {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
     .addTo(map);

    L.marker(geoPair)
     .addTo(map)
     .openPopup();
  }

  // TODO: USE THIS TYPE OF LOGIC ON THE SEARCH RESULTS
  // L.marker([47.6040, -122.3233])
  //    .addTo(map)
  //    .bindPopup(popup)
  //    .openPopup();
  // const popup = L.popup().setContent('<p>Hello world!<br />This is a nice popup.</p>')
  // buildPopup(heroImgUrl, listingLink, price, title) {
  //   const html = `
  //     <div class="listing-marker-popup-info" style="text-align:center;">
  //       <a href="/${listingLink}">
  //         <img src="${heroImgUrl}" alt="picture of the ${title}" width="60px" height="60px"/>
  //       </a>
  //       <p><strong style="color:black">%{price}</strong></p>
  //     </div>
  //    `;
  //   console.log("POPUP HTML IS: ", html);
  //   return html;
  // }
}
