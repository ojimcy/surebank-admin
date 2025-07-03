import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Icon,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  GridItem,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory, Link } from 'react-router-dom';

import {
  FiRefreshCw,
  FiPackage,
  FiMoreVertical,
} from 'react-icons/fi';
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
import { useAppContext } from 'contexts/AppContext';
import RecentTransactions from 'components/transactions/RecentTransactions';
import AccountDetails from '../customers/components/AccountDetails';

const ViewCustomerSb = () => {
  const { id } = useParams();
  const history = useHistory();
  const { currentUser } = useAuth();
  const { customerData, setCustomerData } = useAppContext();
  const { reset } = useForm();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const [sbPackages, setSbPackages] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [createPackagesModal, setCreatePackagesModal] = useState(false);
  const [sbDepositModal, setSbDepositModal] = useState(false);
  const [sbTransferModal, setSbTransferModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [changeProductModal, setChangeProductModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const accountResponse = await axiosService.get(
        `/accounts/${id}?accountType=sb`
      );
      setCustomerData(accountResponse.data);
    } catch (error) {
      console.error(error);
      setCustomerData(null);
      toast({
        title: 'Error fetching user data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [id, setCustomerData, toast]);

  const fetchUserPackages = useCallback(async () => {
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
      toast({
        title: 'Error fetching packages',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [id, currentUser, toast]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUserData(), fetchUserPackages()]).finally(() => {
      setLoading(false);
    });
  }, [fetchUserData, fetchUserPackages]);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchUserData(), fetchUserPackages()]).finally(() => {
      setRefreshing(false);
    });
  };

  const handleMerge = async (fromPackage, toPackage) => {
    try {
      await axiosService.post('/daily-savings/sb/package/merge', {
        packageFromId: fromPackage,
        packageToId: toPackage,
      });
      toast({
        title: 'Merged Successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUserPackages();
    } catch (error) {
      console.error('Error merging packages:', error);
      toast({
        title:
          error.response?.data?.message ||
          'Failed to merge packages. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setShowMergeModal(false);
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

  const addToCart = async (packageData) => {
    try {
      const productCatalogueId = packageData.product.id;
      await axiosService.post('/cart', {
        productCatalogueId: productCatalogueId,
        quantity: 1,
        packageId: packageData._id,
      });

      toast({
        title: 'Item added to cart successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Failed to add item to cart. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddToCart = async (packageData) => {
    try {
      if (packageData) {
        setSelectedPackage(packageData);
        await addToCart(packageData);
      }
      history.push('/admin/orders/placeorder');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const PackageCard = ({ packageData }) => (
    <Box
      p={5}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <HStack>
          <Icon as={FiPackage} w={6} h={6} color="blue.500" />
          <Text fontWeight="bold" fontSize="lg">
            {packageData.product?.name}
          </Text>
        </HStack>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            size="sm"
            rightIcon={<FiMoreVertical />}
          />
          <MenuList>
            <MenuItem onClick={() => handleDepositModalOpen(packageData)}>
              Deposit
            </MenuItem>
            <MenuItem onClick={() => handleChangeProductModalOpen(packageData)}>
              Change Product
            </MenuItem>
            <MenuItem onClick={handleShowMergeModal}>Merge</MenuItem>
            {currentUser && currentUser.role === 'superAdmin' && (
              <MenuItem onClick={() => handleTransferModalOpen(packageData)}>
                Move to Central Account
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Price
          </Text>
          <Text fontWeight="bold">
            {formatNaira(packageData.product?.sellingPrice)}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Contribution
          </Text>
          <Text fontWeight="bold">
            {formatNaira(packageData.totalContribution || 0)}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Remaining
          </Text>
          <Text fontWeight="bold" color="red.500">
            {formatNaira(
              Math.max(
                packageData.product?.sellingPrice -
                packageData.totalContribution,
                0
              )
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Start Date
          </Text>
          <Text fontWeight="bold">{formatDate(packageData?.startDate)}</Text>
        </Box>
      </Grid>

      {packageData.totalContribution >= packageData.product?.sellingPrice && (
        <Badge colorScheme="green" w="full" py={2} textAlign="center" mb={4}>
          Payment Completed
        </Badge>
      )}

      <Button
        w="full"
        colorScheme="blue"
        onClick={() => handleAddToCart(packageData)}
        isDisabled={
          packageData.totalContribution < packageData.product?.sellingPrice
        }
      >
        Buy Now
      </Button>
    </Box>
  );

  return (
    <>
      <Box pt={{ base: '90px', md: '80px', xl: '80px' }} px="20px">
        <Box mb="20px">
          <Breadcrumb separator=">" mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/admin/daily-savings">
                Daily Savings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                {customerData?.user?.firstName || 'Customer'}'s SB Packages
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex justifyContent="space-between" alignItems="center">
            <HStack>
              <BackButton />
              <Heading size="lg" color={textColor}>
                Save to Buy (SB)
              </Heading>
              {customerData?.user && (
                <Badge
                  colorScheme="blue"
                  fontSize="0.8em"
                  py={1}
                  px={2}
                  borderRadius="md"
                >
                  {customerData.user.firstName} {customerData.user.lastName}
                </Badge>
              )}
            </HStack>
            <HStack>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size="sm"
                >
                  Manage Account
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/admin/account/assign-manager">
                    Assign Account Manager
                  </MenuItem>
                  <MenuItem
                    onClick={
                      !customerData
                        ? handleShowAccountModal
                        : showCreatePackagesModal
                    }
                  >
                    {!customerData ? 'Create Account' : 'Create Package'}
                  </MenuItem>
                  <MenuItem onClick={handleShowChargeModal}>
                    Record Charge
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                onClick={handleRefresh}
                size="sm"
                leftIcon={<Icon as={FiRefreshCw} />}
                isLoading={refreshing}
                loadingText="Refreshing"
                variant="outline"
              >
                Refresh
              </Button>
            </HStack>
          </Flex>
        </Box>

        {loading ? (
          <Grid
            templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
            gap={6}
            mt={6}
          >
            <GridItem>
              <Skeleton height="200px" borderRadius="lg" />
              <Skeleton height="300px" borderRadius="lg" mt={6} />
            </GridItem>
            <GridItem>
              <Skeleton height="300px" borderRadius="lg" />
            </GridItem>
          </Grid>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                xl: 'repeat(4, 1fr)',
              }}
              gap={6}
              mb={6}
            >
              {/* Summary Cards can be added here if data is available */}
            </Grid>

            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              <GridItem>
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                  overflow="hidden"
                  h="100%"
                >
                  <Box p={5} borderBottom="1px" borderColor={borderColor}>
                    <Heading size="md">Account Balance</Heading>
                  </Box>
                  <Box p={5}>
                    <PackageBalance customerData={customerData} />
                  </Box>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                  overflow="hidden"
                  h="100%"
                >
                  <Box p={5} borderBottom="1px" borderColor={borderColor}>
                    <Heading size="md">Customer Details</Heading>
                  </Box>
                  <Box p={5}>
                    <AccountDetails customerData={customerData} />
                  </Box>
                </Box>
              </GridItem>
            </Grid>

            <Grid templateColumns="1fr" mt={6}>
              <GridItem>
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                  overflow="hidden"
                >
                  <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                      <Tab>Packages ({sbPackages.length})</Tab>
                      <Tab>Transactions</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={4}>
                        {sbPackages.length > 0 ? (
                          <Grid
                            templateColumns={{
                              base: '1fr',
                              md: 'repeat(2, 1fr)',
                            }}
                            gap={6}
                          >
                            {sbPackages.map((pkg) => (
                              <PackageCard key={pkg._id} packageData={pkg} />
                            ))}
                          </Grid>
                        ) : (
                          <Flex
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            py={10}
                          >
                            <Icon as={FiPackage} boxSize={12} color="gray.400" />
                            <Text mt={4} fontSize="lg" fontWeight="semibold">
                              No Packages Found
                            </Text>
                            <Text mt={2} color="gray.500">
                              Create a new package to get started.
                            </Text>
                            <Button
                              mt={6}
                              colorScheme="blue"
                              onClick={
                                customerData
                                  ? showCreatePackagesModal
                                  : handleShowAccountModal
                              }
                            >
                              {customerData
                                ? 'Create New Package'
                                : 'Create Account'}
                            </Button>
                          </Flex>
                        )}
                      </TabPanel>
                      <TabPanel p={4}>
                        <RecentTransactions />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </GridItem>
            </Grid>
          </>
        )}
      </Box>

      {/* Modals */}
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
  );
};

export default ViewCustomerSb;
