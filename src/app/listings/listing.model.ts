export class Listing {
  id:             string;
  userId:         string;
  ownerUsername:  string;
  title:          string;  // TODO: NOT ID!
  description:    string;
  keywords:       string;
  linkUrl:        string;
  price:          string;
  userLocationId: string;  // TODO: Make into object with various info
  status:         string;
  hero:           string;  // Hero Image
  images:         string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  imagesRef:      string;
  slug:           string;
  createdAt:      string;
  updatedAt:      string;
}
