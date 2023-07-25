import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

// Chakra imports
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components
import axiosService from 'utils/axiosService';

// Assets
import { AddIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import Card from 'components/card/Card';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney, MdBarChart } from 'react-icons/md';
import { formatNaira, formatDate } from 'utils/helper';

export default function ViewCustomer() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userPackage, setUserPackage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const userResponse = await axiosService.get(`users/${id}`);
        setUser(userResponse.data);
        const accountResponse = await axiosService.get(`accounts/${id}`);
        setUserAccount(accountResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };
    fetchCustomerDetails();
  }, [id]);

  useEffect(() => {
    if (!userAccount) {
      setTransactions([]);
      setTransactionsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      if (!userAccount) {
        setTransactions([]);
        setTransactionsLoading(false);
        return;
      }

      const accountNumber = userAccount.accountNumber;
      setTransactionsLoading(true);
      try {
        const response = await axiosService.get(
          `transactions/?accountNumber=${accountNumber}`
        );

        // Fetch user information for each transaction's operator
        const transactionsWithOperator = await Promise.all(
          response.data.map(async (transaction) => {
            const operatorResponse = await axiosService.get(
              `/users/${transaction.operatorId}`
            );
            const operator = operatorResponse.data;
            return {
              ...transaction,
              operatorName: `${operator.firstName} ${operator.lastName}`,
            };
          })
        );

        setTransactions(transactionsWithOperator);
        setTransactionsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'An error occurred');
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, [userAccount]);

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
        toast.error(error.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };
    fetchUserPackage();
  }, [id]);

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  return (
    <Box>
      {loading ? (
        <Box
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
          <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="20px"
              mb="20px"
              mt="30px"
            >
              <Flex
                h="100%"
                align={{ base: 'center', xl: 'start' }}
                justify={{ base: 'center', xl: 'center' }}
              >
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                  mb="30px"
                  p="20px"
                >
                  {user && userAccount && (
                    <Flex alignItems="center">
                      <IconBox
                        w="56px"
                        h="56px"
                        bg={boxBg}
                        icon={
                          <Icon
                            w="32px"
                            h="32px"
                            as={MdAttachMoney}
                            color={brandColor}
                          />
                        }
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(1fr)" gap={1}>
                          <Text fontWeight="bold" fontSize="1xl">
                            Total: {formatNaira(userPackage?.totalContribution)}
                          </Text>
                          <Text fontWeight="bold">
                            Daily: {formatNaira(userPackage?.amountPerDay)}
                          </Text>
                          <Text>
                            Start date: {formatDate(userPackage?.startDate)}
                          </Text>
                        </Grid>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Flex>

              <Flex
                my="auto"
                h="100%"
                align={{ base: 'center', xl: 'start' }}
                justify={{ base: 'center', xl: 'center' }}
              >
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                  mb="30px"
                  p="20px"
                >
                  {user && userAccount && (
                    <Flex alignItems="center">
                      <IconBox
                        w="56px"
                        h="56px"
                        bg={boxBg}
                        icon={
                          <Icon
                            w="32px"
                            h="32px"
                            as={MdBarChart}
                            color={brandColor}
                          />
                        }
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(1fr)" gap={1}>
                          <Text>Account Type: {userAccount.accountType}</Text>
                          <Text fontWeight="bold">
                            Account Number: {userAccount.accountNumber}
                          </Text>
                          <Text fontWeight="bold" fontSize="1xl">
                            Balance {formatNaira(userAccount.availableBalance)}
                          </Text>
                        </Grid>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Flex>
              <Flex
                gap="20px"
                marginBottom="20px"
                flexDirection={{ base: 'row' }}
                alignItems="center"
                justifyContent="center"
              >
                <Button as={NavLink} to={`/deposit/${id}`} colorScheme="green">
                  <AddIcon /> Deposit
                </Button>
                <Button as={NavLink} to={`/withdraw/${id}`} colorScheme="red">
                  Withdraw
                </Button>
              </Flex>
            </SimpleGrid>

            {transactionsLoading ? (
              <Center>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : (
              <Box mt="30px">
                <Text fontSize="xl" fontWeight="bold" mb="20px">
                  Customer Transactions:
                </Text>
                {transactions.length === 0 ? (
                  <Text>No transactions found.</Text>
                ) : (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Time</Th>
                          <Th>Direction </Th>
                          <Th>Amount</Th>
                          <Th>Operator</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {transactions.map((transaction) => (
                          <Tr key={transaction.id}>
                            <Td>{formatDate(transaction.date)}</Td>
                            <Td>{transaction.direction}</Td>
                            <Td>{transaction.amount}</Td>
                            <Td>{transaction.operatorName}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}

                <HStack mt="4" justify="space-between" align="center">
                  {transactions && (
                    <Box>
                      Showing {(currentPage - 1) * 10 + 1} to{' '}
                      {Math.min(currentPage * 10, transactions.length)} of{' '}
                      {transactions.length} entries
                    </Box>
                  )}
                  <HStack>
                    <Button
                      disabled={currentPage === 1}
                      onClick={handlePreviousPageClick}
                    >
                      Previous Page
                    </Button>
                    <Button
                      disabled={currentPage === totalPages}
                      onClick={handleNextPageClick}
                    >
                      Next Page
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            )}
          </Card>
        </Box>
      )}
    </Box>
  );
}
