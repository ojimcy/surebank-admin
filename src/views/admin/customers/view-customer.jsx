/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
// import { CustomButton } from 'components/Button/CustomButton';
import { AiOutlineBank } from 'react-icons/ai';
import { FaBox, FaCopy, FaDollarSign } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import { formatDate } from 'utils/helper';
// Assets

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

export default function ViewCustomer() {
  const { id } = useParams();
  const [showTransactions, setShowTransactions] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [packageFound, setPackageFound] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [userActivities, setUserActivities] = useState([]);

  const { customerData, setCustomerData, userPackage, setUserPackage } =
    useAppContext();

  // Conditionally calculate savings progress and days left
  let savingsProgress = 0;
  let daysLeft = 31;
  if (userPackage && userPackage.totalCount) {
    savingsProgress = ((userPackage.totalCount / 31) * 100).toFixed(2);
    daysLeft = 31 - userPackage.totalCount;
  }

  // Function to fetch user package data
  const fetchUserPackage = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(
        `daily-savings/package?userId=${id}&accountNumber=${customerData.accountNumber}`
      );
      setUserPackage(response.data);
      setLoading(false);
      setPackageFound(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Function to fetch user activities data
  const fetchUserActivities = async () => {
    try {
      const response = await axiosService.get(
        `daily-savings/activities?userId=${id}&accountNumber=${customerData.accountNumber}`
      );
      setUserActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch account data
  const fetchAccount = async () => {
    try {
      const response = await axiosService.get(`/accounts/${id}`);
      setCustomerData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Reload data when customerData changes
  useEffect(() => {
    fetchUserActivities();
  }, [customerData, id]);

  // Reload data when id changes
  useEffect(() => {
    fetchUserPackage();
  }, [id, customerData, setUserPackage]);

  // Load account data when component mounts
  useEffect(() => {
    fetchAccount();
  }, [id]);

  // Reload transactions when visibleTransactions changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransactions(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [visibleTransactions]);

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setVisibleTransactions((prevVisible) => prevVisible + 10);
  };

  // Function to handle copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    const textField = document.createElement('textarea');
    textField.innerText = customerData.accountNumber;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  });

  console.log(customerData);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="space-between" mb="20px">
        <BackButton />
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Manage Account
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NavLink to="/admin/account/assign-manager">
                Assign Manager
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/transaction/deposit">Deposit</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/transaction/withdraw">Withdraw</NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                Available Balance:
                <Icon
                  ml="2"
                  fontSize="lg"
                  _hover={{ cursor: 'pointer', color: 'blue.500' }}
                  as={showBalance ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={() =>
                    setShowBalance((prevShowBalance) => !prevShowBalance)
                  }
                />
              </Text>
            </Flex>
            <Text
              ml="2"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              color={showBalance ? 'gray.800' : 'gray.400'}
            >
              {customerData &&
              customerData.availableBalance !== undefined &&
              showBalance
                ? formatNaira(customerData.availableBalance)
                : '****'}
            </Text>
          </Flex>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '4', md: '0' }}
            justifyContent={{ base: 'center', md: 'space-between' }}
          >
            <Flex alignItems="center" mt="4">
              <Avatar
                size="xl"
                name={customerData.firstName || ''}
                src={customerData.avatarUrl || ''}
                m={4}
              />
              <Box px={6} py={4}>
                <Grid templateColumns="repeat(1fr)" gap={1}>
                  <Text fontSize={{ base: 'md', md: 'lg' }}>
                    Account Number: {customerData.accountNumber}
                    <Button size="sm" onClick={handleCopyToClipboard}>
                      {isCopied ? 'Copied!' : <FaCopy />}
                    </Button>
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'lg' }}>
                    Account Status: {customerData.status}
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'lg' }}>
                    Account Manager: {customerData.accountManagerId?.firstName}{' '}
                    {customerData.accountManagerId?.lastName}
                  </Text>
                </Grid>
              </Box>
            </Flex>
            <Flex>
              {/* Savings Progress Section */}
              <Stat p="4" borderRadius="lg" bg="gray.50" boxShadow="sm">
                {packageFound ? (
                  <>
                    <StatLabel fontSize={{ base: 'lg', md: 'xl' }}>
                      Savings Progress
                    </StatLabel>
                    <StatNumber fontWeight="bold">
                      {savingsProgress}%
                    </StatNumber>
                    <Progress
                      value={savingsProgress ? parseFloat(savingsProgress) : 0}
                      size="sm"
                      mt="2"
                      colorScheme="blue"
                    />
                    <StatHelpText fontSize={{ base: 'sm', md: 'md' }}>
                      You are {daysLeft} days away from reaching your goal!
                    </StatHelpText>
                  </>
                ) : (
                  <Text
                    mt="4"
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="red.500"
                  >
                    No active package found for this customer.
                  </Text>
                )}
              </Stat>
            </Flex>
          </Flex>

          {/* Savings Summary Section */}
          <SimpleGrid
            columns={{ base: 1, md: 3, lg: 3, '2xl': 3 }}
            gap="20px"
            mb="20px"
            mt="40px"
          >
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="green.100">
                <StatLabel>Total contribution</StatLabel>
                <StatNumber fontWeight="bold">
                  {packageFound
                    ? formatNaira(userPackage.totalContribution)
                    : 0}
                </StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="orange.100">
                <StatLabel>Amount per Day</StatLabel>
                <StatNumber fontWeight="bold">
                  {packageFound ? formatNaira(userPackage.amountPerDay) : 0}
                </StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="gray.100">
                <StatLabel>Days Left</StatLabel>
                <StatNumber fontWeight="bold">{daysLeft}</StatNumber>
              </Stat>
            </GridItem>
          </SimpleGrid>

          {/* action buttons  */}
          <Flex
            mt="20px"
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            gap={{ base: '2', md: '0' }}
          >
            <NavLink to="/admin/daily-savings/deposit">
              <Button
                borderRadius="none"
                size="md"
                boxShadow="md"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
                m="10px"
              >
                <Box
                  display="inline-block"
                  bg="rgb(64, 25, 109)"
                  borderRadius="full"
                  mr={2}
                  w="20px"
                  h="20px"
                >
                  <Icon as={FaDollarSign} w={4} h={3} color="white" />
                </Box>
                Make Contribution
              </Button>
            </NavLink>
            <NavLink to="/admin/daily-savings/withdraw">
              <Button
                borderRadius="none"
                size="md"
                boxShadow="md"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
                m="10px"
              >
                <Box
                  display="inline-block"
                  bg="rgb(64, 25, 109)"
                  borderRadius="full"
                  mr={2}
                  w="20px"
                  h="20px"
                >
                  <Icon as={AiOutlineBank} w={4} h={3} color="white" />
                </Box>
                Make Withdrwal
              </Button>
            </NavLink>
            <NavLink to="/admin/daily-saving/package">
              <Button
                borderRadius="none"
                size="md"
                boxShadow="md"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
                m="10px"
              >
                <Box
                  display="inline-block"
                  bg="rgb(64, 25, 109)"
                  borderRadius="full"
                  mr={2}
                  w="20px"
                  h="20px"
                >
                  <Icon as={FaBox} w={4} h={3} color="white" />
                </Box>
                Create Package
              </Button>
            </NavLink>
          </Flex>

          {/* Recent Transactions Section */}
          <Box mt="8">
            <Heading size="lg" mb="4">
              Recent Transactions
            </Heading>
            {userActivities && userActivities.length > 0 ? (
              <Stack spacing="4">
                {showTransactions &&
                  userActivities
                    .slice(0, visibleTransactions)
                    .map((activity, index) => (
                      <Box
                        key={index}
                        p="4"
                        bg="gray.100"
                        borderRadius="md"
                        opacity={showTransactions ? 1 : 0}
                        transform={`translateY(${showTransactions ? 0 : 10}px)`}
                        transition="opacity 0.3s, transform 0.3s"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Text fontWeight="bold">
                              {activity.narration === 'Daily contribution'
                                ? 'Deposit'
                                : 'Withdrawal'}
                            </Text>
                            <Text>{formatDate(activity.date)}</Text>
                          </Box>
                          <Text>{activity.narration}</Text>
                          <Text>{`${activity.userReps?.firstName} ${activity.userReps?.lastName}`}</Text>
                          <Text
                            color={
                              activity.narration === 'Daily contribution'
                                ? 'green.500'
                                : 'gray.800'
                            }
                          >
                            {formatNaira(activity.amount)}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
              </Stack>
            ) : (
              <Text>Transaction not found</Text>
            )}

            {/* Show More button */}
            {visibleTransactions < userActivities.length && (
              <Button
                mt="4"
                onClick={handleShowMore}
                colorScheme="blue"
                variant="outline"
                size="sm"
              >
                Show More
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
