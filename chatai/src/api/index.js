// src/api/index.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(config => {
    const authStore = useAuthStore()  // 添加这行
    const token = authStore.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
api.interceptors.response.use(response => {
    return response.data
}, error => {
    // 不拦截登录请求的401错误
    if (error.config.url.includes('/login')) {
        return Promise.reject(error.response?.data || error.message)
    }

    if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
})
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }),
    getProfile: () => api.get('/auth/me')
}

export default api