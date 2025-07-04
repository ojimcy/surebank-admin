import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
  Badge,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';
import AccountDetails from '../customers/components/AccountDetails';
import PackageBalance from 'components/others/PackageBalance';

const ViewCustomerDs = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const accountResponse = await axiosService.get(
        `/accounts/${id}?accountType=ds`
      );
      const packagesResponse = await axiosService.get(
        `daily-savings/package?userId=${id}`
      );
      setCustomerData(accountResponse.data);
      setUserPackages(packagesResponse.data);
    } catch (error) {
      console.error(error);
      setCustomerData(null);
      toast({
        title: "Error fetching data",
        description: "Could not load customer information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, setCustomerData, setUserPackages, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleTransferSuccess = useCallback(() => {
    fetchUserData();
    toast({
      title: "Transfer Successful",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [fetchUserData, toast]);

  const handleDepositSuccess = useCallback(() => {
    fetchUserData();
    toast({
      title: "Deposit Successful",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [fetchUserData, toast]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }} px={{ base: '10px', md: '20px' }}>
      {/* Header Section with Breadcrumb */}
      <Box mb="20px">
        <Breadcrumb separator=">" mb={4}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/daily-savings">
              Daily Savings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              {customerData?.user?.firstName || 'Customer'}'s Package
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <BackButton />
            <Heading size="lg" color={textColor}>
              Daily Savings Package
            </Heading>
            {customerData?.user && (
              <Badge colorScheme="green" fontSize="0.8em" py={1} px={2} borderRadius="md">
                {customerData.user.firstName} {customerData.user.lastName}
              </Badge>
            )}
          </HStack>

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
        </Flex>
      </Box>

      {loading ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={6}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="200px" borderRadius="lg" />
          ))}
        </Grid>
      ) : (
        <>
          {/* Main Content */}
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 2fr" }}
            gap={6}
          >
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="lg"
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
                mb={6}
                overflow="hidden"
              >
                <Box p={5} borderBottom="1px" borderColor={borderColor}>
                  <Heading size="md">Balance Information</Heading>
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
                mb={6}
                borderColor={borderColor}
                overflow="hidden"
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

          <Grid templateColumns={{ base: "1fr" }} gap={6}>
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="lg"
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
                mb={6}
                overflow="hidden"
              >
                <Tabs variant="enclosed" colorScheme="blue">
                  <TabList p="10px 10px 0">
                    <Tab>Packages</Tab>
                    <Tab>Transactions</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <UsersPackages
                        userPackages={userPackages}
                        handleTransferSuccess={handleTransferSuccess}
                        handleDepositSuccess={handleDepositSuccess}
                        handleEditSuccess={handleDepositSuccess}
                      />
                    </TabPanel>
                    <TabPanel>
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
  );
};

export default ViewCustomerDs;
