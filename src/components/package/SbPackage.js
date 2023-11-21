import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Spacer,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Image,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import CreateAccountModal from 'components/modals/CreateAccountModal';
import CreatePackageModal from 'components/modals/CreatePackageModal';
import SbDepositModal from 'components/modals/SbDepositModal';

import axiosService from 'utils/axiosService';
import { formatDate, formatNaira } from 'utils/helper';

import testImg from 'assets/img/nfts/Nft2.png';
import MergePackageModal from 'components/modals/mergeModal';

const SbPackage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { customerData } = useAppContext();
  const { reset } = useForm();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [sbPackages, setSbPackages] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [createPackagesModal, setCreatePackagesModal] = useState(false);
  const [sbDepositModal, setSbDepositModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const fetchUserPackages = async () => {
    if (customerData) {
      try {
        let userIdToFetch = id;
        if (currentUser && currentUser.role === 'user') {
          userIdToFetch = currentUser.id;
        }

        const response = await axiosService.get(
          `daily-savings/sb/package?userId=${userIdToFetch}`
        );
        setSbPackages(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  useEffect(() => {
    fetchUserPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMerge = async (fromPackage, toPackage) => {
    try {
      await axiosService.post('/daily-savings/sb/package/merge', {
        packageFromId: fromPackage,
        packageToId: toPackage,
      });
      toast.success('Merged Successful!');
      fetchUserPackages();
    } catch (error) {
      // Handle errors if needed
      console.error('Error merging packages:', error);

      // Close the modal
      setShowMergeModal(false);

      // You may want to display an error message to the user
      toast.error('Failed to merge packages. Please try again later.');
    }
  };

  const handleShowAccountModal = () => {
    setShowAccountModal(true);
  };

  const closeAccountModal = () => {
    setShowAccountModal(false);
  };

  const showCreatePackagesModal = () => {
    setCreatePackagesModal(true);
  };

  const closeCreatePackagesModal = () => {
    setCreatePackagesModal(false);
    fetchUserPackages();
    reset();
  };

  const showSbDepositModal = () => {
    setSbDepositModal(true);
    reset();
  };

  const closeSbDepositModal = () => {
    setSbDepositModal(false);
    reset();
  };

  const handleDepositModalOpen = (packageData) => {
    setSelectedPackage(packageData);
    showSbDepositModal();
  };

  const handleShowMergeModal = () => {
    setShowMergeModal(true);
    reset();
  };

  const handleCloseMergeModal = () => {
    setShowMergeModal(false);
    reset();
  };

  const calculateProgressValue = (packageData) => {
    const totalDays = 31;
    const completedDays = packageData.totalCount;
    return ((completedDays / totalDays) * 100).toFixed(2);
  };

  const handleSuccess = () => {
    fetchUserPackages();
  };

  return (
    <>
      <Flex alignItems="center">
        <Flex flexDirection="column">
          <Text fontWeight="bold" fontSize="xl" mt="10px" color={textColor}>
            Packages
          </Text>
          <Text fontSize="sm" color={textColorSecondary} pb="20px">
            Lists of user's packages
          </Text>
        </Flex>

        <Spacer />
        {!customerData || Object.keys(customerData).length === 0 ? (
          <Button
            bgColor="blue.700"
            color="white"
            onClick={handleShowAccountModal}
          >
            Create Account
          </Button>
        ) : (
          <Button
            onClick={showCreatePackagesModal}
            bgColor="blue.700"
            color="white"
          >
            Create Package
          </Button>
        )}
      </Flex>
      <hr color={textColor} />

      {sbPackages.length !== 0 ? (
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          gap={2}
          mt="20px"
        >
          {sbPackages?.map((packageData) => (
            <Box
              borderWidth="1.5px"
              borderRadius="md"
              p="6"
              boxShadow="md"
              justifyContent="center"
              alignItems="cemter"
              key={packageData._id}
            >
              <Box display="flex" justifyContent="center">
                <Image
                  borderRadius="10px"
                  boxSize="150px"
                  src={testImg}
                  alt={packageData.product?.name}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text>{packageData.product?.name}</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {packageData?.totalContribution.toFixed(2)}
                </Text>
              </Box>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontSize={{ base: '14px', md: 'lg' }}>
                  Amount:{' '}
                  <Box fontWeight="bold" as="span">
                    {formatNaira(packageData?.amountPerDay)}
                  </Box>{' '}
                  / Day
                </Text>
                <Text fontSize={{ base: '14px', md: 'lg' }}>
                  Price:{' '}
                  <Box fontWeight="bold" as="span">
                    {formatNaira(packageData?.product.price)}
                  </Box>{' '}
                </Text>
              </Flex>
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">
                    Start Date: {formatDate(packageData?.startDate)}
                  </Text>
                  <CircularProgress
                    value={calculateProgressValue(packageData)}
                    size="50px"
                    thickness="6px"
                  >
                    <CircularProgressLabel>
                      {calculateProgressValue(packageData)}%{' '}
                    </CircularProgressLabel>
                  </CircularProgress>
                </Flex>
              </Box>
              <Flex mt="4" justify="space-between">
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={handleShowMergeModal}
                >
                  Merge
                </Button>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => handleDepositModalOpen(packageData)}
                >
                  Deposit
                </Button>
              </Flex>
            </Box>
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center" mt="4">
          {customerData ? (
            <Button color="green" onClick={showCreatePackagesModal}>
              No Package Found, Create a new package.
            </Button>
          ) : (
            <Button color="green" onClick={handleShowAccountModal}>
              No Account Found, Create an account and a new package.
            </Button>
          )}
        </Flex>
      )}

      <CreateAccountModal
        isOpen={showAccountModal}
        onClose={closeAccountModal}
      />

      <CreatePackageModal
        isOpen={createPackagesModal}
        onClose={closeCreatePackagesModal}
      />

      <SbDepositModal
        isOpen={sbDepositModal}
        onClose={closeSbDepositModal}
        packageData={selectedPackage}
        onSuccess={handleSuccess}
      />

      <MergePackageModal
        isOpen={showMergeModal}
        onClose={handleCloseMergeModal}
        packages={sbPackages}
        onMerge={handleMerge}
      />
    </>
  );
};

export default SbPackage;
