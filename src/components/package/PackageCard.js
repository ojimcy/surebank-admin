import React, { useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

import { formatDate, formatNaira } from 'utils/helper';
import TransferModal from 'components/modals/TransferModal';
import DepositModal from 'components/modals/DepositModal';

const PackageCard = ({
  packageData,
  handleTransferSuccess,
  handleDepositSuccess,
}) => {
  const { target, amountPerDay, startDate, totalContribution } =
    packageData;

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
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          {target}
        </Text>
      </Flex>
      <Flex justify="space-between" alignItems="center" m="2"></Flex>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Total Contribution: </Text>
          <Text fontSize="lg" fontWeight="bold">
            {formatNaira(totalContribution)}
          </Text>
        </Flex>
      </Box>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Target Amount: </Text>
          <Text fontSize="sm"> {formatNaira(amountPerDay)}</Text>
        </Flex>
      </Box>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Start Date: </Text>
          <Text fontSize="sm">{formatDate(startDate)}</Text>
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
        onSuccess={handleTransferSuccess}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        packageData={packageData}
        onSuccess={handleDepositSuccess}
      />
    </Box>
  );
};

export default PackageCard;
