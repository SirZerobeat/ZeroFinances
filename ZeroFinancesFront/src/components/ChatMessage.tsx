import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/chatStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userContainer : styles.zeroContainer
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUser
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.surface }
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? { color: '#fff' } : { color: colors.text }
          ]}
        >
          {message.content}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  zeroContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
});
