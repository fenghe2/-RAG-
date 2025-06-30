<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>deepseek</h2>
            <button @click="createNewChat" class="new-chat-button" title="开启新对话">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>

        <div class="sidebar-content">
            <div class="model-info">
                <h3>当前模型</h3>
                <p>{{ store.model }}</p>
            </div>

            <div class="conversation-history">
                <div class="history-header">
                    <h3>历史对话</h3>
                    <button @click="createNewChat" class="icon-button" title="New Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div class="history-items">
                    <div v-for="conv in store.conversations"
                         :key="conv.id"
                         @click="switchConversation(conv.id)"
                         :class="['history-item', { active: conv.id === store.currentConversationId }]"
                         :title="formatFullDate(conv.createdAt)">
                        <div class="conv-title">
                            <span class="truncate">{{ conv.title }}</span>
                            <button v-if="conv.id === store.currentConversationId"
                                    @click.stop="deleteConversation(conv.id)"
                                    class="delete-button"
                                    title="Delete conversation">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="conv-meta">
                            <span class="model-badge">{{ conv.model }}</span>
                            <span class="conv-date">{{ formatDate(conv.createdAt) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useChatStore } from '../stores/chat'
    import { onMounted } from 'vue'

    const store = useChatStore()

    onMounted(() => {
        store.initStore()
    })

    const createNewChat = () => {
        store.createNewConversation()
    }

    const switchConversation = (id) => {
        store.switchConversation(id)
    }

    const deleteConversation = (id) => {
        if (confirm('Are you sure you want to delete this conversation?')) {
            store.deleteConversation(id)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatFullDate = (date) => {
        return new Date(date).toLocaleString()
    }
</script>

<style scoped>
    .sidebar {
        width: 260px;
        height: 100vh;
        background-color: #1f2937;
        color: #e5e7eb;
        margin: 0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #374151;
    }

    .sidebar-header {
        padding: 0.75rem 0;
        border-bottom: 1px solid #374151;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

        .sidebar-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
        }

    .new-chat-button {
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.25rem;
        padding: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
    }

        .new-chat-button:hover {
            background-color: #2563eb;
        }

    .sidebar-content {
        flex: 1;
        overflow-y: auto;
        padding-top: 0.5rem;
    }

    .model-info {
        margin-bottom: 1.5rem;
        padding: 0.75rem;
        background-color: #374151;
        border-radius: 0.375rem;
    }

        .model-info h3 {
            font-size: 0.75rem;
            color: #9ca3af;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .model-info p {
            font-size: 0.875rem;
            margin: 0;
            font-weight: 500;
        }

    .conversation-history {
        margin-bottom: 1rem;
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

        .history-header h3 {
            font-size: 0.75rem;
            color: #9ca3af;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

    .icon-button {
        background: none;
        border: none;
        color: #9ca3af;
        padding: 0.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
    }

        .icon-button:hover {
            color: #e5e7eb;
            background-color: #374151;
        }

    .history-items {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .history-item {
        padding: 0.75rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
        border: 1px solid transparent;
    }

        .history-item:hover {
            background-color: #374151;
        }

        .history-item.active {
            background-color: #374151;
            border-color: #3b82f6;
        }

    .conv-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
    }

    .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        font-size: 0.875rem;
    }

    .delete-button {
        background: none;
        border: none;
        color: #9ca3af;
        padding: 0.2rem;
        margin-left: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
    }

        .delete-button:hover {
            color: #ef4444;
            background-color: rgba(239, 68, 68, 0.1);
        }

    .conv-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .model-badge {
        background-color: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        padding: 0.1rem 0.3rem;
        border-radius: 0.25rem;
        font-size: 0.7rem;
    }

    .conv-date {
        font-size: 0.7rem;
    }
</style>