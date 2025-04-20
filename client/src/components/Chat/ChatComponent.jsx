import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const ChatComponent = ({ chatId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join chat room
    newSocket.emit('join_room', chatId);

    // Listen for messages
    newSocket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => newSocket.close();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        roomId: chatId,
        sender: user._id,
        senderName: user.name,
        content: message,
        timestamp: new Date(),
      };

      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  return (
    <Box w="100%" h="600px" borderWidth="1px" borderRadius="lg" p={4}>
      <VStack h="100%" spacing={4}>
        <Box
          flex={1}
          w="100%"
          overflowY="auto"
          borderWidth="1px"
          borderRadius="md"
          p={4}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              bg={msg.sender === user._id ? 'brand.100' : 'gray.100'}
              alignSelf={msg.sender === user._id ? 'flex-end' : 'flex-start'}
              borderRadius="md"
              p={2}
              mb={2}
              maxW="70%"
            >
              <Text fontSize="sm" color="gray.500">
                {msg.senderName}
              </Text>
              <Text>{msg.content}</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <HStack w="100%">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button colorScheme="brand" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatComponent;