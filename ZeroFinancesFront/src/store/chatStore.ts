import { create } from 'zustand';

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
      // Agregar mensaje del usuario
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

      // TODO: Conectar con el backend FastAPI/Gemini
      // const response = await axios.post('http://localhost:8000/chat', { message: content });
      // const zeroResponse = response.data.reply;

      // Mock para desarrollo
      const zeroMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'zero',
        content: 'Entendido. Aquí te ayudaré a gestionar tus finanzas. ¿Qué necesitas hacer hoy?',
        timestamp: new Date(),
        type: 'text'
      };

      set((state) => ({
        messages: [...state.messages, zeroMessage],
        isLoading: false
      }));
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
