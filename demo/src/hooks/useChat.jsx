// frontend/src/hooks/useChat.js
import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { getMessages, getConversations } from '../services/chatService';

export const useChat = (currentUser) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Join user's room
      socket.emit('join', currentUser._id);
      
      // Load conversations
      const loadConversations = async () => {
        const data = await getConversations(currentUser._id);
        setConversations(data);
      };
      loadConversations();
    }

    // Setup socket listeners
    socket.on('newMessage', (message) => {
      if (currentChat && 
          (message.sender._id === currentChat._id || 
           message.receiver._id === currentChat._id)) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [currentUser, currentChat]);

  const loadMessages = async (userId) => {
    const data = await getMessages(currentUser._id, userId);
    setMessages(data);
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentUser && currentChat) {
      socket.emit('sendMessage', {
        senderId: currentUser._id,
        receiverId: currentChat._id,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  const markAsRead = (messageIds) => {
    if (messageIds.length > 0) {
      socket.emit('markAsRead', {
        messageIds,
        userId: currentUser._id
      });
    }
  };

  return {
    conversations,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    loadMessages,
    sendMessage,
    markAsRead
  };
};