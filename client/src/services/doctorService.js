import api from './api';

export const getDoctors = async (params) => {
  const res = await api.get('/doctors', { params });
  return res.data;
};

export const getDoctorById = async (id) => {
  const res = await api.get(`/doctors/${id}`);
  return res.data;
};

export const createDoctor = async (data) => {
  const res = await api.post('/doctors', data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await api.put(`/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await api.delete(`/doctors/${id}`);
  return res.data;
};