import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';

const ConfirmDepositModal = ({ isOpen, onClose, onConfirm, user }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deposit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            You are about to make a deposit for{' '}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            .
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={onConfirm}>
            Confirm Deposit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDepositModal;
