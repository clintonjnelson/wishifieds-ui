// Base class
export class Sign {
  _id:         string;
  bgColor:     string;
  description: string;
  icon:        string;
  knownAs:     string;
  linkUrl:     string;
  owner:       string;   // REMOVE THIS. USE USERID INSTEAD
  picUrl:      string;
  signName:    string;
  signType:    string;
  userId:      string;
}

// export class EmailSign extends Sign {
//   email: string;
// }

// export class PhoneSign extends Sign {
//   phone: string;
// }
