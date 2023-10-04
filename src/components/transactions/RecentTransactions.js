import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Select,
  FormControl,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import SimpleTable from 'components/table/SimpleTable';

function RecentTransactions({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const filtered = transactions?.filter((transaction) => {
      if (selectedFilter === 'all') {
        return true;
      } else if (selectedFilter === 'deposit') {
        return transaction.narration === 'Daily contribution';
      } else if (selectedFilter === 'withdrawal') {
        return transaction.narration !== 'Daily contribution';
      }
      return false;
    });
    setFilteredTransaction(filtered);
  }, [selectedFilter, transactions]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Naration',
        accessor: 'narration',
        Cell: ({ value }) => (
          <Text>
            {value === 'Daily contribution withdrawal'
              ? 'Deposit'
              : 'Withdrawal'}
          </Text>
        ),
      },
      {
        Header: 'Created By',
        accessor: (row) =>
          `${row.createdBy?.firstName} ${row.createdBy?.lastName}`,
      },
    ],
    []
  );
  return (
    <Box mt="80px">
      <Flex
        justifyContent="space-between"
        mb="40px"
        flexDirection={{
          base: 'column',
          xl: 'row',
        }}
      >
        <Heading size="lg" mb="4">
          Recent Transactions
        </Heading>
        <Box>
          <Stack direction="row">
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </Select>
            <FormControl>
              <Input
                type="search"
                placeholder="Search"
                borderColor="black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>
            <Button bgColor="blue.700" color="white">
              <SearchIcon />
            </Button>
          </Stack>
        </Box>
      </Flex>
      {transactions && transactions.length > 0 ? (
        <SimpleTable
          columns={columns}
          data={filteredTransaction}
          pageSize="10"
        />
      ) : (
        <Text>Transaction not found</Text>
      )}
    </Box>
  );
}

export default RecentTransactions;
