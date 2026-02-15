
export enum Category {
  AI = 'AI Tools',
  DESIGN = 'Design',
  VPN = 'VPN',
  DEV = 'Development',
  OTHER = 'Other'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  features: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  provider: 'google' | 'facebook' | 'credentials';
}

export interface VaultItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  licenseKey: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring-soon';
}

export interface UsageData {
  productId: string;
  productName: string;
  activeUsers: number;
  plans: {
    name: string;
    count: number;
    revenue: number;
  }[];
}

export interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  productName: string;
  price: number;
  senderName: string;
  bankName: 'KBZ' | 'AYA';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  cart: CartItem[];
  products: Product[];
}
