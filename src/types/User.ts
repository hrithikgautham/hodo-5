
export type User = {
  uid: number;
  username: string;
  email: string;
  emailVerified: boolean;
  creationTime: Date;
  lastSignInTime: Date;
  providerId: string;
  gotInfo: boolean;
  info?: Info;
  isHost?: boolean;
}

type Info = {
  hobbies: string[];
  favouriteFoods: string[];
  favouritePlaces: string[];
  bio: string;
  profilePicture: string;
  phoneNumber: string;
}