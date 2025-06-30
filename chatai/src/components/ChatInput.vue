<template>
    <div class="chat-input-container">
        <select v-model="store.model" class="model-selector">
            <option v-for="model in store.availableModels" :key="model" :value="model">
                {{ model }}
            </option>
        </select>
        <input v-model="message"
               @keyup.enter="sendMessage"
               placeholder="给DeepSeek发送消息"
               :disabled="store.isLoading"
               class="message-input" />
        <button @click="sendMessage"
                :disabled="store.isLoading || !message.trim()"
                class="send-button">
            {{ store.isLoading ? 'Sending...' : '发送' }}
        </button>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useChatStore } from '../stores/chat'

    const store = useChatStore()
    const message = ref('')

    const sendMessage = () => {
        if (message.value.trim()) {
            store.sendMessageToOllama(message.value)
            message.value = ''
        }
    }
</script>

<style scoped>
    .chat-input-container {
        display: flex;
        gap: 0.5rem;
        padding: 1.0rem;
        background-color: white;
        position: sticky;
        bottom: 0;
    }

    .model-selector {
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #d1d5db;
    }

    .message-input {
        flex: 1;
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #d1d5db;
    }

    .send-button {
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }

        .send-button:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
</style>