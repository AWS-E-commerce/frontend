import type { Role, Gender, Transaction, GrantedAuthority } from "@/types";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  address: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  role?: Role;
}

export interface UpdateAccountRequest {
  fullName?: string;
  address?: string;
  phone?: string;
}

export interface AccountResponse {
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  token: string;
  address: string;
  avatarUrl: string;
}

export interface User {
  userId: number;
  username: string;
  password: string;
  email: string;
  banned_at?: string; // date-time
  role: Role;
  transactions: Transaction[];
  memberProfile: MemberProfile;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: GrantedAuthority[];
  enabled: boolean;
}

export interface MemberProfile {
  member_id: number;
  name: string;
  address: string;
  gender: Gender;
  phone: string;
  user: User;
  avatarUrl: string;
}

export interface Member {
  member_id: number;
  name: string;
  address: string;
  gender: Gender;
  phone: string;
  user: User;
  avatarUrl: string;
}
