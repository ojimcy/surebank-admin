// CustomDateModal.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import MiniCalendar from 'components/calendar/MiniCalendar';

const CustomDateModal = ({ isOpen, onClose, handleCustomDateApply }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isMiniCalendarOpen, setIsMiniCalendarOpen] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('start');

  const openMiniCalendar = (dateType) => {
    setIsMiniCalendarOpen(true);
    setSelectedDateType(dateType);
  };

  const handleMiniCalendarDateChange = (selectedDate) => {
    if (selectedDateType === 'start') {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
    setIsMiniCalendarOpen(false);
  };

  const handleCustomDateApplyClick = () => {
    handleCustomDateApply(startDate.getTime(), endDate.getTime());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Custom Date Selection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="4">
            <Flex direction="row" justify="space-between">
              <Box>
                <Text fontSize="sm" mb="2">
                  Start Date
                </Text>
                <Box
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="md"
                  p="2"
                  onClick={() => openMiniCalendar('start')}
                  cursor="pointer"
                >
                  <Text>{format(startDate, 'MMMM dd, yyyy')}</Text>
                </Box>
              </Box>
              <Box>
                <Text fontSize="sm" mb="2">
                  To
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" mb="2">
                  End Date
                </Text>
                <Box
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="md"
                  p="2"
                  onClick={() => openMiniCalendar('end')}
                  cursor="pointer"
                >
                  <Text>{format(endDate, 'MMMM dd, yyyy')}</Text>
                </Box>
              </Box>
            </Flex>
            {isMiniCalendarOpen && (
              <MiniCalendar
                onDateChange={handleMiniCalendarDateChange}
                defaultDate={selectedDateType === 'start' ? startDate : endDate}
              />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCustomDateApplyClick}
          >
            Apply
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomDateModal;
