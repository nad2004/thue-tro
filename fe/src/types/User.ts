import { Article } from './Article';
export type UserRole = 'Admin' | 'Landlord' | 'Tenant';
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  savedArticles: Article[];
  createdAt: string;
}

export interface IUserBackend {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
  phoneNumber?: string;
  savedArticles?: Article[];
}

export class User implements IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  savedArticles: Article[];

  constructor({
    _id,
    id,
    fullName,
    email,
    role,
    avatar,
    createdAt,
    phoneNumber,
    savedArticles,
  }: IUserBackend) {
    this.id = id || _id || '';
    this.fullName = fullName || '';
    this.email = email || '';
    this.phoneNumber = phoneNumber || '';
    this.role = role || 'Tenant';
    this.avatar = avatar || '';
    this.createdAt = createdAt || '';
    this.savedArticles = savedArticles || [];
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
