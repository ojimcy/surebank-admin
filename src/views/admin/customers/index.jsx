// Chakra imports
import {
  Box,
  Grid,
  Button,
  Spinner,
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
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory, NavLink, Link } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import { toast } from 'react-toastify';
import SimpleTable from 'components/table/SimpleTable';
import { useForm } from 'react-hook-form';
import { useAuth } from 'contexts/AuthContext';

export default function Customers() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const pageLimit = 10;

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      let response;
      if (currentUser.role === 'userReps') {
        response = await axiosService.get(
          `/accounts/${currentUser.id}/staffaccounts`
        );
        setCustomers(response.data);
        setTotalResults(response.data.length);
      } else if(currentUser.role === 'manager') {

      const response = await axiosService.get(
        `accounts/${currentUser.branchId}/branchaccounts`
      );
        setCustomers(response.data);
        setTotalResults(response.data.length);
      }
      
      else {
        response = await axiosService.get('/accounts/');
        setCustomers(response.data.results);
      }
      const branches = await axiosService.get('/branch/');
      setAllBranch(branches.data.results);
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

  const openbranchcustomermodal = () => {
    setShowBranchModal(true);
  };

  const closebranchcustomermodal = () => {
    setShowBranchModal(false);
  };
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const viewbranchstaff = (data) => {
    const branchId = data.branchId;
    history.push(`/admin/branch/viewbranchcustomers/${branchId}`);
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
          <>
            {/* Edit user icon */}
            <NavLink
              to={`/admin/customer/edit-customer/${row.id}`}
              style={{ marginRight: '10px' }}
            >
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
              onClick={() => handleDeleteIconClick(row.id)}
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
          <Flex justifyContent="flex-end">
            <Button
              bgColor="blue.700"
              color="white"
              borderRadius="5px"
              mr={4}
              onClick={openbranchcustomermodal}
            >
              View Branch Customer
            </Button>
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
              <SimpleTable
                columns={columns}
                data={filteredCustomers}
                pageSize={pageLimit}
                totalPages={totalResults}
              />
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

      {/* Select branch modal */}
      <Modal isOpen={showBranchModal} onClose={closebranchcustomermodal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Branch Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <FormLabel color={isError ? "red" : "green"}>{message}</FormLabel>{" "} */}
            <Box>
              {/* <Card p={{ base: "30px", md: "30px", sm: "10px" }}> */}
              <form onSubmit={handleSubmit(viewbranchstaff)}>
                <Flex
                  gap="20px"
                  marginBottom="20px"
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box width={{ base: '100%', md: '100%', sm: '100%' }}>
                    <FormControl isInvalid={errors.branch}>
                      <Select
                        {...register('branchId')}
                        name="branchId"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a branch
                        </option>
                        {allBranch &&
                          allBranch.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Flex>

                <Spacer />
                <Button
                  bgColor="blue.700"
                  color="white"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  View
                </Button>
                {/* </Flex> */}
              </form>
              {/* </Card> */}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
