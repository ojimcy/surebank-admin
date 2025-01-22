import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import { Text, Stack, Select } from '@chakra-ui/react';
import { formatDate } from 'utils/helper';

export default function TransactionHistory() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchTransactionHistory();
  }, [id, transactionType, timeRange]);

  const fetchTransactionHistory = async () => {
    try {
      // Construct the API endpoint based on filters
      let endpoint = `/transaction/history/${id}?transactionType=${transactionType}`;
      if (timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        if (timeRange === 'last7days') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'last30days') {
          startDate.setDate(now.getDate() - 30);
        }
        endpoint += `&startDate=${startDate.toISOString()}&endDate=${now.toISOString()}`;
      }

      const response = await axiosService.get(endpoint);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div>
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Transaction History
      </Text>
      <Stack direction="row" spacing="4" mb="4">
        <Select value={transactionType} onChange={handleTransactionTypeChange}>
          <option value="all">All Transaction Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
        </Select>
        <Select value={timeRange} onChange={handleTimeRangeChange}>
          <option value="all">All Time</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
        </Select>
      </Stack>
      <Stack spacing="4">
        {transactions.map((transaction, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '8px' }}>
            <Text>Date: {formatDate(transaction.date)}</Text>
            <Text>Type: {transaction.type}</Text>
            <Text>Amount: {transaction.amount}</Text>
          </div>
        ))}
      </Stack>
    </div>
  );
}
