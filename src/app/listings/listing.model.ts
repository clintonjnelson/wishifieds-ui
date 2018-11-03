export class Listing {
  id:            string;
  userId:        string;
  ownerUsername: string;
  categoryId:    string;  // TODO: Make into categoryId OR object (if also want name)
  conditionId:   string;  // TODO: Make into conditionId OR object (if also want name)
  title:         string;  // TODO: NOT ID!
  description:   string;
  keywords:      string;
  linkUrl:       string;
  price:         string;
  locationId:    string;  // TODO: Make into object with various info
  status:        string;
  heroImage:     string;
  images:        string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  imagesRef:     string;
  slug:          string;
  createdAt:     string;
  updatedAt:     string;
}
