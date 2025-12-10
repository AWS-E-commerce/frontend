export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNISEX = "UNISEX",
}

export enum Role {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export enum StorageStatus {
  USED = "USED",
  UNUSED = "UNUSED",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  ERROR = "ERROR",
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum TransactionStatus {
  IN_PROCESS = "IN_PROCESS",
  SUCCESS = "SUCCESS",
  CANCELLED = "CANCELLED",
}

export interface GrantedAuthority {
  authority: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface BranchDetail {
  branchId: number;
  name: string;
}

export interface Discount {
  [key: string]: any;
}

export interface SortObject {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface PageableObject {
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
}

export interface PageRequest {
  page: number; // >= 0
  size: number; // >= 1
  sort?: string[];
}

export interface Page<T> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  empty: boolean;
}

export type JsonNode = Record<string, any>;
