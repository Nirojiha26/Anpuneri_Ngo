import api from './api';

// ── Auth ──────────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ── Projects ──────────────────────────────────────────────────
export const projectService = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/projects', { params }),
  create: (data) => api.post('/admin/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/projects/${id}`),
};

// ── Events ──────────────────────────────────────────────────────
export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  register: (id, data) => api.post(`/events/${id}/register`, data),
  // Admin
  adminGetAll: (params) => api.get('/admin/events', { params }),
  create: (data) => api.post('/admin/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/events/${id}`),
  adminGetRegistrations: (params) => api.get('/admin/event-registrations', { params }),
};

// ── News ──────────────────────────────────────────────────────
export const newsService = {
  getAll: (params) => api.get('/news', { params }),
  getOne: (id) => api.get(`/news/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/news', { params }),
  create: (data) => api.post('/admin/news', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/news/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/news/${id}`),
};

// ── Gallery ──────────────────────────────────────────────────────
export const galleryService = {
  getAll: (params) => api.get('/gallery', { params }),
  // Admin
  adminGetAll: (params) => api.get('/admin/gallery', { params }),
  upload: (data) => api.post('/admin/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/gallery/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/gallery/${id}`),
};

// ── Team ──────────────────────────────────────────────────────
export const teamService = {
  getAll: (params) => api.get('/team', { params }),
  // Admin
  adminGetAll: (params) => api.get('/admin/team', { params }),
  create: (data) => api.post('/admin/team', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/team/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/team/${id}`),
};

// ── Testimonials ──────────────────────────────────────────────────────
export const testimonialService = {
  getAll: (params) => api.get('/testimonials', { params }),
  // Admin
  adminGetAll: (params) => api.get('/admin/testimonials', { params }),
  create: (data) => api.post('/admin/testimonials', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/testimonials/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/testimonials/${id}`),
};

// ── FAQs ──────────────────────────────────────────────────────
export const faqService = {
  getAll: (params) => api.get('/faqs', { params }),
  // Admin
  adminGetAll: (params) => api.get('/admin/faqs', { params }),
  create: (data) => api.post('/admin/faqs', data),
  update: (id, data) => api.put(`/admin/faqs/${id}`, data),
  delete: (id) => api.delete(`/admin/faqs/${id}`),
};

// ── Success Stories ──────────────────────────────────────────────────────
export const successStoryService = {
  getAll: (params) => api.get('/success-stories', { params }),
  getOne: (id) => api.get(`/success-stories/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/success-stories', { params }),
  create: (data) => api.post('/admin/success-stories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/success-stories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/success-stories/${id}`),
};

// ── Volunteer ──────────────────────────────────────────────────────
export const volunteerService = {
  apply: (data) => api.post('/volunteer', data),
  // Admin
  adminGetAll: (params) => api.get('/admin/volunteers', { params }),
  getOne: (id) => api.get(`/admin/volunteers/${id}`),
  update: (id, data) => api.put(`/admin/volunteers/${id}`, data),
  delete: (id) => api.delete(`/admin/volunteers/${id}`),
};

// ── Donations ──────────────────────────────────────────────────────
export const donationService = {
  donate: (data) => api.post('/donate', data),
  // Admin
  adminGetAll: (params) => api.get('/admin/donations', { params }),
  getOne: (id) => api.get(`/admin/donations/${id}`),
  getStats: () => api.get('/admin/donations/stats'),
  updateStatus: (id, data) => api.patch(`/admin/donations/${id}/status`, data),
};

// ── Contact ──────────────────────────────────────────────────────
export const contactService = {
  submit: (data) => api.post('/contact', data),
  // Admin
  adminGetAll: (params) => api.get('/admin/contacts', { params }),
  getOne: (id) => api.get(`/admin/contacts/${id}`),
  updateStatus: (id, data) => api.patch(`/admin/contacts/${id}/status`, data),
  delete: (id) => api.delete(`/admin/contacts/${id}`),
};

// ── Dashboard ──────────────────────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/admin/dashboard'),
  getPublicStats: () => api.get('/stats'),
};

// ── Settings ──────────────────────────────────────────────────────
export const settingsService = {
  getPublic: () => api.get('/settings'),
  adminGetAll: (params) => api.get('/admin/settings', { params }),
  update: (data) => api.put('/admin/settings', data),
  updateSingle: (key, value) => api.patch(`/admin/settings/${key}`, { value }),
};

// ── Users ──────────────────────────────────────────────────────
export const userService = {
  getAll: (params) => api.get('/admin/users', { params }),
  updateStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
};

// ── Sliders ──────────────────────────────────────────────────────
export const sliderService = {
  getPublic: () => api.get('/sliders'),
  // Admin
  adminGetAll: (params) => api.get('/admin/sliders', { params }),
  create: (data) => api.post('/admin/sliders', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/admin/sliders/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admin/sliders/${id}`),
};

