import api from './api';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (productId, quantity) => {
  const res = await api.post('/cart', { productId, quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart');
  return res.data;
};