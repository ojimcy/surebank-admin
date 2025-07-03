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
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Heading,
  Avatar,
  AvatarBadge,
  Tooltip,
  Card,
} from '@chakra-ui/react';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney, MdBarChart, MdAccountBalance, MdPerson } from 'react-icons/md';
import { FiTrendingUp, FiCalendar, FiDollarSign, FiUser, FiCreditCard } from 'react-icons/fi';
import { formatNaira, formatDate } from 'utils/helper';
import { NavLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';

const MainCustomerDetails = ({ user, userAccount, userPackage }) => {
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'whiteAlpha.700');
  const bgColor = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'navy.700');
  const gradientBg = useColorModeValue(
    'linear(to-r, brand.400, brand.600)',
    'linear(to-r, brand.400, brand.600)'
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getAccountTypeColor = (accountType) => {
    switch (accountType?.toLowerCase()) {
      case 'ds':
        return 'blue';
      case 'sb':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getAccountTypeLabel = (accountType) => {
    switch (accountType?.toLowerCase()) {
      case 'ds':
        return 'Daily Savings';
      case 'sb':
        return 'Savings Bank';
      default:
        return accountType?.toUpperCase();
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <BackButton />

        {user && userAccount && (
          <HStack spacing={3}>
            <Tooltip label="Make a deposit to this account">
              <Button
                as={NavLink}
                to={`/admin/transaction/deposit`}
                leftIcon={<AddIcon />}
                colorScheme="green"
                size="sm"
                variant="solid"
              >
                Deposit
              </Button>
            </Tooltip>
            <Tooltip label="Process a withdrawal">
              <Button
                as={NavLink}
                to={`/admin/transaction/withdraw`}
                colorScheme="red"
                size="sm"
                variant="outline"
              >
                Withdraw
              </Button>
            </Tooltip>
          </HStack>
        )}
      </Flex>

      {/* Customer Profile Header */}
      {user && userAccount && (
        <Box
          bg={gradientBg}
          borderRadius="xl"
          p={6}
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="150px"
            h="150px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="100px"
            h="100px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />

          <HStack spacing={4} position="relative" zIndex={1}>
            <Avatar
              size="lg"
              name={`${user.firstName} ${user.lastName}`}
              bg="whiteAlpha.300"
              color="white"
            >
              <AvatarBadge
                boxSize="1.25em"
                bg={userAccount.status === 'active' ? 'green.500' : 'red.500'}
              />
            </Avatar>

            <VStack align="start" spacing={1}>
              <Heading size="lg" color="white">
                {user.firstName} {user.lastName}
              </Heading>
              <HStack spacing={3}>
                <Badge
                  colorScheme={getAccountTypeColor(userAccount.accountType)}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {getAccountTypeLabel(userAccount.accountType)}
                </Badge>
                <Badge
                  colorScheme={getStatusColor(userAccount.status)}
                  variant="outline"
                  borderRadius="full"
                  px={3}
                  py={1}
                  borderColor="whiteAlpha.500"
                  color="white"
                >
                  {userAccount.status?.charAt(0).toUpperCase() + userAccount.status?.slice(1)}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="whiteAlpha.800" fontFamily="mono">
                Account: {userAccount.accountNumber}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}

      {/* Account Information Cards */}
      {user && userAccount && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {/* Account Balance Card */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <VStack align="start" spacing={4}>
              <HStack>
                <IconBox
                  w="50px"
                  h="50px"
                  bg="green.100"
                  icon={<Icon as={MdAccountBalance} w="24px" h="24px" color="green.500" />}
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color={textColorSecondary}>
                    Available Balance
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {userAccount.availableBalance
                      ? formatNaira(userAccount.availableBalance)
                      : '₦0.00'}
                  </Text>
                </VStack>
              </HStack>

              <Divider />

              <VStack align="start" spacing={2} w="full">
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color={textColorSecondary}>
                    Account Type
                  </Text>
                  <Badge colorScheme={getAccountTypeColor(userAccount.accountType)} size="sm">
                    {getAccountTypeLabel(userAccount.accountType)}
                  </Badge>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color={textColorSecondary}>
                    Status
                  </Text>
                  <Badge colorScheme={getStatusColor(userAccount.status)} size="sm">
                    {userAccount.status?.charAt(0).toUpperCase() + userAccount.status?.slice(1)}
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Package Information Card */}
          {userPackage && (
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              border="1px"
              borderColor={borderColor}
              shadow="sm"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <HStack>
                  <IconBox
                    w="50px"
                    h="50px"
                    bg="blue.100"
                    icon={<Icon as={FiTrendingUp} w="24px" h="24px" color="blue.500" />}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color={textColorSecondary}>
                      Package Details
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      Savings Plan
                    </Text>
                  </VStack>
                </HStack>

                <Divider />

                <VStack align="start" spacing={3} w="full">
                  <HStack justify="space-between" w="full">
                    <HStack>
                      <Icon as={FiDollarSign} color={textColorSecondary} />
                      <Text fontSize="sm" color={textColorSecondary}>
                        Total Contribution
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {userPackage.totalContribution
                        ? formatNaira(userPackage.totalContribution)
                        : '₦0.00'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <HStack>
                      <Icon as={FiCalendar} color={textColorSecondary} />
                      <Text fontSize="sm" color={textColorSecondary}>
                        Daily Amount
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {userPackage.amountPerDay
                        ? formatNaira(userPackage.amountPerDay)
                        : '₦0.00'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <HStack>
                      <Icon as={FiCalendar} color={textColorSecondary} />
                      <Text fontSize="sm" color={textColorSecondary}>
                        Start Date
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {userPackage.startDate
                        ? formatDate(userPackage.startDate)
                        : 'N/A'}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          )}

          {/* Customer Information Card */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <VStack align="start" spacing={4}>
              <HStack>
                <IconBox
                  w="50px"
                  h="50px"
                  bg="purple.100"
                  icon={<Icon as={FiUser} w="24px" h="24px" color="purple.500" />}
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color={textColorSecondary}>
                    Customer Info
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Personal Details
                  </Text>
                </VStack>
              </HStack>

              <Divider />

              <VStack align="start" spacing={3} w="full">
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color={textColorSecondary}>
                    Full Name
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {user.firstName} {user.lastName}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color={textColorSecondary}>
                    Phone Number
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {user.phoneNumber || 'N/A'}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color={textColorSecondary}>
                    Account Number
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor} fontFamily="mono">
                    {userAccount.accountNumber}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </SimpleGrid>
      )}

      {/* Empty State */}
      {(!user || !userAccount) && (
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={12}
          border="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Icon as={MdPerson} boxSize={16} color={textColorSecondary} />
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                No Customer Data Available
              </Text>
              <Text color={textColorSecondary}>
                Customer information could not be loaded at this time.
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default MainCustomerDetails;
