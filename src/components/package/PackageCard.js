import React, { useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

import { formatDate, formatNaira } from 'utils/helper';
import TransferModal from 'components/modals/TransferModal';
import DepositModal from 'components/modals/DepositModal';
import EditPackageModal from 'components/modals/EditPackageModal';
import closed from 'assets/img/closed.png';
import { useAuth } from 'contexts/AuthContext';

const PackageCard = ({
  packageData,
  handleTransferSuccess,
  handleDepositSuccess,
  handleEditSuccess,
  onClick,
}) => {
  const { currentUser } = useAuth();

  const {
    target,
    amountPerDay,
    startDate,
    totalContribution,
    totalCount,
    status,
  } = packageData;

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleTransferClick = () => {
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const isPackageClosed = status === 'closed';

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p="6"
      boxShadow="md"
      position="relative"
      overflow="hidden"
      _before={
        isPackageClosed
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${closed})`,
              backgroundSize: 'cover',
              opacity: 0.08,
              zIndex: -1,
            }
          : {}
      }
    >
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          {target}
        </Text>
      </Flex>
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
          <Text fontSize="sm">Total Count: </Text>
          <Text fontSize="lg" fontWeight="bold">
            {totalCount}
          </Text>
        </Flex>
      </Box>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Target Amount: </Text>
          <Text fontSize="sm">{formatNaira(amountPerDay)}</Text>
        </Flex>
      </Box>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Start Date: </Text>
          <Text fontSize="sm">{formatDate(startDate)}</Text>
        </Flex>
      </Box>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Status: </Text>
          <Text fontSize="sm">{status}</Text>
        </Flex>
      </Box>
      <Flex mt="4" justify="space-between">
        <Button
          colorScheme="red"
          size="sm"
          onClick={handleTransferClick}
          disabled={isPackageClosed}
        >
          Move to central account
        </Button>
        {currentUser.role === 'superAdmin' ? (
          <Button colorScheme="green" size="sm" onClick={handleEditClick}>
            Edit
          </Button>
        ) : (
          ''
        )}
        <Button
          colorScheme="green"
          size="sm"
          onClick={handleDepositClick}
          disabled={isPackageClosed}
        >
          Deposit
        </Button>
      </Flex>

      {/* Modals */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={handleCloseTransferModal}
        packageData={packageData}
        onSuccess={handleTransferSuccess}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        packageData={packageData}
        onSuccess={handleDepositSuccess}
      />

      <EditPackageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        packageData={packageData}
        onSuccess={handleEditSuccess}

      />
    </Box>
  );
};

export default PackageCard;
