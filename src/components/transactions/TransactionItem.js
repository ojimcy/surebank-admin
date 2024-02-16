import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { FaMoneyBillWave, FaMoneyCheckAlt } from 'react-icons/fa';
import { formatDate, formatNaira } from 'utils/helper';

export default function TransactionItem({ transaction }) {
  const getIconByNarration = () => {
    const narration = transaction.narration.toLowerCase();
    if (narration.includes('daily contribution')) {
      return <FaMoneyCheckAlt />;
    } else if (
      narration.includes('sb daily contribution - cash') ||
      narration.includes('sb daily contribution - transfer')
    ) {
      return <FaMoneyCheckAlt />;
    } else if (narration.includes('daily contribution withdrawal')) {
      return <RiArrowDownSLine />;
    } else if (narration.includes('request cash')) {
      return <FaMoneyBillWave />;
    } else {
      return <FaMoneyBillWave />;
    }
  };

  const getAmountColor = () => {
    const narration = transaction.narration.toLowerCase();

    if (narration.includes('daily contribution withdrawal')) {
      return 'blue.500';
    } else if (narration.includes('request cash')) {
      return 'red.500';
    } else if (narration.includes('daily contribution')) {
      return 'green.500';
    } else if (
      narration.includes('sb daily contribution - cash') ||
      narration.includes('sb daily contribution - transfer')
    ) {
      return 'green.500';
    } else {
      return 'gray.500';
    }
  };

  return (
    <Flex
      alignItems="center"
      borderWidth="1px"
      borderRadius="md"
      p="4"
      mb="2"
      boxShadow="md"
    >
      <Box fontSize="2xl" color="green.500">
        {getIconByNarration()}
      </Box>
      <Box flex="1" ml="4">
        <Text fontSize="sm" color="gray.500">
          {transaction.narration}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Rep: {transaction.createdBy?.firstName}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Acc: {transaction.userId?.lastName} {transaction.userId?.firstName}
        </Text>
      </Box>
      <Box>
        <Text fontWeight="bold" fontSize="md" color={getAmountColor()}>
          {formatNaira(transaction.amount)}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {formatDate(transaction.date)}
        </Text>
        <Text
          fontSize="sm"
          color={transaction.status === 'success' ? 'green.500' : 'red.500'}
        >
          {transaction.status}
        </Text>
      </Box>
    </Flex>
  );
}
