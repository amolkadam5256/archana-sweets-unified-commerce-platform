export type UUID = string;

export interface ApiMeta {
  requestId: string;
  pagination?: {
    cursor: string | null;
    hasMore: boolean;
    total?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta: ApiMeta;
}

export interface Tenant {
  id: UUID;
  name: string;
  slug: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial";
}

export interface User {
  id: UUID;
  tenantId: UUID;
  email: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  roles: string[];
  permissions: string[];
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface Product {
  id: UUID;
  tenantId: UUID;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  stockStatus: "in_stock" | "out_of_stock" | "preorder";
  categoryId: UUID;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  parentId: UUID | null;
  isActive: boolean;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partial_refund";
  totalAmount: number;
  currency: string;
  placedAt: string;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  services: Record<string, "up" | "down">;
}
