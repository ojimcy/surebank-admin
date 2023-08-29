import React, { useState } from 'react';
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  Button,
} from '@chakra-ui/react';

import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';

import { formatNaira } from 'utils/helper';

import axiosService from 'utils/axiosService';

const TransferModal = ({ isOpen, onClose, packageData }) => {
  const [transferAmount, setTransferAmount] = useState('');

  const handleTransferConfirm = async () => {
    const transferAmountValue = parseFloat(transferAmount);

    if (transferAmountValue > packageData.totalContribution) {
      toast.error('Transfer amount cannot exceed total contribution.');
      return;
    }

    const transferData = {
      target: packageData.target,
      accountNumber: packageData.accountNumber,
      amount: parseFloat(transferAmount),
    };

    try {
      await axiosService.post(`/daily-savings/withdraw`, transferData);

      toast.success('Transfer successful');
      onClose();

      // Reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Transfer failed. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>Target: {packageData.target}</Text>
            <Text>
              Total Contributions: {formatNaira(packageData.totalContribution)}
            </Text>
            <Text>Account Number: {packageData.accountNumber}</Text>
            <InputGroup>
              <Input
                type="number"
                placeholder="Enter transfer amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={<MdEdit />}
                  onClick={() =>
                    setTransferAmount(packageData.totalContribution)
                  }
                />
              </InputRightElement>
            </InputGroup>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={handleTransferConfirm}>
            Confirm Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal;
