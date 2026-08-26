import api from './api';

const extractList = (payload, label = 'appointments') => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.appointments)) {
    return payload.appointments;
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

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get('/appointments/my');
  return extractList(response.data, 'appointments');
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};