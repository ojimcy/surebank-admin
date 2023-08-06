import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
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
import { useAuth } from 'contexts/AuthContext';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
// import { CustomButton } from 'components/Button/CustomButton';
import { AiOutlineBank } from 'react-icons/ai';
import { FaBox, FaDollarSign } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { formatDate } from 'utils/helper';
// Assets

// Custom components

export default function DailySavingsDashboard() {
  const { currentUser } = useAuth();
  const [userPackage, setUserPackage] = useState({});
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

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
          `daily-savings/package?userId=${currentUser.id}`
        );
        setUserPackage(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserPackage();
  }, [currentUser.id]);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setLoading(true);
        const response = await axiosService.get(
          `daily-savings/activities?userId=${currentUser.id}`
        );
        setUserActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserActivities();
  }, [currentUser.id]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          {/* User Profile Section */}
          <Flex align="center" justify="space-between" mb="4">
            <Heading size="lg">Welcome, {currentUser.firstName}</Heading>
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
                  <Icon as={AiOutlineBank} w={4} h={3} color="white" />
                </Box>
                Make Withdrwal
              </Button>
            </NavLink>
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
                      <Text>{formatNaira(activity.amount)}</Text>
                    </Flex>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
