import { create } from 'zustand';
import apiClient from '../api/client';

export interface Message {
  id: string;
  sender: 'user' | 'zero';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'voice';
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;

  // Actions
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  sendMessage: async (content: string) => {
    set({ isLoading: true });
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content,
        timestamp: new Date(),
        type: 'text'
      };

      set((state) => ({
        messages: [...state.messages, userMessage]
      }));

      // Connect to backend FastAPI - Chat with Zero
      try {
        const response = await apiClient.post('/chat', { message: content });

        const zeroData = response.data;
        const zeroMessage: Message = {
          id: zeroData.id,
          sender: 'zero',
          content: zeroData.content,
          timestamp: new Date(zeroData.timestamp),
          type: zeroData.type || 'text'
        };

        set((state) => ({
          messages: [...state.messages, zeroMessage],
          isLoading: false
        }));

      } catch (apiError) {
        console.error('Error connecting to chat backend:', apiError);

        // Fallback response if backend fails
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'zero',
          content: 'Disculpa, tuve un problema conectándome al servidor. Por favor intenta de nuevo.',
          timestamp: new Date(),
          type: 'text'
        };

        set((state) => ({
          messages: [...state.messages, errorMessage],
          isLoading: false
        }));
      }

    } catch (error) {
      console.error('Send message failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
