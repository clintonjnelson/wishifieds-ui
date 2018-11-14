export class User {
  picUrl:        string;   // VERIFY THIS NAME REFERENCE TO AVOID MAPPING
  username:      string;
  status:        string;
}

export class UserCreds {
  email:      string;
  password:   string;
  newAccount: boolean;
  termsCond:  boolean;
}

export class UserUpdates extends User {
  userId:        string;
  email:         string;
}
