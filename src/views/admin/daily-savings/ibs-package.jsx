import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Flex,
    Grid,
    Text,
    Button,
    useColorModeValue,
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
import { Link, useParams } from 'react-router-dom';
import { formatDate, formatNaira } from 'utils/helper';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import RecentTransactions from 'components/transactions/RecentTransactions';
import PackageBalance from 'components/others/PackageBalance';
import { FiRefreshCw, FiTrendingUp, FiMoreVertical } from 'react-icons/fi';
import AccountDetails from '../customers/components/AccountDetails';

const ViewCustomerIbs = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { customerData, setCustomerData } = useAppContext();
    const [ibsPackages, setIbsPackages] = useState([]);
    const toast = useToast();

    const cardBg = useColorModeValue('white', 'navy.700');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const fetchUserData = useCallback(async () => {
        try {
            const accountResponse = await axiosService.get(
                `/accounts/${id}?accountType=ibs`
            );
            const packagesResponse = await axiosService.get(
                `interest-savings/package?userId=${id}`
            );
            setCustomerData(accountResponse.data);
            setIbsPackages(packagesResponse.data);
        } catch (error) {
            console.error(error);
            setCustomerData(null);
            toast({
                title: 'Error fetching data',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [id, setCustomerData, toast]);

    useEffect(() => {
        setLoading(true);
        fetchUserData().finally(() => setLoading(false));
    }, [fetchUserData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUserData().finally(() => setRefreshing(false));
    };

    const handleWithdraw = async (packageId) => {
        // Implement withdraw logic
        toast({
            title: 'Withdrawal initiated',
            description: `Withdrawing from package: ${packageId}`,
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleEarlyWithdraw = async (packageId) => {
        // Implement early withdraw logic
        toast({
            title: 'Early withdrawal initiated',
            description: `Early withdrawal from package: ${packageId}`,
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
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
            <Flex justifyContent="space-between" alignItems="flex-start" mb={4}>
                <Box>
                    <HStack>
                        <Icon as={FiTrendingUp} w={6} h={6} color="green.500" />
                        <Text fontWeight="bold" fontSize="lg">
                            {packageData.name}
                        </Text>
                    </HStack>
                    <Badge
                        colorScheme={packageData.status === 'active' ? 'green' : 'red'}
                        mt={2}
                    >
                        {packageData.status?.toUpperCase()}
                    </Badge>
                </Box>
                {currentUser &&
                    (currentUser.role === 'admin' ||
                        currentUser.role === 'superAdmin') && (
                        <Menu>
                            <MenuButton
                                as={Button}
                                variant="ghost"
                                size="sm"
                                rightIcon={<FiMoreVertical />}
                            />
                            <MenuList>
                                <MenuItem
                                    onClick={() => handleWithdraw(packageData._id)}
                                    isDisabled={packageData.status !== 'matured'}
                                >
                                    Withdraw
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleEarlyWithdraw(packageData._id)}
                                    isDisabled={packageData.status !== 'active'}
                                >
                                    Withdraw Early
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
            </Flex>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Principal
                    </Text>
                    <Text fontWeight="bold">
                        {formatNaira(packageData.principalAmount)}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Current Balance
                    </Text>
                    <Text fontWeight="bold" color="green.500">
                        {formatNaira(packageData.currentBalance)}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Interest Rate
                    </Text>
                    <Text fontWeight="bold">{packageData.interestRate}%</Text>
                </Box>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Lock Period
                    </Text>
                    <Text fontWeight="bold">{packageData.lockPeriod} days</Text>
                </Box>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Start Date
                    </Text>
                    <Text fontWeight="bold">{formatDate(packageData?.startDate)}</Text>
                </Box>
                <Box>
                    <Text fontSize="sm" color="gray.500">
                        Maturity Date
                    </Text>
                    <Text fontWeight="bold">{formatDate(packageData?.maturityDate)}</Text>
                </Box>
            </Grid>
            {!currentUser ||
                (currentUser.role !== 'admin' &&
                    currentUser.role !== 'superAdmin' && (
                        <Flex mt="4" justifyContent="center" gap={4}>
                            <Button
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleWithdraw(packageData._id)}
                                isDisabled={packageData.status !== 'matured'}
                            >
                                Withdraw
                            </Button>
                            <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleEarlyWithdraw(packageData._id)}
                                isDisabled={packageData.status !== 'active'}
                            >
                                Withdraw Early
                            </Button>
                        </Flex>
                    ))}
        </Box>
    );

    return (
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }} px="20px">
            <Box mb="20px">
                <Breadcrumb separator=">" mb={4}>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/admin/interest-savings">
                            Interest Savings
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            {customerData?.user?.firstName || 'Customer'}'s IBS Packages
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                <Flex justifyContent="space-between" alignItems="center">
                    <HStack>
                        <BackButton />
                        <Heading size="lg" color={textColor}>
                            Interest Bearing (IBS)
                        </Heading>
                        {customerData?.user && (
                            <Badge
                                colorScheme="green"
                                fontSize="0.8em"
                                py={1}
                                px={2}
                                borderRadius="md"
                            >
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
                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mt={6}>
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
                        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                        gap={6}
                    >
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
                                <Tabs variant="enclosed" colorScheme="green">
                                    <TabList>
                                        <Tab>Packages ({ibsPackages.length})</Tab>
                                        <Tab>Transactions</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel p={4}>
                                            {ibsPackages.length > 0 ? (
                                                <Grid
                                                    templateColumns={{
                                                        base: '1fr',
                                                        md: 'repeat(2, 1fr)',
                                                    }}
                                                    gap={6}
                                                >
                                                    {ibsPackages.map((pkg) => (
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
                                                    <Icon
                                                        as={FiTrendingUp}
                                                        boxSize={12}
                                                        color="gray.400"
                                                    />
                                                    <Text mt={4} fontSize="lg" fontWeight="semibold">
                                                        No IBS Packages Found
                                                    </Text>
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
    );
};

export default ViewCustomerIbs; 