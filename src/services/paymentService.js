import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const createPayment = async (bookingData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/payments/create`, bookingData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const verifyPayment = async (paymentId) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/payments/verify`, { paymentId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export { createPayment, verifyPayment };