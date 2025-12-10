import type {
  StorageStatus,
  Page,
  BranchDetail,
  Discount,
  Branch,
  Item,
  PageableObject,
  SortObject,
} from "@/types";

export interface CreateProductRequest {
  name: string;
  description: string;
  pictureUrl: string;
  branchName: string;
  discountCode?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  pictureUrl?: string;
  branchName?: string;
  discountCode?: string;
}

export interface ProductDetail {
  productId: number;
  name: string;
  description: string;
  pictureUrl: string;
  branch: BranchDetail;
  discount?: Discount;
  variant: Variant[];
}

export interface ProductDetailResponse {
  productId: number;
  productName: string;
  productDescription: string;
  branch: Branch;
  pictureURL: string;
  productVariantResponses: VariantResponse[];
}

export interface ProductPageResponse extends Page<ProductDetailResponse> {}

export interface Variant {
  variantId: number;
  value: number;
  price: number;
  currency: string;
  product: ProductDetail;
  storageList: Storage[];
}

export interface VariantResponse {
  id: number;
  value: number;
  price: number;
  currency: string;
}

export interface AddVariantRequest {
  value: number;
  price: number;
  currency: string;
}

export interface UpdateVariantRequest {
  price?: number;
  currency?: string;
  value?: number;
}

export interface Storage {
  storageId: number;
  activateCode: string;
  expirationDate: string; // date-time
  activationDate: string; // date-time
  status: StorageStatus;
  variant: Variant;
  orderItem: Item;
}

export interface AddStockRequest {
  variantId: number;
  activationCodes: string[];
  expirationDate: string; // date-time
  activationDate: string; // date-time
}

export interface InventoryStatusResponse {
  variantId: number;
  productName: string;
  price: number;
  quantityInStock: number;
}

export interface CardDetailResponse {
  // storageId: number;
  // serial: string;
  // activateCode: string;
  // expirationDate: string; // date-time
  // status: StorageStatus;
  // productName: string;
  totalPages: number;
  totalElements: number;
  pageable: PageableObject;
  size: number;
  content: CardDetail[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminProductListResponse {
  content: ProductDetail[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  pictureUrl: string;
  branchName: string;
  discountCode?: string;
}

export interface VariantFormData {
  value: number;
  price: number;
  currency: string;
}

export interface AddStockFormData {
  activationCodes: string; // Multi-line textarea
  expirationDate: string;
  activationDate: string;
}

// For the card detail in inventory
export interface CardDetail {
  storageId: number;
  serial: string;
  activateCode: string;
  expirationDate: string;
  status: StorageStatus;
  productName: string;
}

export interface CardDetailPageResponse {
  content: CardDetail[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface InventoryFilters {
  variantId?: number;
  status?: StorageStatus;
  codeKeyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageCardDetailResponse extends Page<CardDetailResponse> {}
