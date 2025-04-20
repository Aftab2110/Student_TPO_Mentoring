import React, { useState } from 'react';
import {
  Box,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import ChatComponent from './ChatComponent';

const MentorshipChat = ({ chatId, studentDetails }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meetingNotes, setMeetingNotes] = useState({
    date: '',
    notes: '',
    actionItems: '',
  });

  const handleSaveMeetingNotes = () => {
    // TODO: Implement API call to save meeting notes
    const formattedNotes = {
      ...meetingNotes,
      actionItems: meetingNotes.actionItems.split('\n'),
    };
    console.log('Saving meeting notes:', formattedNotes);
    onClose();
  };

  return (
    <Box w="100%">
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Chat</Tab>
          <Tab>Session Details</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ChatComponent chatId={chatId} />
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>
                  Mentorship Goals
                </Text>
                <Text>{studentDetails?.mentorshipDetails?.goals?.join(', ') || 'No goals set'}</Text>
              </Box>

              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>
                  Progress
                </Text>
                <Text>
                  {studentDetails?.mentorshipDetails?.progress || 'not_started'}
                </Text>
              </Box>

              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold" mb={2}>
                  Meeting Notes
                </Text>
                <Button colorScheme="brand" size="sm" onClick={onOpen}>
                  Add Meeting Notes
                </Button>

                {studentDetails?.mentorshipDetails?.meetingNotes?.map((note, index) => (
                  <Box key={index} mt={4} p={4} bg="gray.50" borderRadius="md">
                    <Text fontWeight="semibold">
                      {new Date(note.date).toLocaleDateString()}
                    </Text>
                    <Text mt={2}>{note.notes}</Text>
                    <Text mt={2} fontWeight="semibold">
                      Action Items:
                    </Text>
                    <ul>
                      {note.actionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </Box>
                ))}
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Meeting Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={meetingNotes.date}
                onChange={(e) =>
                  setMeetingNotes({ ...meetingNotes, date: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={meetingNotes.notes}
                onChange={(e) =>
                  setMeetingNotes({ ...meetingNotes, notes: e.target.value })
                }
                placeholder="Enter meeting notes..."
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Action Items (one per line)</FormLabel>
              <Textarea
                value={meetingNotes.actionItems}
                onChange={(e) =>
                  setMeetingNotes({ ...meetingNotes, actionItems: e.target.value })
                }
                placeholder="Enter action items..."
              />
            </FormControl>

            <Button
              colorScheme="brand"
              mr={3}
              mt={4}
              onClick={handleSaveMeetingNotes}
            >
              Save
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MentorshipChat;