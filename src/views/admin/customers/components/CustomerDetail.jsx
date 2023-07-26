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
      <Flex justifyContent="space-between">
        <BackButton />
        {user && userAccount && (
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: 'row' }}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              as={NavLink}
              to={`/admin/transaction/deposit`}
              colorScheme="green"
            >
              <AddIcon /> Deposit
            </Button>
            <Button
              as={NavLink}
              to={`/admin/transaction/withdraw`}
              colorScheme="red"
            >
              Withdraw
            </Button>
          </Flex>
        )}
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="2px" mb="20px" mt="30px">
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
              minWidth="346px"
              minH="176.9px"
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
                  <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                    <Text fontWeight="bold" fontSize="1xl">
                      Total:{' '}
                    </Text>
                    <Text>
                      {userPackage?.totalContribution
                        ? formatNaira(userPackage?.totalContribution)
                        : ''}
                    </Text>
                    <Text fontWeight="bold">Daily: </Text>
                    <Text>
                      {userPackage?.amountPerDay
                        ? formatNaira(userPackage?.amountPerDay)
                        : ''}
                    </Text>
                    <Text fontWeight="bold"> Start date: </Text>
                    <Text>
                      {userPackage?.startDate
                        ? formatDate(userPackage?.startDate)
                        : ''}
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
                  <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                    <Text fontWeight="bold">Account Type: </Text>
                    <Text>{userAccount.accountType}</Text>

                    <Text fontWeight="bold">Account Number:</Text>
                    <Text>{userAccount.accountNumber}</Text>
                    <Text fontWeight="bold" fontSize="1xl">
                      Balance:{' '}
                    </Text>
                    <Text>
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
      </SimpleGrid>
    </>
  );
};

export default MainCustomerDetails;
