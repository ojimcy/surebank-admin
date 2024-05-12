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

const SbTransferModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdrawal = async () => {
    const depositData = {
      product: packageData.product.id,
      accountNumber: packageData.accountNumber,
      amount: parseFloat(withdrawalAmount),
    };
    try {
      setLoading(true);
      await axiosService.post(
        `/daily-savings/sb/withdraw/?packageId=${packageData._id}`,
        depositData
      );

      toast.success('Withdrawal successful');
      setLoading(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while making withdrawal.'
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
              <Text>
                Total Contribution: {formatNaira(packageData.totalContribution)}
              </Text>
              <Text>Account Number: {packageData.accountNumber}</Text>{' '}
              <InputGroup>
                <Input
                  type="number"
                  bg="transparent"
                  color="secondaryGray.600"
                  placeholder="Enter Withdrawal amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </InputGroup>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleWithdrawal}
            isLoading={loading}
            loadingText="Withdrawing"
          >
            Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SbTransferModal;
