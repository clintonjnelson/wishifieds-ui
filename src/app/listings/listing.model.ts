import { Tag } from '../tags/tag.model';
import { Location } from '../shared/models/location.model';

export class Listing {
  id:            string;
  userId:        string;
  ownerUsername: string;
  title:         string;  // TODO: NOT ID!
  description:   string;
  tags:          Tag[];
  linkUrl:       string;
  price:         string;
  status:        string;
  hero:          string;  // Hero Image
  images:        string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  slug:          string;
  location:      Location;
  createdAt:     string;
  updatedAt:     string;
}
