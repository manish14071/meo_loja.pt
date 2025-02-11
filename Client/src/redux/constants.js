export const BASE_URL = 
  import.meta.env.MODE === 'production' 
    ? 'https://meo-loja-pt.onrender.com' 
    : '';

export const USERS_URL = `/api/users`;
export const PRODUCTS_URL = `/api/products`;
export const ORDERS_URL = `/api/orders`;
export const PAYPAL_URL = `/api/config/paypal`;
export const UPLOAD_URL = `/api/upload`;
export const CATEGORY_URL = `/api/category`;
