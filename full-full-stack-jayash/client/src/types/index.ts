export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface FilterOptions {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 