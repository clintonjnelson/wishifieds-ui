export class Listing {
  id:          string;
  userId:      string;
  category:    string;  // TODO: Make into categoryId OR object (if also want name)
  condition:   string;  // TODO: Make into conditionId OR object (if also want name)
  title:       string;  // TODO: NOT ID!
  description: string;
  keywords:    string;
  linkUrl:     string;
  price:       string;
  location:    string;  // TODO: Make into object with various info
  status:      string;
  images:      string[];  // TODO: NOT jUST HERO, HERO WOULD BE FIRST!
  imagesRef:   string;
  slug:        string;
  createdAt:   string;
  updatedAt:   string;
}
