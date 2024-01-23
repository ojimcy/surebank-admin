import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Spacer,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams, NavLink } from 'react-router-dom';

import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import CreateAccountModal from 'components/modals/CreateAccountModal';
import CreatePackageModal from 'components/modals/CreatePackageModal';
import SbDepositModal from 'components/modals/SbDepositModal';
import ChargeModal from 'components/modals/SbChargeModal';
import BuyModal from 'components/modals/BuyModal';
import ChangeProductModal from 'components/modals/ChangeProductModal';

import axiosService from 'utils/axiosService';
import { formatDate, formatNaira } from 'utils/helper';

import MergePackageModal from 'components/modals/mergeModal';
import { ChevronDownIcon } from '@chakra-ui/icons';

const SbPackage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { customerData, selectedPackage, setSelectedPackage } = useAppContext();
  const { reset } = useForm();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [sbPackages, setSbPackages] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [createPackagesModal, setCreatePackagesModal] = useState(false);
  const [sbDepositModal, setSbDepositModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [changeProductModal, setChangeProductModal] = useState(false);

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

  const showBuyModal = () => {
    setBuyModal(true);
    reset();
  };

  const closeBuyModal = () => {
    setBuyModal(false);
    reset();
  };

  const handleBuyModalOpen = (packageData) => {
    setSelectedPackage(packageData);
    showBuyModal();
  };

  const handleShowMergeModal = () => {
    setShowMergeModal(true);
    reset();
  };

  const handleCloseMergeModal = () => {
    setShowMergeModal(false);
    reset();
  };

  const handleShowChargeModal = () => {
    setShowChargeModal(true);
    reset();
  };

  const closeChargeModal = () => {
    setShowChargeModal(false);
    reset();
    fetchUserPackages();
  };

  const handleSuccess = () => {
    fetchUserPackages();
  };

  const showChangeProductModal = () => {
    setChangeProductModal(true);
    reset();
  };

  const closeChangeProductModal = () => {
    setChangeProductModal(false);
    reset();
  };

  const handleChangeProductModalOpen = (packageData) => {
    setSelectedPackage(packageData);
    showChangeProductModal();
  };

  console.log(selectedPackage);
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

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Manage Account
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NavLink to="/admin/account/assign-manager">
                Assign Account Manager
              </NavLink>
            </MenuItem>
            <MenuItem>
              {!customerData ? (
                <NavLink to="#" onClick={handleShowAccountModal}>
                  Create Account
                </NavLink>
              ) : (
                <NavLink to="#" onClick={showCreatePackagesModal}>
                  Create Package
                </NavLink>
              )}
            </MenuItem>
            <MenuItem>
              <NavLink to="#" onClick={handleShowChargeModal}>
                Record charge
              </NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
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
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">Name: </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {packageData.product?.name}
                  </Text>
                </Flex>
              </Box>
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">Price: </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {formatNaira(packageData.product?.sellingPrice)}
                  </Text>
                </Flex>
              </Box>
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">Total Contribution: </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {packageData.totalContribution &&
                      packageData.totalContribution.toFixed(2)}
                  </Text>
                </Flex>
              </Box>
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">Remaining Balance: </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {formatNaira(
                      Math.max(
                        packageData.product?.sellingPrice -
                          packageData.totalContribution,
                        0
                      )
                    )}
                  </Text>
                </Flex>
              </Box>
              <Box mt="4">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">Start Date: </Text>
                  <Text fontSize="sm">
                    {formatDate(packageData?.startDate)}
                  </Text>
                </Flex>
              </Box>
              {/* Show badge for completed payment */}
              {packageData.totalContribution >=
                packageData.product?.sellingPrice && (
                <Box mt="4">
                  <Flex justifyContent="center">
                    <Text fontSize="sm" color="green.500" fontWeight="bold">
                      Payment Completed
                    </Text>
                  </Flex>
                </Box>
              )}
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
                  size="md"
                  onClick={handleChangeProductModalOpen}
                >
                  Change Product
                </Button>

                {packageData.totalContribution >=
                packageData.product?.sellingPrice ? (
                  <>
                    {currentUser &&
                    (currentUser.role === 'admin' ||
                      currentUser.role === 'superAdmin') ? (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        as={NavLink}
                        to={`/admin/products/catalogue/${packageData._id}`}
                      >
                        Sell
                      </Button>
                    ) : (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleBuyModalOpen(packageData)}
                      >
                        Buy
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleDepositModalOpen(packageData)}
                  >
                    Deposit
                  </Button>
                )}
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
      <ChargeModal
        isOpen={showChargeModal}
        onClose={closeChargeModal}
        packages={sbPackages}
      />
      <BuyModal
        isOpen={buyModal}
        onClose={closeBuyModal}
        packageData={selectedPackage}
      />
      <ChangeProductModal
        isOpen={changeProductModal}
        onClose={closeChangeProductModal}
        packageData={selectedPackage}
      />
    </>
  );
};

export default SbPackage;
