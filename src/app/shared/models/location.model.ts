import { GeoInfo } from './geo-info.model';

export class Location {
  locationId: string;
  description: string;
  postal: string;
  status: string;
  isDefault: boolean;
  geoInfo: GeoInfo;
}

export class UserLocation extends Location {
  userLocationId: string;
}
