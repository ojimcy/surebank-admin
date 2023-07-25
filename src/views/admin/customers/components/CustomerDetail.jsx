import React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney, MdBarChart } from 'react-icons/md';
import { formatNaira, formatDate } from 'utils/helper';
import { NavLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';

const MainCustomerDetails = ({ user, userAccount, userPackage }) => {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  return (
    <>
      <BackButton />
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px" mt="30px">
        {user && userAccount && (
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
                      Total:{' '}
                      {userPackage?.totalContribution
                        ? formatNaira(userPackage?.totalContribution)
                        : 'N/A'}
                    </Text>
                    <Text fontWeight="bold">
                      Daily:{' '}
                      {userPackage?.amountPerDay
                        ? formatNaira(userPackage?.amountPerDay)
                        : 'N/A'}
                    </Text>
                    <Text>
                      Start date:{' '}
                      {userPackage?.startDate
                        ? formatDate(userPackage?.startDate)
                        : 'N/A'}
                    </Text>
                  </Grid>
                </Box>
              </Flex>
            </Box>
          </Flex>
        )}

        {user && userAccount && (
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
                      Balance:{' '}
                      {userAccount.availableBalance
                        ? formatNaira(userAccount.availableBalance)
                        : 'N/A'}
                    </Text>
                  </Grid>
                </Box>
              </Flex>
            </Box>
          </Flex>
        )}

        {user && userAccount && (
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: 'row' }}
            alignItems="center"
            justifyContent="center"
          >
            <Button as={NavLink} to={`/deposit`} colorScheme="green">
              <AddIcon /> Deposit
            </Button>
            <Button as={NavLink} to={`/withdraw`} colorScheme="red">
              Withdraw
            </Button>
          </Flex>
        )}
      </SimpleGrid>
    </>
  );
};

export default MainCustomerDetails;
