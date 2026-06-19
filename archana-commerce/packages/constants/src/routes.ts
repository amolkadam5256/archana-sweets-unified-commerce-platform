export const WEBSITE_ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ACCOUNT: "/account",
  ORDERS: "/account/orders",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  TRACK_ORDER: "/track-order",
} as const;

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  PRODUCTS: "/ecommerce/products",
  CATEGORIES: "/ecommerce/categories",
  ORDERS: "/orders",
  USERS: "/administration/users",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  HEALTH: "/health",
  AUTH_LOGIN: "/api/v1/auth/login",
  AUTH_REGISTER: "/api/v1/auth/register",
  AUTH_REFRESH: "/api/v1/auth/refresh",
  USERS_ME: "/api/v1/users/me",
  PRODUCTS: "/api/v1/products",
  ORDERS: "/api/v1/orders",
} as const;
