// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
// Custom icons
import React from 'react';

export default function AccountSummary() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  return (
    <Card py="15px">
      <Flex
        my="auto"
        h="100%"
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        Account Information
        <Stat my="auto" ms="18px">
          <StatLabel
            lineHeight="100%"
            color={textColorSecondary}
            fontSize={{
              base: 'sm',
            }}
          >
            info
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: '2xl',
            }}
          >
            50000
          </StatNumber>
          <Flex align="center">
            <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
              grow
            </Text>
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
              since last month
            </Text>
          </Flex>
        </Stat>
        <Flex ms="auto" w="max-content">
          another
        </Flex>
      </Flex>
    </Card>
  );
}
