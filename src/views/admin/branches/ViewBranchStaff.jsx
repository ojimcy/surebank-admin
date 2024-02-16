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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
// import { toSentenceCase } from 'utils/helper';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import { formatMdbDate } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import TransferStaffModal from 'components/modals/TransferStaffModal.js';

export default function ViewBranchStaff() {
  const { currentUser } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [allBranch, setAllBranch] = useState([]);
  const [showTransferStaffModal, setShowTransferStaffModal] = useState(false);
  const [staffUser, setStaffUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/staff/${id}?limit=${pageSize}&page=${pageIndex + 1}`
      );
      const currentBranch = await axiosService.get(`branch/${id}`);
      const branches = await axiosService.get('/branch/');
      setBranch(currentBranch.data);
      setAllBranch(branches.data.results);
      setStaffs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

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
            {row.staffId?.firstName} {row.staffId?.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Branch',
        accessor: (row) => row.branchId.name,
      },
      {
        Header: 'Role',
        accessor: (row) => roleLabels[row.staffId?.role],
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
              </>
            )}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Filter customers based on search term
  useEffect(() => {
    if (!staffs) {
      return;
    }

    // Filter out the current user from the staff list
    const filtered = staffs?.filter(
      (staff) => staff.staffId?.id !== currentUser.id
    );

    // Filter by name
    const filteredByName = filtered?.filter((staff) => {
      const fullName =
        `${staff.staffId?.firstName} ${staff.staffId?.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    setFilteredStaffs(filteredByName);
  }, [currentUser.id, searchTerm, staffs]);

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
          <Flex>
            <BackButton />
          </Flex>
          <Flex>
            <Text fontSize="2xl">
              {branch.name} Branch Staff
            </Text>
            <Spacer />
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
    </Box>
  );
}
