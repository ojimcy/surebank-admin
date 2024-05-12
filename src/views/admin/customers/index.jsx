// Chakra imports
import {
  Box,
  Grid,
  Button,
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
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory, NavLink, Link } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { EditIcon, SearchIcon } from '@chakra-ui/icons';
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

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const textColor = useColorModeValue('secondaryGray.500', 'white');

  const fetchAccounts = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      let response;
      if (currentUser.role === 'userReps') {
        response = await axiosService.get(
          `/accounts/${currentUser.id}/staffaccounts?limit=${pageSize}&page=${
            pageIndex + 1
          }`
        );
        setCustomers(response.data);
      } else if (currentUser.role === 'manager') {
        const response = await axiosService.get(
          `accounts?limit=${pageSize}&page=${pageIndex + 1}&branchId=${
            currentUser.branchId
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
    }
  };
  // Fetch customers
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
      // Cleanup function to set the isMounted flag to false when the component unmounts
      isMounted = false;
    };
  }, [currentUser]);

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

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink
            to={`/admin/customer/${row.accountType.toLowerCase()}/${
              row.userId
            }`}
          >
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
        accessor: (row) => row.accountType.toUpperCase(),
      },
      {
        Header: 'Account Number',
        accessor: 'accountNumber',
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {currentUser.role === 'superAdmin' ||
            currentUser.role === 'admin' ? (
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
              </>
            ) : (
              <NavLink
                to={`/admin/customer/${row.accountType.toLowerCase()}/${
                  row.userId
                }`}
              >
                Details
              </NavLink>
            )}
          </>
        ),
      },
    ],
    [currentUser.role]
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
          <Flex justifyContent="flex-end">
            <Menu isLazy>
              {currentUser.role === 'superAdmin' ||
              currentUser.role === 'admin' ? (
                <Button
                  bgColor="blue.700"
                  color="white"
                  px="28px"
                  py="28px"
                  borderRadius="5px"
                  mr={4}
                  fontSize="sm"
                  onClick={openbranchcustomermodal}
                >
                  View Branch Customer
                </Button>
              ) : currentUser.role === 'userReps' ? (
                <Button
                  bgColor="blue.700"
                  color="white"
                  px="28px"
                  py="28px"
                  borderRadius="5px"
                  mr={4}
                  onClick={viewbranchstaff}
                >
                  View Branch Customer
                </Button>
              ) : (
                ''
              )}
              <MenuButton
                bgColor="blue.700"
                color="white"
                px="15px"
                py="15px"
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
                      color={textColor}
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
              <LoadingSpinner />
            ) : filteredCustomers.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No customer found.
              </Text>
            ) : (
              <CustomTable
                columns={columns}
                data={filteredCustomers}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Card>
      </Grid>

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
