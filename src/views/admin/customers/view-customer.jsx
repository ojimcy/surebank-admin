/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
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
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
// import { CustomButton } from 'components/Button/CustomButton';
import { AiOutlineBank } from 'react-icons/ai';
import { FaBox, FaDollarSign } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import { formatDate } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
// Assets

// Custom components

export default function ViewCustomer() {
  const { id } = useParams();
  const [showTransactions, setShowTransactions] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState(10);

  const {
    customerData,
    setCustomerData,
    userPackage,
    setUserPackage,
    userActivities,
    setUserActivities,
    loading,
    setLoading,
  } = useAppContext();

  const savingsProgress = 60;
  const daysLeft = 20;

  useEffect(() => {
    // Set showTransactions to true after a small delay to trigger the fade-in effect
    const timer = setTimeout(() => {
      setShowTransactions(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        setLoading(true);
        const response = await axiosService.get(
          `daily-savings/package?userId=${id}`
        );
        setUserPackage(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserPackage();
  }, [id]);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setLoading(true);
        const response = await axiosService.get(
          `daily-savings/activities?userId=${id}`
        );
        setUserActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserActivities();
  }, [id]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axiosService.get(`/accounts/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setVisibleEntries(userActivities.length);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex alignItems="center">
            <Avatar
              size="xl"
              name={customerData.firstName || ''}
              src={customerData.avatarUrl || ''}
              m={4}
            />
            <Box px={6} py={4}>
              <Grid templateColumns="repeat( 1fr)" gap={1}>
                <Text>
                  Name: {customerData.firstName} {customerData.lastName}
                </Text>
                <Text>Account Number: {customerData.accountNumber}</Text>
              </Grid>
            </Box>
          </Flex>

          {/* Savings Progress Section */}
          <Stat p="4" borderRadius="lg" bg="blue.500" color="white">
            <StatLabel fontSize="xl">Savings Progress</StatLabel>
            <StatNumber fontSize="4xl">{savingsProgress}%</StatNumber>
            <Progress
              value={savingsProgress}
              size="sm"
              mt="2"
              colorScheme="blue"
            />
            <StatHelpText>
              You are {daysLeft} days away from reaching your goal!
            </StatHelpText>
          </Stat>

          {/* Savings Summary Section */}
          <SimpleGrid
            columns={{ base: 1, md: 3, lg: 3, '2xl': 3 }}
            gap="20px"
            mb="20px"
            mt="40px"
          >
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="green.500" color="white">
                <StatLabel fontSize="lg">Total contribution</StatLabel>
                <StatNumber fontSize="3xl">
                  {userPackage.totalContribution &&
                    formatNaira(userPackage.totalContribution)}
                </StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="orange.500" color="white">
                <StatLabel fontSize="lg">Amount per Day</StatLabel>
                <StatNumber fontSize="3xl">
                  {userPackage.amountPerDay &&
                    formatNaira(userPackage.amountPerDay)}
                </StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat p="4" borderRadius="lg" bg="gray.500" color="white">
                <StatLabel fontSize="lg">Days Left</StatLabel>
                <StatNumber fontSize="3xl">{daysLeft}</StatNumber>
              </Stat>
            </GridItem>
          </SimpleGrid>

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
            <Stack spacing="4">
              {/* Add fade-in animation to the transaction items */}
              {showTransactions &&
                userActivities.map((activity, index) => (
                  <Box
                    key={index}
                    p="4"
                    bg="gray.100"
                    borderRadius="md"
                    opacity={showTransactions ? 1 : 0}
                    transform={`translateY(${showTransactions ? 0 : 10}px)`}
                    transition="opacity 0.3s, transform 0.3s"
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>
                        <Text fontWeight="bold">
                          {activity.narration === 'Daily contribution'
                            ? 'Deposit'
                            : 'Withdrawal'}
                        </Text>
                        <Text>{formatDate(activity.date)}</Text>
                      </Box>
                      {/* Conditionally set the color to green for deposits */}
                      <Text
                        color={
                          activity.narration === 'Daily contribution'
                            ? 'green'
                            : 'inherit'
                        }
                      >
                        {formatNaira(activity.amount)}
                      </Text>
                    </Flex>
                  </Box>
                ))}
            </Stack>
            {/* Show More button */}
            {visibleEntries < userActivities.length && (
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
