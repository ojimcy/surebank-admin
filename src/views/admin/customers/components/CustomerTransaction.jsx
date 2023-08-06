import React from 'react';
import {
  Box,
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { formatDate } from 'utils/helper';

const CustomerTransactions = ({
  transactions,
  currentPage,
  totalPages,
  handlePreviousPageClick,
  handleNextPageClick,
}) => {
  return (
    <>
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
                  <Th>Narration</Th>
                  <Th>Amount</Th>
                  <Th>Operator</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{transaction.date && formatDate(transaction.date)}</Td>
                    <Td>{transaction.direction}</Td>
                    <Td>{transaction.narration}</Td>
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
    </>
  );
};

export default CustomerTransactions;
