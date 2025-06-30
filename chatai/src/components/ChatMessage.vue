<template>
    <div :class="['message', message.role]">
        <div class="message-header">
            <span class="role">{{ message.role === 'user' ? 'You' : 'AI' }}</span>
            <span class="timestamp">{{ message.timestamp }}</span>
        </div>
        <div class="message-content">
            {{ message.content }}
        </div>
    </div>
</template>

<script setup>
    defineProps({
        message: {
            type: Object,
            required: true
        }
    })
</script>

<style scoped>
    .message {
        margin-bottom: 1.5rem;
        padding: 1rem;
        border-radius: 0.5rem;
        max-width: 80%;
    }

        .message.user {
            margin-left: auto;
            background-color: #3b82f6;
            color: white;
        }

        .message.assistant {
            margin-right: auto;
            background-color: #f3f4f6;
            color: #111827;
        }

        .message.system {
            margin-right: auto;
            background-color: #fef2f2;
            color: #b91c1c;
            font-style: italic;
        }

    .message-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        opacity: 0.8;
    }

    .message-content {
        white-space: pre-wrap;
    }
</style>