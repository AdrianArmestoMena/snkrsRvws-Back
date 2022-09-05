export interface ReqUser {
  userName: string;
  password: string;
  email: string;
  picture?: string;
  contacts?: string[];
  reviews?: string[];
}

export interface UserWithId {
  id: string;
  userName: string;
  password: string;
  email: string;
  picture?: string;
  contacts?: string[];
  reviews?: string[];
}

export interface Token {
  user: { token: string };
}
