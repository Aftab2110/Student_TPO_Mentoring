import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock messages for demonstration
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'TPO',
        senderName: 'Training & Placement Officer',
        message: 'Hello! How can I help you today?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        sender: 'student',
        senderName: 'John Doe',
        message: 'I have a question about the upcoming placement drive.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: user.role,
      senderName: user.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box p={5} h="calc(100vh - 80px)" display="flex" flexDirection="column">
      <VStack
        flex={1}
        spacing={4}
        overflowY="auto"
        mb={4}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            alignSelf={msg.sender === user.role ? 'flex-end' : 'flex-start'}
            maxW="70%"
            w="auto"
          >
            <HStack
              spacing={2}
              mb={1}
              justifyContent={msg.sender === user.role ? 'flex-end' : 'flex-start'}
            >
              <Avatar size="xs" name={msg.senderName} />
              <Text fontSize="sm" color="gray.500">
                {msg.senderName}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {formatTime(msg.timestamp)}
              </Text>
            </HStack>
            <Box
              bg={msg.sender === user.role ? 'brand.500' : 'gray.100'}
              color={msg.sender === user.role ? 'white' : 'black'}
              p={3}
              borderRadius="lg"
              shadow="sm"
            >
              <Text>{msg.message}</Text>
            </Box>
          </Box>
        ))}
      </VStack>

      <Divider mb={4} />

      <HStack spacing={3}>
        <Input
          flex={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button colorScheme="brand" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default Chat;