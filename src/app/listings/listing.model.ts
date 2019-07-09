import { Tag } from '../tags/tag.model';

export class Listing {
  id:             string;
  userId:         string;
  ownerUsername:  string;
  title:          string;  // TODO: NOT ID!
  description:    string;
  tags:           Tag[];
  linkUrl:        string;
  price:          string;
  userLocationId: string;  // TODO: Make into object with various info
  status:         string;
  hero:           string;  // Hero Image
  images:         string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  slug:           string;
  createdAt:      string;
  updatedAt:      string;
}
