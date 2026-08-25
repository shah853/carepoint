import api from './api';

export const createOrder = async (data) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders/my');
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get('/orders/all');
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};