import api from './api';

const extractList = (payload, label = 'doctors') => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.doctors)) {
    return payload.doctors;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (typeof payload === 'string' && payload.trim().startsWith('<!')) {
    throw new Error(`Unexpected ${label} response: received HTML instead of JSON`);
  }

  console.error(`Unexpected ${label} response:`, payload);
  return [];
};

export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return extractList(response.data, 'doctors');
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors', doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};