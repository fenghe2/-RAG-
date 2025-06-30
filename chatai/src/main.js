import './assets/main.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Chat from './components/Chat.vue' // 引入 Chat 组件
const app = createApp(App)
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        {
            path: '/chat',
            component: Chat,
            meta: { requiresAuth: true } // 需要登录才能访问
        },
        { path: '/', redirect: '/login' }
    ]
})
app.use(createPinia())
app.use(router)
app.mount('#app')
