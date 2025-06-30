import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useChatStore = defineStore('chat', () => {
    // 模型相关状态
    const model = ref('') // 当前选择的模型
    const availableModels = ref([]) // 可用模型列表

    // 对话相关状态
    const conversations = ref([]) // 所有对话
    const currentConversationId = ref(null) // 当前活动对话ID
    const isLoading = ref(false) // 加载状态

    // 计算属性：当前对话的消息
    const messages = computed(() => {
        const conversation = conversations.value.find(c => c.id === currentConversationId.value)
        return conversation ? conversation.messages : []
    })

    // 计算属性：当前活动对话
    const currentConversation = computed(() => {
        return conversations.value.find(c => c.id === currentConversationId.value)
    })

    // 初始化store
    const initStore = async () => {
        await fetchOllamaModels()
        // 初始化时创建一个默认对话
        if (conversations.value.length === 0) {
            createNewConversation()
        }
    }

    // 获取Ollama模型列表
    const fetchOllamaModels = async () => {
        console.log('正在加载 Ollama 模型列表...')
        try {
            const response = await axios.get('http://localhost:11434/api/tags')
            console.log('Ollama 响应:', response.data)
            if (response.data?.models?.length > 0) {
                availableModels.value = response.data.models.map(m => m.name)
                model.value = availableModels.value[0]
            } else {
                throw new Error('模型列表为空')
            }
        } catch (error) {
            console.error('加载模型失败:', error)
            availableModels.value = ['llama2']
            model.value = 'llama2'
        }
    }

    // 创建新对话
    const createNewConversation = () => {
        const newConversation = {
            id: Date.now().toString(),
            model: model.value,
            messages: [],
            createdAt: new Date(),
            title: '新对话'
        }
        conversations.value.unshift(newConversation)
        currentConversationId.value = newConversation.id
        return newConversation
    }

    // 切换对话
    const switchConversation = (conversationId) => {
        currentConversationId.value = conversationId
        // 更新当前模型为对话保存的模型
        const conversation = conversations.value.find(c => c.id === conversationId)
        if (conversation) {
            model.value = conversation.model
        }
    }

    // 删除对话
    const deleteConversation = (conversationId) => {
        conversations.value = conversations.value.filter(c => c.id !== conversationId)
        // 如果删除的是当前对话，切换到最新的对话或创建新对话
        if (currentConversationId.value === conversationId) {
            if (conversations.value.length > 0) {
                currentConversationId.value = conversations.value[0].id
            } else {
                createNewConversation()
            }
        }
    }

    // 更新对话标题
    const updateConversationTitle = (conversationId, title) => {
        const conversation = conversations.value.find(c => c.id === conversationId)
        if (conversation) {
            conversation.title = title
        }
    }

    // 添加消息到当前对话
    const addMessage = (role, content) => {
        const conversation = conversations.value.find(c => c.id === currentConversationId.value)
        if (conversation) {
            const newMessage = {
                id: Date.now(),
                role,
                content,
                timestamp: new Date().toLocaleTimeString()
            }
            conversation.messages.push(newMessage)

            // 如果这是第一条消息，设置为对话标题
            if (conversation.messages.length === 1 && role === 'user') {
                conversation.title = content.substring(0, 30) + (content.length > 30 ? '...' : '')
            }
        }
    }

    // 发送消息到Ollama
    const sendMessageToOllama = async (message) => {
        // 如果没有活动对话，创建一个新的
        if (!currentConversationId.value || !conversations.value.some(c => c.id === currentConversationId.value)) {
            createNewConversation()
        }

        isLoading.value = true
        addMessage('user', message)

        try {
            const response = await axios.post('http://localhost:11434/api/chat', {
                model: model.value,
                messages: [
                    ...messages.value.map(m => ({ role: m.role, content: m.content }))
                ],
                stream: false
            })

            addMessage('assistant', response.data.message.content)
        } catch (error) {
            addMessage('system', `Error: ${error.message}`)
        } finally {
            isLoading.value = false
        }
    }

    return {
        // 状态
        model,
        availableModels,
        conversations,
        currentConversationId,
        isLoading,

        // 计算属性
        messages,
        currentConversation,

        // 方法
        initStore,
        fetchOllamaModels,
        createNewConversation,
        switchConversation,
        deleteConversation,
        updateConversationTitle,
        addMessage,
        sendMessageToOllama
    }
})