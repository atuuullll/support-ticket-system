import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH APIS =============
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// ============= TICKET APIS =============
export const createTicket = (data) => API.post('/tickets', data);
export const getTickets = (params) => API.get('/tickets', { params });
export const getTicket = (id) => API.get(`/tickets/${id}`);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
export const addInternalNote = (id, data) => API.post(`/tickets/${id}/notes`, data);

// ============= COMMENT APIS (will add later) =============
export const getComments = (ticketId) => API.get(`/comments/${ticketId}`);
export const addComment = (ticketId, data) => API.post(`/comments/${ticketId}`, data);

// ============= FEEDBACK APIS (will add later) =============
export const createFeedback = (data) => API.post('/feedback', data);
export const getFeedback = () => API.get('/feedback');

export default API;
