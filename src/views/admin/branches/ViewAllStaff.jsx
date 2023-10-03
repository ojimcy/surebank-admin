// Chakra imports
import {
  Box,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  HStack,
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  Input,
  TableContainer,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import AssignRoleModal from 'components/modals/AssignRoleModal.js';
import AddStaffModal from 'components/modals/AddStaffModal.js';
import TransferStaffModal from 'components/modals/TransferStaffModal.js';
import {
  ChevronDownIcon,
  DeleteIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import { toast } from 'react-toastify';

export default function Users() {
  const [staffs, setStaffs] = useState([]);
  const [users, setUsers] = useState([]);
  const [staffUser, setStaffUser] = useState('');
  const [allBranch, setAllBranch] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferStaffModal, setShowTransferStaffModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const branches = await axiosService.get('/branch/');
      const response = await axiosService.get(`/staff`);
      const UserResponse = await axiosService.get('/users/');
      setUsers(UserResponse.data.results);
      setAllBranch(branches.data.results);
      setStaffs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  const openTransferStaffModal = async (staffUserId) => {
    const response = await axiosService.get(`users/${staffUserId}`);
    setStaffUser(response.data);
    setShowTransferStaffModal(true);
  };

  const handleDeleteIconClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const onCloseModal = () => {
    setShowDeleteModal(false);
  };

  const closeTransferModal = () => {
    setShowTransferStaffModal(false);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
  };

  // Function to handle user deletion
  const handleDeleteUser = async (staffId) => {
    try {
      await axiosService.delete(`/${staffId}/staff`);
      toast.success('Staff deleted successfully!');
      // After successful deletion, refetch the users to update the list
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
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

  const addStaffToBranch = async (data) => {
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

  
  const roleLabels = {
    userReps: 'Cashier',
    manager: 'Manager',
    admin: 'Admin',
    superAdmin: 'Super Admin',
  };

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
                      placeholder="Type a name"
                      borderColor="black"
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
              <TableContainer>
                <Table variant="simple" bordered>
                  <Thead>
                    <Tr>
                      <Th>Staff Name </Th>
                      <Th>Branch </Th>
                      <Th>Role </Th>
                      <Th>Created Date </Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  {staffs.length === 0 ? (
                    <Text>No Staff in this branch</Text>
                  ) : (
                    <Tbody>
                      {staffs?.map((staff) => (
                        <Tr key={staff.staffId?.id}>
                          <Td>
                            <NavLink
                              to={`/admin/user/${staff.staffId?.id}`}
                            >{`${staff.staffId?.firstName} ${staff.staffId?.lastName}`}</NavLink>{' '}
                          </Td>
                          <Td>{staff.branchId?.name}</Td>
                          <Td>{roleLabels[staff.staffId?.role]}</Td>
                          <Td>{formatDate(staff.createdAt)}</Td>
                          <Td>{staff.isCurrent ? 'Active' : 'Inactive'}</Td>
                          <Td>
                            <HStack>
                              {/* Delete branch icon */}
                              <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                aria-label="Delete branch"
                                onClick={() =>
                                  handleDeleteIconClick(staff.staffId?.id)
                                }
                              />

                              <Button
                                mt={4}
                                colorScheme="blue"
                                size="md"
                                onClick={() =>
                                  openTransferStaffModal(staff.staffId?.id)
                                }
                              >
                                Transfer
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  )}
                </Table>
              </TableContainer>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this staff?</ModalBody>
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

      {/* Transfer staff modal */}
      <TransferStaffModal
        isOpen={showTransferStaffModal}
        onClose={closeTransferModal}
        staffUser={staffUser}
        allBranch={allBranch}
        transferStaffToBranch={transferStaffToBranch}
      />

      {/* Modal for adding new staff */}
      <AddStaffModal
        isOpen={showCreateStaffModal}
        onClose={onClosestaffModal}
        users={users}
        allBranch={allBranch}
        addStaffToBranch={addStaffToBranch}
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
