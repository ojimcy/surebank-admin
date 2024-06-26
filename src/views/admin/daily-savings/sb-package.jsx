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
  ButtonGroup,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams, NavLink, useHistory } from 'react-router-dom';

import { useAuth } from 'contexts/AuthContext';
import CreateAccountModal from 'components/modals/CreateAccountModal';
import CreatePackageModal from 'components/modals/CreatePackageModal';
import SbDepositModal from 'components/modals/SbDepositModal';
import ChargeModal from 'components/modals/SbChargeModal';
import ChangeProductModal from 'components/modals/ChangeProductModal';
import SbTransferModal from 'components/modals/SbTransferModal';
import PackageBalance from 'components/others/PackageBalance';

import axiosService from 'utils/axiosService';
import { formatDate, formatNaira } from 'utils/helper';

import MergePackageModal from 'components/modals/mergeModal';
import { ChevronDownIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { useAppContext } from 'contexts/AppContext';
import RecentTransactions from 'components/transactions/RecentTransactions';

const ViewCustomerSb = () => {
  const { id } = useParams();
  const history = useHistory();
  const { currentUser } = useAuth();
  const { customerData, setCustomerData } = useAppContext();
  const { reset } = useForm();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');

  const [sbPackages, setSbPackages] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [createPackagesModal, setCreatePackagesModal] = useState(false);
  const [sbDepositModal, setSbDepositModal] = useState(false);
  const [sbTransferModal, setSbTransferModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [changeProductModal, setChangeProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const accountResponse = await axiosService.get(
        `/accounts/${id}?accountType=sb`
      );
      setCustomerData(accountResponse.data);
    } catch (error) {
      console.error(error);
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPackages = async () => {
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
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser]);

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

      toast.error(
        error.response?.data?.message ||
          'Failed to merge packages. Please try again later.'
      );
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

  const showSbTransferModal = () => {
    setSbTransferModal(true);
    reset();
  };

  const closeSbTransferModal = () => {
    setSbTransferModal(false);
    reset();
  };

  const handleDepositModalOpen = (packageData) => {
    setSelectedPackage(packageData);
    showSbDepositModal();
  };

  const handleTransferModalOpen = (packageData) => {
    setSelectedPackage(packageData);
    showSbTransferModal();
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

  // Function to add the product to the cart
  const addToCart = async (packageData) => {
    try {
      const productCatalogueId = packageData.product.id;
      await axiosService.post('/cart', {
        productCatalogueId: productCatalogueId,
        quantity: 1,
        packageId: packageData._id,
      });

      toast.success('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again later.');
    }
  };

  const handleAddToCart = async (packageData) => {
    try {
      setLoading(true);
      if (packageData) {
        setSelectedPackage(packageData);
        await addToCart(packageData);
      }

      // Redirect to the cart page
      history.push('/admin/orders/placeorder');
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
        <BackButton />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {currentUser.role === 'superAdmin' && (
              <PackageBalance customerData={customerData} />
            )}
            <Flex alignItems="center">
              <Flex flexDirection="column">
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  mt="10px"
                  color={textColor}
                >
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
                          <Text
                            fontSize="sm"
                            color="green.500"
                            fontWeight="bold"
                          >
                            Payment Completed
                          </Text>
                        </Flex>
                      </Box>
                    )}

                    <Flex
                      mt="4"
                      direction="column"
                      align="center"
                      flexWrap={'wrap'}
                    >
                      {currentUser &&
                      (currentUser.role === 'admin' ||
                        currentUser.role === 'superAdmin') ? (
                        <Menu>
                          <MenuButton
                            as={Button}
                            colorScheme="red"
                            size="md"
                            width="100%"
                            padding="1.2rem 1rem"
                            mb={4}
                          >
                            Actions
                          </MenuButton>
                          <MenuList>
                            <MenuItem onClick={handleShowMergeModal}>
                              Merge
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleChangeProductModalOpen(packageData)
                              }
                            >
                              Change Product
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDepositModalOpen(packageData)
                              }
                            >
                              Deposit
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleAddToCart(packageData)}
                              isDisabled={
                                packageData.totalContribution <
                                packageData.product?.sellingPrice
                              }
                            >
                              Buy
                            </MenuItem>
                            {currentUser &&
                              currentUser.role === 'superAdmin' && (
                                <MenuItem
                                  onClick={() =>
                                    handleTransferModalOpen(packageData)
                                  }
                                >
                                  Move to Central Account
                                </MenuItem>
                              )}
                          </MenuList>
                        </Menu>
                      ) : (
                        <ButtonGroup spacing={4} mb={4}>
                          <Button
                            colorScheme="blue"
                            size="md"
                            padding="1.2rem 1rem"
                            onClick={() => handleAddToCart(packageData)}
                            isDisabled={
                              packageData.totalContribution <
                              packageData.product?.sellingPrice
                            }
                          >
                            Buy
                          </Button>

                          <Button
                            colorScheme="green"
                            size="sm"
                            padding="1.2rem 1rem"
                            onClick={() =>
                              handleChangeProductModalOpen(packageData)
                            }
                          >
                            Change Product
                          </Button>
                          <Button
                            colorScheme="green"
                            size="md"
                            padding="1.2rem 1rem"
                            onClick={() => handleDepositModalOpen(packageData)}
                          >
                            Deposit
                          </Button>
                        </ButtonGroup>
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

            <RecentTransactions />

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
            <SbTransferModal
              isOpen={sbTransferModal}
              onClose={closeSbTransferModal}
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
            <ChangeProductModal
              isOpen={changeProductModal}
              onClose={closeChangeProductModal}
              packageData={selectedPackage}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default ViewCustomerSb;
