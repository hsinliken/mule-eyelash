
export interface Service {
  id: string;
  title: string;
  price: number;
  duration: number; // in minutes
  image: string;
  category: 'Lash' | 'Brow' | 'Lip' | 'Care';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string; // e.g., "資深美睫師"
  image: string;
  rating: number;
  specialties: ('Lash' | 'Brow' | 'Lip' | 'Care')[]; // What they can do
  workDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  workHours: {
    start: string; // "10:00"
    end: string; // "20:00"
  };
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  label: string; // e.g. "當季特惠"
  active: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  stylistId: string;
  date: string; // ISO string
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface CartItem extends Product {
  quantity: number;
}

export type DeliveryMethod = 'home_delivery' | 'convenience_store';
export type PaymentMethod = 'credit_card' | 'line_pay' | 'transfer';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  delivery: {
    method: DeliveryMethod;
    address: string; // Or Store Name/Code
    trackingNumber?: string;
  };
  payment: {
    method: PaymentMethod;
    isPaid: boolean;
  };
  status: OrderStatus;
  createdAt: string;
}

export interface ShopSettings {
  name: string;
  subtitle: string;
  logo: string; // URL of the logo image
  lineId: string; // LINE ID for customer service (e.g. @mule_eyelash)
  liffId: string; // LIFF ID for Login (e.g. 1657xxx-xxxx)
}

export enum Page {
  HOME = 'HOME',
  BOOKING = 'BOOKING',
  SHOP = 'SHOP',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PROFILE = 'PROFILE',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL'
}