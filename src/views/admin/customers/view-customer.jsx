import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Chakra imports
import { Box, Center, Spinner } from '@chakra-ui/react';

// Custom components
import axiosService from 'utils/axiosService';

// Assets
import { toast } from 'react-toastify';
import Card from 'components/card/Card';
import MainCustomerDetails from './components/CustomerDetail';
import CustomerTransactions from './components/CustomerTransaction';

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
            <MainCustomerDetails
              user={user}
              userAccount={userAccount}
              userPackage={userPackage}
            />

            {transactionsLoading ? (
              <Center>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : (
              <CustomerTransactions
                transactions={transactions}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePreviousPageClick={handlePreviousPageClick}
                handleNextPageClick={handleNextPageClick}
              />
            )}
          </Card>
        </Box>
      )}
    </Box>
  );
}
