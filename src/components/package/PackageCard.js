import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';
import { formatDate, formatNaira } from 'utils/helper';

const PackageCard = ({ packageData }) => {
  const { target, amountPerDay, startDate, totalContribution, totalCount } =
    packageData;

  const progressValue = ((totalCount / 31) * 100).toFixed(2);

  return (
    <Box borderWidth="1px" borderRadius="md" p="6" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        {target}
      </Text>
      <Flex justify="space-between" alignItems="center" m="2">
        <Text fontSize="lg" fontWeight="bold">
          {formatNaira(totalContribution)}
        </Text>
      </Flex>
      <Text fontSize="md">Target Amount: {formatNaira(amountPerDay)}</Text>
      <Box mt="4">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Start Date: {formatDate(startDate)}</Text>
          <CircularProgress value={progressValue} size="50px" thickness="6px">
            <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
          </CircularProgress>
        </Flex>
      </Box>
      <Flex mt="4" justify="space-between">
        <Link to={`/admin/daily-savings/withdraw/${packageData.id}`}>
          <Button colorScheme="red" size="sm">
            Withdraw
          </Button>
        </Link>
        <Link to={`/admin/daily-savings/deposit/${packageData.id}`}>
          <Button colorScheme="green" size="sm">
            Deposit
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default PackageCard;
