import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const router = useRouter()

    const setUser = (userData) => {
        user.value = userData
    }

    const setToken = (newToken) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        router.push('/login')
    }

    const isAuthenticated = () => {
        return !!token.value
    }

    return {
        user,
        token,
        setUser,
        setToken,
        logout,
        isAuthenticated
    }
})