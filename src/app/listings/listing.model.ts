export class Listing {
  user_id:     string;
  category:    string;
  condition:   string;  // TODO: NOT ID!
  title:       string;  // TODO: NOT ID!
  description: string;
  keywords:    string;
  linkUrl:     string;
  price:       string;
  zipcode:     string;
  status:      string;
  images:      string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  imagesRef:   string;
  slug:        string;
  createdAt:   string;
  updatedAt:   string;
}
