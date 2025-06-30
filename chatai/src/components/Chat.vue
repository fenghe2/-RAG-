
<template>
    <div class="app-container">
        <Sidebar />
        <div class="chat-container">
            <div class="messages-container">
                <ChatMessage v-for="message in store.messages"
                             :key="message.id"
                             :message="message" />
                <div v-if="store.isLoading" class="loading-indicator">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <ChatInput />
        </div>
    </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const store = useChatStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated()) {
    store.initStore()
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
    .app-container {
        display: flex;
        width: 100%;
        height: 100vh;
        margin: 0; /* 清除边距 */
        padding: 0; /* 清除内边距 */
    }

    .chat-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #f9fafb;
        width: 100vh;
      
    }

    .messages-container {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .loading-indicator {
        padding: 1rem;
        display: flex;
        justify-content: center;
    }

    .typing-indicator {
        display: flex;
        gap: 0.25rem;
    }

        .typing-indicator span {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #9ca3af;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }

            .typing-indicator span:nth-child(1) {
                animation-delay: -0.32s;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: -0.16s;
            }

    @keyframes bounce {
        0%, 80%, 100% {
            transform: scale(0);
        }

        40% {
            transform: scale(1);
        }
    }
</style>