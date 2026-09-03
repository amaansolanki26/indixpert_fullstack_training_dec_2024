import api from "./api";

// Helpers to extract IDs dynamically safely
const getConversationId = (idOrObj) => {
    return idOrObj?.conversation_id || idOrObj?.id || idOrObj;
};

const getMessageId = (idOrObj) => {
    return idOrObj?.message_id || idOrObj?.id || idOrObj;
};

// Payload Builders for clean structures matching Swagger & SQL Schema
const buildConversationPayload = (payload) => {
    return {
        conversation_no: payload.conversation_no || null,
        participant_name: payload.participant_name?.trim() || "",
        participant_role: payload.participant_role?.trim() || "customer",
        customer_id: payload.customer_id ? Number(payload.customer_id) : null,
        admin_id: payload.admin_id ? Number(payload.admin_id) : null,
        avatar_url: payload.avatar_url || null,
        avatar_text: payload.avatar_text || null,
        is_online: payload.hasOwnProperty("is_online") ? payload.is_online : false,
        is_active: payload.hasOwnProperty("is_active") ? payload.is_active : true,
        last_message: payload.last_message || null,
        last_message_time: payload.last_message_time || null,
        unread_count: Number(payload.unread_count || 0),
        is_read: payload.hasOwnProperty("is_read") ? payload.is_read : false,
    };
};

const buildMessagePayload = (payload) => {
    return {
        conversation_id: Number(getConversationId(payload.conversation_id)),
        sender_id: String(payload.sender_id),
        sender_type: payload.sender_type || "admin", // admin, customer, chef, kitchen_admin etc.
        message_type: payload.message_type || "text",
        message_text: payload.message_text?.trim() || "",
        attachment_url: payload.attachment_url || null,
        attachment_type: payload.attachment_type || null,
        is_read: payload.hasOwnProperty("is_read") ? payload.is_read : false,
        is_active: payload.hasOwnProperty("is_active") ? payload.is_active : true,
    };
};

export const messageService = {
    /*
    |--------------------------------------------------------------------------
    | MESSAGE CONVERSATIONS CRUD (Sidebar & User Status)
    |--------------------------------------------------------------------------
    */

    // Get all conversations list (For sidebar display)
    getConversations: () => api.get("/message-conversations"),

    // Get single conversation profile details by ID
    getConversationById: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.get(`/message-conversations/${id}`);
    },

    // Create a new conversation channel
    createConversation: (payload) => {
        const jsonPayload = buildConversationPayload(payload);
        return api.post("/message-conversations", jsonPayload);
    },

    // Update conversation metadata
    updateConversation: (conversationId, payload) => {
        const id = getConversationId(conversationId);
        const jsonPayload = buildConversationPayload(payload);
        return api.put(`/message-conversations/${id}`, jsonPayload);
    },

    // Delete conversation channel completely
    deleteConversation: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.delete(`/message-conversations/${id}`);
    },

    // Mark all messages within a specific conversation as Read
    markConversationRead: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.patch(`/message-conversations/${id}/read`);
    },

    // Dynamic Online/Offline status switch toggle
    updateOnlineStatus: (conversationId, isOnline) => {
        const id = getConversationId(conversationId);
        return api.patch(`/message-conversations/${id}/online-status`, { is_online: isOnline });
    },

    // Restore a soft-deleted conversation
    restoreConversation: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.patch(`/message-conversations/restore/${id}`);
    },

    /*
    |--------------------------------------------------------------------------
    | MESSAGES CRUD (Actual Chat Bubbles)
    |--------------------------------------------------------------------------
    */

    // Fetch all existing system messages
    getAllMessages: () => api.get("/messages"),

    // Send/Post a brand new message inside a conversation
    createMessage: (payload) => {
        const jsonPayload = buildMessagePayload(payload);
        return api.post("/messages", jsonPayload);
    },

    // Load full chat history bubbles dynamically for the selected active user
    getMessagesByConversation: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.get(`/messages/conversation/${id}`);
    },

    // Delete full chat history bubble logs from a conversation container
    deleteMessagesByConversation: (conversationId) => {
        const id = getConversationId(conversationId);
        return api.delete(`/messages/conversation/${id}`);
    },

    // Soft-delete/Undo specific single message bubble
    restoreMessage: (messageId) => {
        const id = getMessageId(messageId);
        return api.patch(`/messages/restore/${id}`);
    },

    // Get detail specs of a single message ID instance
    getMessageById: (messageId) => {
        const id = getMessageId(messageId);
        return api.get(`/messages/${id}`);
    },

    // Edit/Update text context inside a single message string bubble
    updateMessage: (messageId, payload) => {
        const id = getMessageId(messageId);
        const jsonPayload = buildMessagePayload(payload);
        return api.put(`/messages/${id}`, jsonPayload);
    },

    // Hard delete a single message record node item
    deleteMessage: (messageId) => {
        const id = getMessageId(messageId);
        return api.delete(`/messages/${id}`);
    },

    // Mark one single message specific state context as read
    markMessageRead: (messageId) => {
        const id = getMessageId(messageId);
        return api.patch(`/messages/${id}/read`);
    }
};