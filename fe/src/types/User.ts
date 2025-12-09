// src/models/User.ts

export type UserRole = 'Admin' | 'Landlord' | 'Tenant';
// Interface cho đối tượng User trong Frontend
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
}

// Interface cho dữ liệu thô từ Backend (có thể có _id)
export interface IUserBackend {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export class User implements IUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;

  constructor({ _id, id, fullName, email, role, avatarUrl, createdAt }: IUserBackend) {
    this.id = id || _id || "";
    this.fullName = fullName || "";
    this.email = email || "";
    this.role = role || "Tenant";
    this.avatarUrl = avatarUrl || "";
    this.createdAt = createdAt || ""
  }

  // Helper check quyền
  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}