<template>
    <div class="auth-container">
        <h2>注册</h2>
        <form @submit.prevent="handleRegister">
            <div class="form-group">
                <label for="username">用户名</label>
                <input v-model="username" type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input v-model="password" type="password" id="password" required>
            </div>
            <div class="form-group">
                <label for="confirmPassword">确认密码</label>
                <input v-model="confirmPassword" type="password" id="confirmPassword" required>
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? '注册中...' : '注册' }}
            </button>
            <p class="switch-text">
                已有账号？<router-link to="/login">登录</router-link>
            </p>
            <p v-if="error" class="error-message">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    import { authApi } from '@/api'

    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const handleRegister = async () => {
        if (password.value !== confirmPassword.value) {
            error.value = '两次输入的密码不一致'
            return
        }

        try {
            isLoading.value = true
            error.value = ''
            await authApi.register({
                username: username.value,
                password: password.value
            })
            router.push('/login')
        } catch (err) {
            error.value = err.detail || '注册失败'
            if (err.response) {
                console.error('注册错误详情:', err.response.data)
            }
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