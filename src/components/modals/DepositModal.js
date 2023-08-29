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

const DepositModal = ({ isOpen, onClose, packageData }) => {
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = async () => {
    const depositData = {
      target: packageData.target,
      accountNumber: packageData.accountNumber,
      amount: parseFloat(depositAmount),
    };

    try {
      await axiosService.post(
        `/daily-savings/make-contribution/?packageId=${packageData.id}`,
        depositData
      );

      toast.success('Deposit successful');
      onClose();

      // Reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while making contribution.'
        );
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
              Amount per day: {formatNaira(packageData.amountPerDay)}
            </Text>
            <Text>Account Number: {packageData.accountNumber}</Text>
            <InputGroup>
              <Input
                type="number"
                placeholder="Enter transfer amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={<MdEdit />}
                  onClick={() =>
                    setDepositAmount(packageData.amountPerDay)
                  }
                />
              </InputRightElement>
            </InputGroup>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={handleDeposit}>
            Deposit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DepositModal;
