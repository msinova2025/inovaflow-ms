import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token (from Keycloak eventually)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const challengesApi = {
    getAll: () => api.get('/challenges').then(res => res.data),
    getById: (id: string) => api.get(`/challenges/${id}`).then(res => res.data),
    create: (data: any) => api.post('/challenges', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/challenges/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/challenges/${id}`).then(res => res.data),
    getMy: () => api.get('/challenges/my').then(res => res.data),
};

export const solutionsApi = {
    getAll: () => api.get('/solutions').then(res => res.data),
    getByChallengeId: (challengeId: string) => api.get(`/solutions/challenge/${challengeId}`).then(res => res.data),
    getById: (id: string) => api.get(`/solutions/${id}`).then(res => res.data),
    create: (data: any) => api.post('/solutions', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/solutions/${id}`, data).then(res => res.data),
    updateStatus: (id: string, status: string | number) => api.patch(`/solutions/${id}/status`, { status }).then(res => res.data),
    getStatuses: () => api.get('/solutions/statuses').then(res => res.data),
    delete: (id: string) => api.delete(`/solutions/${id}`).then(res => res.data),
    getMy: () => api.get('/solutions/my').then(res => res.data),
};

export const statsApi = {
    get: () => api.get('/stats').then(res => res.data),
};

export const newsApi = {
    getAll: (limit?: number) => api.get('/news', { params: { limit } }).then(res => res.data),
    getById: (id: string) => api.get(`/news/${id}`).then(res => res.data),
    create: (data: any) => api.post('/news', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/news/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/news/${id}`).then(res => res.data),
};

export const eventsApi = {
    getAll: (limit?: number, upcoming?: boolean) => api.get('/events', { params: { limit, upcoming } }).then(res => res.data),
    getById: (id: string) => api.get(`/events/${id}`).then(res => res.data),
    create: (data: any) => api.post('/events', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/events/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/events/${id}`).then(res => res.data),
};

export const geralApi = {
    get: () => api.get('/geral').then(res => res.data),
    update: (id: string, data: any) => api.put(`/geral/${id}`, data).then(res => res.data),
};

export const solutionStatusesApi = {
    getAll: () => api.get('/solutions/statuses').then(res => res.data),
    create: (data: any) => api.post('/solutions/statuses', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/solutions/statuses/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/solutions/statuses/${id}`).then(res => res.data),
};

export const usersApi = {
    getAll: () => api.get('/users').then(res => res.data),
    getById: (id: string) => api.get(`/users/${id}`).then(res => res.data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/users/${id}`).then(res => res.data),
};

export const howToParticipateApi = {
    getAll: () => api.get('/how-to-participate').then(res => res.data),
    create: (data: any) => api.post('/how-to-participate', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/how-to-participate/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/how-to-participate/${id}`).then(res => res.data),
};

export const programApi = {
    getAll: () => api.get('/program').then(res => res.data),
    create: (data: any) => api.post('/program', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/program/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/program/${id}`).then(res => res.data),
};

export const authApi = {
    login: (data: any) => api.post('/auth/login', data).then(res => res.data),
    register: (data: any) => api.post('/auth/register', data).then(res => res.data),
    getMe: () => api.get('/auth/me').then(res => res.data),
    upload: (data: FormData) => api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};

export default api;
