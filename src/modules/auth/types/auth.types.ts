import { User } from '../../../models/user.model';

export interface AuthPayload {
  token: string;
  user: User;
}

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}
