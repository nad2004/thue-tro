// src/models/User.ts

export type UserRole = 'Admin' | 'Landlord' | 'Tenant';
// Interface cho đối tượng User trong Frontend
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

// Interface cho dữ liệu thô từ Backend (có thể có _id)
export interface IUserBackend {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
  phoneNumber?: string;
}

export class User implements IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
  createdAt: string;

  constructor({ _id, id, fullName, email, role, avatar, createdAt, phoneNumber }: IUserBackend) {
    this.id = id || _id || '';
    this.fullName = fullName || '';
    this.email = email || '';
    this.phoneNumber = phoneNumber || '';
    this.role = role || 'Tenant';
    this.avatar = avatar || '';
    this.createdAt = createdAt || '';
  }

  // Helper check quyền
  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
