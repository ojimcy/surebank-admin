// Chakra imports
import {
  Box,
  Grid,
  Button,
  Spinner,
  HStack,
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import { toast } from 'react-toastify';
import CustomTable from 'components/table/CustomTable';

export default function Customers() {
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchAccounts = async () => {
    const staffId = id;
    setLoading(true);
    try {
      const response = await axiosService.get(
        `accounts/${staffId}/staffaccounts`
      );
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch customers
  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    if (!customers) {
      return;
    }

    const filtered = customers?.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.includes(searchTerm)
      );
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleDeleteIconClick = (userId) => {
    setCustomerToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      handleDeleteCustomer(customerToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to handle customer deletion
  const handleDeleteCustomer = async (userId) => {
    try {
      await axiosService.delete(`/accounts/${userId}`);
      toast.success('Customer deleted successfully!');
      fetchAccounts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink to={`/admin/customer/${row.userId}`}>
            {row.firstName} {row.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Account Type',
        accessor: 'accountType',
      },
      {
        Header: 'Account Number',
        accessor: 'accountNumber',
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <HStack>
            {/* Edit user icon */}
            <NavLink to={`/admin/customer/edit-customer/${row.userId}`}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                aria-label="Edit user"
              />
            </NavLink>
            {/* Delete user icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete user"
              onClick={() => handleDeleteIconClick(row.userId)}
            />
          </HStack>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <Flex justifyContent="space-between" mb="20px">
            <BackButton />
          </Flex>
          <Flex>
            <Text fontSize="2xl">Staff Customers</Text>
            <Spacer />
            <Menu isLazy>
              <MenuButton
                bgColor="blue.700"
                color="white"
                px="15px"
                borderRadius="5px"
              >
                Create Customer
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                  as={Link}
                  to="/admin/customer/create"
                >
                  <Text fontSize="sm">New User</Text>
                </MenuItem>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                  as={Link}
                  to="/admin/customer/create-account"
                >
                  <Text fontSize="sm">Existing User</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
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
          </Box>
          <Box marginTop="30">
            {loading ? (
              <Spinner />
            ) : (
              <CustomTable columns={columns} data={filteredCustomers} />
            )}
          </Box>
        </Card>
      </Grid>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this customer?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
