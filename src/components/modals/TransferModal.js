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
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';

import { formatNaira } from 'utils/helper';

import axiosService from 'utils/axiosService';

const TransferModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [transferAmount, setTransferAmount] = useState('');
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const cancelRef = React.useRef();

  const handleTransferConfirm = async () => {
    const transferAmountValue = parseFloat(transferAmount);

    if (transferAmountValue > packageData.totalContribution) {
      toast.error('Transfer amount cannot exceed total contribution.');
      return;
    }

    if (transferAmountValue === packageData.totalContribution) {
      // Show confirm close modal
      setShowConfirmCloseModal(true);
    } else {
      performTransfer(transferAmountValue);
    }
  };

  const performTransfer = async (amount) => {
    const transferData = {
      target: packageData.target,
      accountNumber: packageData.accountNumber,
      amount: parseFloat(amount),
    };

    try {
      await axiosService.post(
        `/daily-savings/withdraw/?packageId=${packageData.id}`,
        transferData
      );

      toast.success('Transfer successful');
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Transfer failed. Please try again.');
    }
  };
  console.log(packageData);
  const handleCloseConfirmModal = () => {
    setShowConfirmCloseModal(false);
  };

  const handleConfirmClose = async () => {
    setIsConfirming(true);
    await performTransfer(packageData.totalContribution);
    setIsConfirming(false);
  };

  if (!packageData) {
    return <Spinner />;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer Funds</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Target: {packageData.target}</Text>
              <Text>
                Total Contributions:{' '}
                {formatNaira(packageData.totalContribution)}
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
      {/* Confirm Close Modal */}
      <AlertDialog
        isOpen={showConfirmCloseModal}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseConfirmModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Package Closure
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to close this package? This action is
              irreversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseConfirmModal}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={isConfirming}
                onClick={handleConfirmClose}
              >
                Confirm Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default TransferModal;
