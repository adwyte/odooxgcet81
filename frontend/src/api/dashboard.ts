const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface TopProduct {
  name: string;
  rentals: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  active_rentals: number;
  pending_returns: number;
  total_products: number;
  top_products: TopProduct[];
  revenue_by_month: RevenueByMonth[];
  orders_by_status: OrdersByStatus[];
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  vendor_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

class DashboardApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/dashboard`;
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

  async getStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<DashboardStats>(response);
  }

  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    const response = await fetch(`${this.baseUrl}/recent-orders?limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<RecentOrder[]>(response);
  }
}

export const dashboardApi = new DashboardApi();
