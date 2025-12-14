// src/hooks/useChatSocket.ts
import { useCallback, useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuthStore } from '@/store/auth-store';
import { IConversation } from '@/types/Conversation';
import { Message } from '@/types/Message';

interface TypingSignal {
  conversationID: string;
  isTyping: boolean;
  senderID?: string;
}

export const useChatSocket = () => {
  const { socket, isConnected } = useSocket();
  const user = useAuthStore((state) => state.user);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Start conversation (tạo hoặc lấy conversation)
  const startConversation = useCallback(
    (buyerID: string, ownerID: string): Promise<IConversation> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket not connected'));
          return;
        }
        socket.emit('start_conversation', { buyerID, ownerID }, (response: any) => {
          if (response.status === 'ok') {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Failed to start conversation'));
          }
        });
      });
    },
    [socket]
  );

  // Join conversation room
  const joinConversation = useCallback(
    (conversationID: string) => {
      if (!socket) return;
      socket.emit('join_conversation', conversationID);
      console.log('📥 Joined conversation:', conversationID);
    },
    [socket]
  );

  // Leave conversation room
  const leaveConversation = useCallback(
    (conversationID: string) => {
      if (!socket) return;
      socket.emit('leave_conversation', conversationID);
      console.log('📤 Left conversation:', conversationID);
    },
    [socket]
  );

  // Send message
  const sendMessage = useCallback(
    (
      conversationID: string,
      content: string,
      type: 'Text' | 'Image' = 'Text'
    ): Promise<Message> => {
      return new Promise((resolve, reject) => {
        if (!socket || !user) {
          reject(new Error('Socket not connected or user not logged in'));
          return;
        }

        socket.emit(
          'send_message',
          {
            conversationID,
            senderID: user._id,
            content,
            type,
          },
          (response: any) => {
            if (response.status === 'ok') {
              // Thêm message vào local state
              setMessages((prev) => [...prev, response.data]);
              resolve(response.data);
            } else {
              reject(new Error(response.message || 'Failed to send message'));
            }
          }
        );
      });
    },
    [socket, user]
  );

  // Typing indicators
  const startTyping = useCallback(
    (conversationID: string) => {
      if (!socket) return;
      socket.emit('typing_start', conversationID);
    },
    [socket]
  );

  const stopTyping = useCallback(
    (conversationID: string) => {
      if (!socket) return;
      socket.emit('typing_stop', conversationID);
    },
    [socket]
  );

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      console.log('📨 Received message:', message);
      setMessages((prev) => [...prev, message]);
    };

    const handleTypingSignal = (signal: TypingSignal) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (signal.isTyping && signal.senderID) {
          newSet.add(signal.senderID);
        } else if (signal.senderID) {
          newSet.delete(signal.senderID);
        }
        return newSet;
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_signal', handleTypingSignal);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_signal', handleTypingSignal);
    };
  }, [socket]);

  // Clear messages when leaving
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    typingUsers,
    startConversation,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
  };
};

export default useChatSocket;