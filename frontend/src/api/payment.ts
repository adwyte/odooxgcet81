const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class PaymentApi {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${API_BASE_URL}/api/payment`;
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

    async createRazorpayOrder(amount: number, receipt: string): Promise<{
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        key_id: string;
    }> {
        const response = await fetch(`${this.baseUrl}/create-order`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Convert to paise
                currency: 'INR',
                receipt
            })
        });
        return this.handleResponse(response);
    }
}

export const paymentApi = new PaymentApi();
