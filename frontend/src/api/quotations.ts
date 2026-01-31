import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export const getOrCreateCart = async () => {
  const res = await api.post("/quotations/current");
  return res.data;
};

export const addToCart = async (
  quotationId: string,
  payload: {
    product_id: string;
    variant_id?: string;
    rental_start: string;
    rental_end: string;
    quantity: number;
  }
) => {
  await api.post(`/quotations/${quotationId}/lines`, payload);
};

export const removeCartLine = async (lineId: string) => {
  await api.delete(`/quotations/lines/${lineId}`);
};
