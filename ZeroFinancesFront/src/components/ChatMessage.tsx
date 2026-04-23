import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/chatStore';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

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
          isUser ? styles.userBubble : styles.zeroBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.zeroText
          ]}
        >
          {message.content}
        </Text>
        <Text style={styles.timestamp}>
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
  userBubble: {
    backgroundColor: '#007AFF',
  },
  zeroBubble: {
    backgroundColor: '#e9ecef',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  zeroText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    color: '#666',
  },
});
