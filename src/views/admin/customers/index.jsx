// Chakra imports
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Badge,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Heading,
  useDisclosure,
  Divider,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, NavLink, Link } from 'react-router-dom';

// Custom components
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { EditIcon, SearchIcon, AddIcon, ViewIcon } from '@chakra-ui/icons';
import { FiUsers, FiDownload, FiPlus, FiEye } from 'react-icons/fi';
import { MdPeople } from 'react-icons/md';
import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import { useAuth } from 'contexts/AuthContext';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function Customers() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [staffInfo, setStaffInfo] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');

  const { isOpen: isBranchModalOpen, onOpen: onBranchModalOpen, onClose: onBranchModalClose } = useDisclosure();
  const [allBranch, setAllBranch] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'whiteAlpha.700');
  const bgColor = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Calculate statistics
  const customerStats = useMemo(() => {
    if (!customers.length) return { total: 0, active: 0, inactive: 0, ds: 0, sb: 0, ibs: 0 };

    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const inactive = customers.filter(c => c.status === 'inactive').length;
    const ds = customers.filter(c => c.accountType?.toLowerCase() === 'ds').length;
    const sb = customers.filter(c => c.accountType?.toLowerCase() === 'sb').length;
    const ibs = customers.filter(c => c.accountType?.toLowerCase() === 'ibs').length;

    return { total, active, inactive, ds, sb, ibs };
  }, [customers]);

  const fetchAccounts = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      let response;
      if (currentUser.role === 'userReps') {
        response = await axiosService.get(
          `/accounts/${currentUser.id}/staffaccounts?limit=${pageSize}&page=${pageIndex + 1
          }`
        );
        setCustomers(response.data);
      } else if (currentUser.role === 'manager') {
        const response = await axiosService.get(
          `accounts?limit=${pageSize}&page=${pageIndex + 1}&branchId=${currentUser.branchId
          }`
        );
        setCustomers(response.data.results);
      } else {
        response = await axiosService.get(
          `/accounts?limit=${pageSize}&page=${pageIndex + 1}`
        );
        setCustomers(response.data.results);
      }
      const branches = await axiosService.get('/branch/');
      setAllBranch(branches.data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchStaff = async () => {
      try {
        if (currentUser) {
          const getStaff = await axiosService.get(
            `/staff/user/${currentUser.id}`
          );
          if (isMounted) {
            setStaffInfo(getStaff.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Enhanced filter function
  useEffect(() => {
    if (!customers) {
      return;
    }

    const filtered = customers?.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.includes(searchTerm) ||
        customer.phoneNumber?.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesAccountType = accountTypeFilter === 'all' ||
        customer.accountType?.toLowerCase() === accountTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesAccountType;
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers, statusFilter, accountTypeFilter]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const viewbranchstaff = (data) => {
    if (!staffInfo) {
      return;
    }

    let branchId;
    if (currentUser.role === 'userReps') {
      branchId = staffInfo.branchId;
    } else {
      branchId = data.branchId;
    }
    history.push(`/admin/branch/viewbranchcustomers/${branchId}`);
  };

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

  // Enhanced columns with better styling
  const columns = React.useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: (row) => (
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" color={textColor}>
              <NavLink
                to={`/admin/customer/${row.accountType.toLowerCase()}/${row.userId}`}
                style={{ textDecoration: 'none' }}
              >
                {row.firstName} {row.lastName}
              </NavLink>
            </Text>
            <Text fontSize="sm" color={textColorSecondary}>
              {row.phoneNumber}
            </Text>
          </VStack>
        ),
      },
      {
        Header: 'Account Info',
        accessor: (row) => (
          <VStack align="start" spacing={1}>
            <HStack>
              <Badge colorScheme={getAccountTypeColor(row.accountType)} size="sm">
                {row.accountType?.toUpperCase()}
              </Badge>
            </HStack>
            <Text fontSize="sm" color={textColorSecondary} fontFamily="mono">
              {row.accountNumber}
            </Text>
          </VStack>
        ),
      },
      {
        Header: 'Status',
        accessor: (row) => (
          <Badge colorScheme={getStatusColor(row.status)} variant="subtle">
            {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
          </Badge>
        ),
      },
      {
        Header: 'Actions',
        accessor: (row) => (
          <HStack spacing={2}>
            <Tooltip label="View Details">
              <IconButton
                as={NavLink}
                to={`/admin/customer/${row.accountType.toLowerCase()}/${row.userId}`}
                icon={<ViewIcon />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                aria-label="View customer details"
              />
            </Tooltip>
            {(currentUser.role === 'superAdmin' || currentUser.role === 'admin') && (
              <Tooltip label="Edit Customer">
                <IconButton
                  as={NavLink}
                  to={`/admin/customer/edit-customer/${row.id}`}
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  aria-label="Edit customer"
                />
              </Tooltip>
            )}
          </HStack>
        ),
      },
    ],
    [currentUser.role, textColor, textColorSecondary]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAccountTypeFilter('all');
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={textColor}>
              Customer Management
            </Heading>
            <Text color={textColorSecondary}>
              Manage and view all customer accounts
            </Text>
          </VStack>
          <BackButton />
        </Flex>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>Total Customers</StatLabel>
              <StatNumber color={textColor}>{customerStats.total}</StatNumber>
            </Stat>
          </Box>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>Active</StatLabel>
              <StatNumber color="green.500">{customerStats.active}</StatNumber>
            </Stat>
          </Box>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>Inactive</StatLabel>
              <StatNumber color="red.500">{customerStats.inactive}</StatNumber>
            </Stat>
          </Box>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>DS</StatLabel>
              <StatNumber color="blue.500">{customerStats.ds}</StatNumber>
            </Stat>
          </Box>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>SB</StatLabel>
              <StatNumber color="purple.500">{customerStats.sb}</StatNumber>
            </Stat>
          </Box>
          <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <Stat>
              <StatLabel color={textColorSecondary}>IBS</StatLabel>
              <StatNumber color="orange.500">{customerStats.ibs}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Main Content Card */}
        <Card p={{ base: '20px', md: '30px' }}>
          {/* Action Bar */}
          <Flex
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            wrap="wrap"
            gap={4}
            mb={6}
          >
            <HStack spacing={3}>
              {(currentUser.role === 'superAdmin' || currentUser.role === 'admin') && (
                <Button
                  leftIcon={<FiEye />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={onBranchModalOpen}
                >
                  View Branch Customers
                </Button>
              )}
              {currentUser.role === 'userReps' && (
                <Button
                  leftIcon={<FiEye />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={viewbranchstaff}
                >
                  View Branch Customers
                </Button>
              )}
            </HStack>

            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<FiPlus />}
                colorScheme="brand"
                size="sm"
              >
                Create Customer
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<AddIcon />}
                  as={Link}
                  to="/admin/customer/create"
                >
                  New Customer
                </MenuItem>
                <MenuItem
                  icon={<MdPeople />}
                  as={Link}
                  to="/admin/customer/create-account"
                >
                  Existing User Account
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Divider mb={6} />

          {/* Search and Filter Section */}
          <VStack spacing={4} align="stretch" mb={6}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              align={{ base: 'stretch', md: 'center' }}
            >
              <InputGroup flex="1" maxW={{ base: '100%', md: '400px' }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={textColorSecondary} />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, account number, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={bgColor}
                  border="1px"
                  borderColor={borderColor}
                />
              </InputGroup>

              <HStack spacing={3}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="140px"
                  size="md"
                  bg={bgColor}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Select>

                <Select
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  w="160px"
                  size="md"
                  bg={bgColor}
                >
                  <option value="all">All Account Types</option>
                  <option value="ds">DS</option>
                  <option value="sb">SB</option>
                  <option value="ibs">IBS</option>
                </Select>

                {(searchTerm || statusFilter !== 'all' || accountTypeFilter !== 'all') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearFilters}
                    colorScheme="gray"
                  >
                    Clear Filters
                  </Button>
                )}
              </HStack>
            </Flex>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== 'all' || accountTypeFilter !== 'all') && (
              <HStack spacing={2} flexWrap="wrap">
                <Text fontSize="sm" color={textColorSecondary}>Active filters:</Text>
                {searchTerm && (
                  <Badge colorScheme="blue" variant="subtle">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge colorScheme="green" variant="subtle">
                    Status: {statusFilter}
                  </Badge>
                )}
                {accountTypeFilter !== 'all' && (
                  <Badge colorScheme="purple" variant="subtle">
                    Type: {accountTypeFilter.toUpperCase()}
                  </Badge>
                )}
              </HStack>
            )}
          </VStack>

          {/* Results Summary */}
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="sm" color={textColorSecondary}>
              Showing {filteredCustomers.length} of {customers.length} customers
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<FiDownload />}
                colorScheme="gray"
                onClick={() => {
                  // Export functionality can be added here
                  console.log('Export customers');
                }}
              >
                Export
              </Button>
            </HStack>
          </Flex>

          {/* Table Section */}
          <Box>
            {loading ? (
              <Flex justify="center" align="center" minH="200px">
                <LoadingSpinner />
              </Flex>
            ) : filteredCustomers.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                minH="200px"
                textAlign="center"
                spacing={4}
              >
                <Icon as={FiUsers} boxSize={12} color={textColorSecondary} />
                <VStack spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    No customers found
                  </Text>
                  <Text color={textColorSecondary}>
                    {searchTerm || statusFilter !== 'all' || accountTypeFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters'
                      : 'Get started by creating your first customer'
                    }
                  </Text>
                  {!searchTerm && statusFilter === 'all' && accountTypeFilter === 'all' && (
                    <Button
                      as={Link}
                      to="/admin/customer/create"
                      colorScheme="brand"
                      size="sm"
                      mt={4}
                    >
                      Create First Customer
                    </Button>
                  )}
                </VStack>
              </Flex>
            ) : (
              <CustomTable
                columns={columns}
                data={filteredCustomers}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Card>
      </VStack>

      {/* Enhanced Branch Selection Modal */}
      <Modal isOpen={isBranchModalOpen} onClose={onBranchModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>Select Branch</Text>
              <Text fontSize="sm" color={textColorSecondary} fontWeight="normal">
                Choose a branch to view its customers
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(viewbranchstaff)}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={errors.branchId}>
                  <Select
                    {...register('branchId', { required: 'Please select a branch' })}
                    placeholder="Select a branch"
                    size="lg"
                    bg={bgColor}
                  >
                    {allBranch?.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </Select>
                  {errors.branchId && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.branchId.message}
                    </Text>
                  )}
                </FormControl>

                <HStack spacing={3} justify="flex-end">
                  <Button variant="ghost" onClick={onBranchModalClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    isLoading={isSubmitting}
                    loadingText="Loading..."
                  >
                    View Customers
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
