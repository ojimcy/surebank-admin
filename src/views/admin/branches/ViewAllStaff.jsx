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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components
import { formatMdbDate } from 'utils/helper';

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import AssignRoleModal from 'components/modals/AssignRoleModal.js';
import CreateStaffModal from 'components/modals/CreateStaffModal.js';
import TransferStaffModal from 'components/modals/TransferStaffModal.js';
import CustomTable from 'components/table/CustomTable';
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { useAuth } from 'contexts/AuthContext';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import BackButton from 'components/menu/BackButton';

export default function Users() {
  const [staffs, setStaffs] = useState([]);
  const [users, setUsers] = useState([]);
  const [staffUser, setStaffUser] = useState('');
  const [allBranch, setAllBranch] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTransferStaffModal, setShowTransferStaffModal] = useState(false);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [staffInfo, setStaffInfo] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { currentUser } = useAuth();

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

  const fetchUsers = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      const branches = await axiosService.get('/branch/');
      let staffResponse;
      if (currentUser.role === 'manager') {
        staffResponse = await axiosService.get(`/staff/${staffInfo?.branchId}`);
      } else {
        staffResponse = await axiosService.get(
          `/staff?limit=${pageSize}&page=${pageIndex + 1}`
        );
      }
      const UserResponse = await axiosService.get(
        `/users?role=user&limit=10000000`
      );

      setUsers(UserResponse.data.results);
      setAllBranch(branches.data.results);
      setStaffs(staffResponse.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (staffInfo) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, staffInfo]);

  useEffect(() => {
    // Filter customers based on search term
    if (!staffs) {
      return;
    }

    const filtered = staffs?.filter((staff) => {
      const fullName =
        `${staff.staffId.firstName} ${staff.staffId.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredStaffs(filtered);
  }, [searchTerm, staffs]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const openTransferStaffModal = async (staffUserId) => {
    const response = await axiosService.get(`users/${staffUserId}`);
    setStaffUser(response.data);
    setShowTransferStaffModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferStaffModal(false);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
  };

  const transferStaffToBranch = async (data) => {
    try {
      await axiosService.patch(`/staff`, data);
      toast.success('Staff transfered successfully!');
      closeTransferModal();
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleAddStaffToBranch = () => {
    setShowCreateStaffModal(true);
  };

  const handleAddRoleToStaff = () => {
    setShowRoleModal(true);
  };

  const onClosestaffModal = () => {
    setShowCreateStaffModal(false);
  };

  const createStaff = async (data) => {
    try {
      await axiosService.post(`/staff`, data);
      toast.success('Staff has been created successfully!');
      onClosestaffModal();
      fetchUsers();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  const addRoleToStaff = async (data) => {
    try {
      await axiosService.patch(`/staff/role`, data);
      toast.success('Role added to staff successfully');
      closeRoleModal();
      fetchUsers();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  const handleDeactivateStaff = async (staffId) => {
    try {
      await axiosService.post(`/staff/${staffId}/deactivate`);
      toast.success('Staff deactivated!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleReactivateStaff = async (staffId) => {
    try {
      await axiosService.post(`/staff/${staffId}/activate`);
      toast.success('Staff activated!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  // Filter customers based on search term
  useEffect(() => {
    if (!staffs) {
      return;
    }

    const filtered = staffs?.filter((staff) => {
      const fullName =
        `${staff.staffId.firstName} ${staff.staffId.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredStaffs(filtered);
  }, [searchTerm, staffs]);

  const roleLabels = {
    userReps: 'Sales Rep',
    manager: 'Manager',
    admin: 'Admin',
    superAdmin: 'Super Admin',
  };

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Staff Name',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.staffId?.id}`}>
            {row.staffId.firstName} {row.staffId.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Branch',
        accessor: (row) => row.branchId.name,
      },
      {
        Header: 'Role',
        accessor: (row) => roleLabels[row.staffId.role],
      },
      {
        Header: 'Status',
        accessor: (row) => (row.isCurrent ? 'Active' : 'Inactive'),
      },
      {
        Header: 'Created At',
        accessor: (row) => formatMdbDate(row.createdAt),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {currentUser.role === 'superAdmin' ||
            currentUser.role === 'admin' ? (
              <>
                {row.isActive ? (
                  <Button
                    mt={0}
                    ml={2}
                    colorScheme="red"
                    size="md"
                    onClick={() => handleDeactivateStaff(row.staffId?.id)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    mt={0}
                    ml={2}
                    colorScheme="red"
                    size="md"
                    onClick={() => handleReactivateStaff(row.staffId?.id)}
                  >
                    Activate
                  </Button>
                )}

                <Button
                  mt={0}
                  ml={2}
                  colorScheme="blue"
                  size="md"
                  onClick={() => openTransferStaffModal(row.staffId?.id)}
                >
                  Transfer
                </Button>
              </>
            ) : (
              <NavLink to={`/admin/user/${row.staffId?.id}`}>Details</NavLink>
            )}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <BackButton />
          <Flex>
            <Text fontSize="2xl">All Staff</Text>
            <Spacer />

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Staff
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleAddStaffToBranch}>
                  Create New Staff
                </MenuItem>
                <MenuItem onClick={handleAddRoleToStaff}>Asign Role</MenuItem>
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
                      placeholder="Search staffs by name"
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
              <LoadingSpinner />
            ) : filteredStaffs.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No staff found.
              </Text>
            ) : (
              <CustomTable
                columns={columns}
                data={filteredStaffs}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Card>
      </Grid>

      {/* Transfer staff modal */}
      <TransferStaffModal
        isOpen={showTransferStaffModal}
        onClose={closeTransferModal}
        staffUser={staffUser}
        allBranch={allBranch}
        transferStaffToBranch={transferStaffToBranch}
      />

      {/* Modal for adding new staff */}
      <CreateStaffModal
        isOpen={showCreateStaffModal}
        onClose={onClosestaffModal}
        allBranch={allBranch}
        createStaff={createStaff}
      />

      {/* Modal for assigning role to staff */}
      <AssignRoleModal
        isOpen={showRoleModal}
        onClose={closeRoleModal}
        staffs={staffs}
        addRoleToStaff={addRoleToStaff}
      />
    </Box>
  );
}
