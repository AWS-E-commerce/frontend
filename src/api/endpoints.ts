// src/api/endpoints.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE}/login`,
    REGISTER: `${API_BASE}/register`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: (id: number) => `${API_BASE}/products/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: `${API_BASE}/orders`,
    DETAIL: (id: number) => `${API_BASE}/orders/${id}`,
    CREATE: `${API_BASE}/orders`,
    UPDATE_STATUS: (id: number) => `${API_BASE}/orders/${id}/status`,
    HISTORY: `${API_BASE}/order/history`,
  },

  // Cart
  CART: {
    GET: `${API_BASE}/cart`,
    ADD: `${API_BASE}/cart/add`,
    UPDATE: `${API_BASE}/cart/update`,
    REMOVE: `${API_BASE}/cart/remove`,
    CLEAR: `${API_BASE}/cart/clear`,
  },

  // Payment
  PAYMENT: {
    INITIATE: `${API_BASE}/payment/initiate`,
    VERIFY: `${API_BASE}/payment/verify`,
    MOMO_CALLBACK: `${API_BASE}/payment/momo/callback`,
  },

  // User
  USER: {
    PROFILE: `${API_BASE}/user/profile`,
    UPDATE_PROFILE: `${API_BASE}/user/profile`,
  },

  ADMIN: {
    PRODUCTS: {
      LIST: `${API_BASE}/admin/products`,
      DETAIL: (id: number) => `${API_BASE}/admin/products/${id}`,
      UPDATE: (id: number) => `${API_BASE}/admin/products/${id}`,
      DELETE: (id: number) => `${API_BASE}/admin/products/${id}`,
    },
    ORDERS: {
      LIST: `${API_BASE}/admin/orders`,
      DETAIL: (id: number) => `${API_BASE}/admin/orders/${id}`,
    },
    DASHBOARD: {
      REVENUE: `${API_BASE}/admin/dashboard/revenue`,
    },
    INVENTORY: {
      STATUS: `${API_BASE}/admin/inventory/status`,
      CARDS: `${API_BASE}/admin/inventory/cards`,
      DELETE_CARD: (id: number) => `${API_BASE}/admin/inventory/cards/${id}`,
    },
  },
} as const;
