const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  company_name?: string;
  business_category?: string;
  gstin?: string;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedUsers {
  items: AdminUser[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DashboardStats {
  total_users: number;
  total_vendors: number;
  total_customers: number;
  active_users: number;
  new_users_this_month: number;
  new_vendors_this_month: number;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_vendors: number;
  recent_activities: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  company_name?: string;
  business_category?: string;
  gstin?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
}

class AdminApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/admin`;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }
    return response.json();
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/dashboard/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<DashboardStats>(response);
  }

  async getFullDashboard(): Promise<AdminDashboardData> {
    // Fetch multiple endpoints in parallel
    const [stats, products, orders, invoices, pendingVendors] = await Promise.all([
      this.getDashboardStats(),
      this.getProductsCount(),
      this.getOrdersCount(),
      this.getTotalRevenue(),
      this.getPendingVendorsCount()
    ]);

    return {
      stats,
      total_products: products,
      total_orders: orders,
      total_revenue: invoices,
      pending_vendors: pendingVendors,
      recent_activities: []
    };
  }

  private async getProductsCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: this.getHeaders()
      });
      const products = await this.handleResponse<any[]>(response);
      return products.length;
    } catch {
      return 0;
    }
  }

  private async getOrdersCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: this.getHeaders()
      });
      const orders = await this.handleResponse<any[]>(response);
      return orders.length;
    } catch {
      return 0;
    }
  }

  private async getTotalRevenue(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices`, {
        headers: this.getHeaders()
      });
      const invoices = await this.handleResponse<any[]>(response);
      return invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0);
    } catch {
      return 0;
    }
  }

  private async getPendingVendorsCount(): Promise<number> {
    try {
      const vendors = await this.getVendors({ is_active: false });
      return vendors.total;
    } catch {
      return 0;
    }
  }

  // Users
  async getUsers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
    is_active?: boolean;
  }): Promise<PaginatedUsers> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.per_page) searchParams.append('per_page', String(params.per_page));
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.is_active !== undefined) searchParams.append('is_active', String(params.is_active));

    const url = `${this.baseUrl}/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    return this.handleResponse<PaginatedUsers>(response);
  }

  async getUser(id: string): Promise<AdminUser> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<AdminUser>(response);
  }

  async createUser(data: CreateUserData): Promise<AdminUser> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<AdminUser>(response);
  }

  async updateUserStatus(id: string, is_active: boolean): Promise<AdminUser> {
    const response = await fetch(`${this.baseUrl}/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ is_active })
    });
    return this.handleResponse<AdminUser>(response);
  }

  async updateUserRole(id: string, role: 'CUSTOMER' | 'VENDOR' | 'ADMIN'): Promise<AdminUser> {
    const response = await fetch(`${this.baseUrl}/users/${id}/role`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ role })
    });
    return this.handleResponse<AdminUser>(response);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Vendors
  async getVendors(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedUsers> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.per_page) searchParams.append('per_page', String(params.per_page));
    if (params?.search) searchParams.append('search', params.search);
    if (params?.is_active !== undefined) searchParams.append('is_active', String(params.is_active));

    const url = `${this.baseUrl}/vendors${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    return this.handleResponse<PaginatedUsers>(response);
  }

  async approveVendor(id: string, approved: boolean, rejection_reason?: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/vendors/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ approved, rejection_reason })
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Categories (uses products API)
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/api/products/categories`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<Category[]>(response);
  }

  async createCategory(data: { name: string; description?: string }): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/products/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<Category>(response);
  }

  async updateCategory(id: string, data: { name?: string; description?: string; is_active?: boolean }): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/products/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<Category>(response);
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/products/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }
}

export const adminApi = new AdminApi();
