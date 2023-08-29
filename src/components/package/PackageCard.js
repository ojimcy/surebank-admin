import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

import { formatDate, formatNaira } from 'utils/helper';
import TransferModal from 'components/modals/TransferModal';
import DepositModal from 'components/modals/DepositModal';

const PackageCard = ({ packageData }) => {
  const { target, amountPerDay, startDate, totalContribution, totalCount } =
    packageData;

  const progressValue = ((totalCount / 31) * 100).toFixed(2);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const handleTransferClick = () => {
    setIsTransferModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTransferModalOpen(false);
  };

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p="6" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        {target}
      </Text>
      <Flex justify="space-between" alignItems="center" m="2">
        <Text fontSize="lg" fontWeight="bold">
          {formatNaira(totalContribution)}
        </Text>
      </Flex>
      <Text fontSize="md">Target Amount: {formatNaira(amountPerDay)}</Text>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Start Date: {formatDate(startDate)}</Text>
          <CircularProgress value={progressValue} size="50px" thickness="6px">
            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
          </CircularProgress>
        </Flex>
      </Box>
      <Flex mt="4" justify="space-between">
        <Button colorScheme="red" size="sm" onClick={handleTransferClick}>
          Transfer
        </Button>
        <Button colorScheme="green" size="sm" onClick={handleDepositClick}>
          Deposit
        </Button>
      </Flex>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={handleCloseModal}
        packageData={packageData}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        packageData={packageData}
      />
    </Box>
  );
};

export default PackageCard;
