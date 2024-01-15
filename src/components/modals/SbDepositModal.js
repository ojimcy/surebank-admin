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
  VStack,
  Button,
} from '@chakra-ui/react';

import { toast } from 'react-toastify';

import { formatNaira } from 'utils/helper';

import axiosService from 'utils/axiosService';

const SbDepositModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const depositData = {
      product: packageData.product.id,
      accountNumber: packageData.accountNumber,
      amount: parseFloat(depositAmount),
    };

    try {
      setLoading(true);
      await axiosService.post(
        `/daily-savings/sb/make-contribution/?packageId=${packageData._id}`,
        depositData
      );

      toast.success('Deposit successful');
      setLoading(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while making contribution.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {packageData && (
            <VStack spacing={4}>
              <Text>Product: {packageData.product.name}</Text>
              <Text>Price: {formatNaira(packageData.product.sellingPrice)}</Text>
              <Text>Account Number: {packageData.accountNumber}</Text>
              <InputGroup>
                <Input
                  type="number"
                  placeholder="Enter deposit amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </InputGroup>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleDeposit}
            isLoading={loading}
            loadingText="Depositting"
          >
            Deposit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SbDepositModal;
