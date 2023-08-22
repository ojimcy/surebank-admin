/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Progress,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// import { CustomButton } from 'components/Button/CustomButton';
import { formatDate } from 'utils/helper';
import { toast } from 'react-toastify';
// Assets

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import Card from 'components/card/Card';

export default function UserDashboard() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const { currentUser } = useAuth();
  const [showTransactions, setShowTransactions] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(10);
  const [loading, setLoading] = useState(false);
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
        `daily-savings/package?userId=${currentUser.id}&accountNumber=${customerData.accountNumber}`
      );
      setUserPackage(response.data);
      setLoading(false);
      setPackageFound(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user package.'
      );
      setLoading(false);
    }
  };

  // Function to fetch user activities data
  const fetchUserActivities = async () => {
    try {
      const response = await axiosService.get(
        `daily-savings/activities?userId=${currentUser.id}&accountNumber=${customerData.accountNumber}`
      );
      setUserActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch account data
  const fetchAccount = async () => {
    try {
      const response = await axiosService.get(`/accounts/${currentUser.id}`);
      setCustomerData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Reload data when customerData changes
  useEffect(() => {
    fetchUserActivities();
  }, [customerData, currentUser.id]);

  // Reload data when id changes
  useEffect(() => {
    fetchUserPackage();
  }, [currentUser.id, customerData, setUserPackage]);

  // Load account data when component mounts
  useEffect(() => {
    fetchAccount();
  }, [currentUser.Buttonid]);

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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex justifyContent='space-between'>
            <Box>
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
            </Box>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: '4', md: '0' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
            >
              <Flex>
                {/* Savings Progress Section */}
                <Stat p="4" borderRadius="lg" boxShadow="sm">
                  {packageFound ? (
                    <>
                      <StatLabel fontSize={{ base: 'lg', md: 'xl' }}>
                        Savings Progress
                      </StatLabel>
                      <StatNumber fontWeight="bold">
                        {savingsProgress}%
                      </StatNumber>
                      <Progress
                        value={
                          savingsProgress ? parseFloat(savingsProgress) : 0
                        }
                        size="sm"
                        mt="2"
                        colorScheme="blue"
                      />
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
          </Flex>

          {/* Savings Summary Section */}

          <Flex direction={{ base: 'column', md: 'row' }} mb="20px" mt="40px">
            <Card>
              <Text fontWeight="bold" fontSize="xl" mt="10px" color={textColor}>
                Overview
              </Text>
              <Text fontSize="sm" color={textColorSecondary} pb="20px">
                Overview of your activities
              </Text>
              <hr color={textColor} />
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
                mt="20px"
              >
                <Stat
                  p="4"
                  m="6px"
                  borderRadius="lg"
                  bg="green.100"
                  minHeight="150px"
                  alignItems="center"
                  display="flex"
                >
                  <StatLabel>Total contribution</StatLabel>
                  <StatNumber fontWeight="bold">
                    {packageFound
                      ? formatNaira(userPackage.totalContribution)
                      : 0}
                  </StatNumber>
                </Stat>
                <Stat
                  p="4"
                  m="6px"
                  borderRadius="lg"
                  bg="orange.100"
                  minHeight="150px"
                  alignItems="center"
                  display="flex"
                >
                  <StatLabel>Amount per Day</StatLabel>
                  <StatNumber fontWeight="bold">
                    {packageFound ? formatNaira(userPackage.amountPerDay) : 0}
                  </StatNumber>
                </Stat>

                <Stat
                  p="4"
                  m="6px"
                  borderRadius="lg"
                  bg="gray.100"
                  minHeight="150px"
                  alignItems="center"
                  display="flex"
                >
                  <StatLabel>Days Left</StatLabel>
                  <StatNumber fontWeight="bold">{daysLeft}</StatNumber>
                </Stat>
              </Flex>
            </Card>
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
