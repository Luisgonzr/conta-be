//JWT data is decoded and stored in req.user by the AuthGuard
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  mainCompany: string;
  currentCompany: string;
}
