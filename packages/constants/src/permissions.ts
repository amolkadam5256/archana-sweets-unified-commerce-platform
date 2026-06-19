export const PERMISSIONS = {
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_DELETE: "users:delete",
  USERS_ADMIN: "users:admin",

  ECOMMERCE_READ: "ecommerce:read",
  ECOMMERCE_WRITE: "ecommerce:write",
  ECOMMERCE_DELETE: "ecommerce:delete",

  ORDERS_READ: "orders:read",
  ORDERS_WRITE: "orders:write",
  ORDERS_ADMIN: "orders:admin",

  CRM_READ: "crm:read",
  CRM_WRITE: "crm:write",

  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",

  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",
  SETTINGS_ADMIN: "settings:admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  CUSTOMER: "customer",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
