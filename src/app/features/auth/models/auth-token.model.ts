export interface AuthTokenModel {
  accessToken: string;
  user : {
    id: string;
    username: string;
  }
}
