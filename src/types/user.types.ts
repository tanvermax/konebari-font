// types/user.types.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  picture?: string | null;
  isDeleted: boolean;
  isActive: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  isVerified: boolean;
  auths?: { provider: string; providerId: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserQueryParams {
  search?: string;
  role?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}