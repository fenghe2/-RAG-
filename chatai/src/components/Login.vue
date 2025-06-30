<template>
    <div class="auth-container">
        <h2>登录</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username">用户名</label>
                <input v-model="username" type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input v-model="password" type="password" id="password" required>
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? '登录中...' : '登录' }}
            </button>
            <p class="switch-text">
                没有账号？<router-link to="/register">注册</router-link>
            </p>
            <p v-if="error" class="error-message">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { authApi } from '@/api'
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

    const handleLogin = async () => {
        try {
            isLoading.value = true
            error.value = ''

            // 使用 URLSearchParams 转换数据格式
            const formData = new URLSearchParams()
            formData.append('username', username.value)
            formData.append('password', password.value)

            const response = await authApi.login(formData)

            authStore.setToken(response.access_token)

            // 获取完整用户信息
            const userProfile = await authApi.getProfile()
            authStore.setUser(userProfile)

            router.push('/Chat')
        } catch (err) {
            error.value = err.detail || '登录失败'
        } finally {
            isLoading.value = false
        }
    }
</script>

<style scoped>
    .auth-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
    }

    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #555;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
    }

        button:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }

    .switch-text {
        text-align: center;
        margin-top: 1rem;
        color: #666;
    }

    a {
        color: #3b82f6;
        text-decoration: none;
    }

    .error-message {
        color: #ef4444;
        text-align: center;
        margin-top: 1rem;
    }
</style>
[file content end]