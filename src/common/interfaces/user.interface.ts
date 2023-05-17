export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
  provider: string;
}
