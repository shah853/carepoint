import api from './api';

const extractProducts = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (typeof payload === 'string' && payload.trim().startsWith('<!')) {
    throw new Error('Unexpected products response: received HTML instead of JSON');
  }

  console.error('Unexpected products response:', payload);
  return [];
};

export const getProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  return extractProducts(res.data);
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};