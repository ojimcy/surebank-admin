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
  FormLabel,
  Select,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

// Custom components

// Assets
import axiosService from "utils/axiosService";
import Card from "components/card/Card.js";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";

export default function Users() {
  const history = useHistory();
  const [staffs, setStaffs] = useState([]);
  const [users, setUsers] = useState([]);
  const [branch, setBranch] = useState([]);
  const [staffUser, setStaffUser] = useState("");
  const [allBranch, setAllBranch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { id } = useParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferStaffModal, setShowTransferStaffModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const branches = await axiosService.get("/branch/");
      const response = await axiosService.get(`/branch/staff`);
      const UserResponse = await axiosService.get("/users/");
      setUsers(UserResponse.data.results);
      // const currentBranch = await axiosService.get(`branch/${id}`);
      setAllBranch(branches.data.results);
      // setBranch(currentBranch.data);
      setStaffs(response.data);
      // console.log(response);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
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

  // Function to handle user deletion
  const handleDeleteUser = async (staffId) => {
    try {
      await axiosService.delete(`/branch/${staffId}/staff`);
      toast.success("Staff deleted successfully!");
      // After successful deletion, refetch the users to update the list
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const transferStaffToBranch = async (data) => {
    try {
      // const branchId = data.branchId;
      // console.log(data);

      await axiosService.patch(`/branch/staff`, data);
      toast.success("Staff transfered successfully!");
      // setBranch(response.data);
      // history.push(`/admin/user/${id}`);
      history.push(`/admin/branches`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleAddStaffToBranch = () => {
    setShowCreateStaffModal(true);
  };
  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors, isSubmitting },
  // } = useForm();

  const addStaffToBranch = async (data) => {
    try {
      console.log(data);
      const id = data.branchId;
      await axiosService.post(`branch/staff`, data);
      toast.success("Staff has been created successfully!");
      history.push(`/admin/branch/viewstaff/${id}`);
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
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const onClosestaffModal = () => {
    setShowCreateStaffModal(false);
  };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "3.96fr",
        }}
        templateRows={{
          base: "repeat(1, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Card p={{ base: "30px", md: "30px", sm: "10px" }}>
          <Flex>
            <Text fontSize="2xl">All Staff</Text>
            <Spacer />
            {/* <NavLink to="/admin/branch/create">
              <Button bgColor="blue.700" color="white">
                Create Branch
              </Button>
            </NavLink> */}
          </Flex>
          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
                  <Flex>
                    <Spacer />
                    <Button
                      bgColor="blue.700"
                      color="white"
                      onClick={handleAddStaffToBranch}
                    >
                      Create Staff
                    </Button>
                  </Flex>

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
                      <Th>Phone Number</Th>
                      <Th>Last Updated </Th>
                      <Th>Created Date </Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {staffs?.map((staff) => (
                      <Tr key={staff.id}>
                        <Td>
                          <NavLink
                            to={`/admin/user/${staff.id}`}
                          >{`${staff.firstName} ${staff.lastName}`}</NavLink>{" "}
                        </Td>
                        <Td>{staff.phoneNumber}</Td>
                        <Td>{formatDate(staff.updatedAt)}</Td>
                        <Td>{formatDate(staff.createdAt)}</Td>
                        <Td>
                          <HStack>
                            {/* Edit staff icon */}
                            <NavLink to={`/admin/user/edit-user/${staff.id}`}>
                              <IconButton
                                icon={<EditIcon />}
                                colorScheme="blue"
                                aria-label="Edit branch"
                              />
                            </NavLink>
                            {/* Delete branch icon */}
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              aria-label="Delete branch"
                              onClick={() => handleDeleteIconClick(staff.id)}
                            />

                            <Button
                              mt={4}
                              colorScheme="blue"
                              size="md"
                              onClick={() => openTransferStaffModal(staff.id)}
                            >
                              Transfer
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            <HStack mt="4" justify="space-between" align="center">
              {staffs && (
                <Box>
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, staffs.length)} of {staffs.length}{" "}
                  entries
                </Box>
              )}
              <HStack>
                <Button
                  disabled={currentPage === 1}
                  onClick={handlePreviousPageClick}
                >
                  Previous Page
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={handleNextPageClick}
                >
                  Next Page
                </Button>
              </HStack>
            </HStack>
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
      <Modal isOpen={showTransferStaffModal} onClose={closeTransferModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <FormLabel color={isError ? "red" : "green"}>{message}</FormLabel>{" "} */}
            <Box>
              {/* <Card p={{ base: "30px", md: "30px", sm: "10px" }}> */}
              <form onSubmit={handleSubmit(transferStaffToBranch)}>
                <Flex
                  gap="20px"
                  marginBottom="20px"
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <Box width={{ base: "100%", md: "100%", sm: "100%" }}>
                    <FormControl>
                      <FormLabel pt={3}>
                        {staffUser?.firstName}
                        &ensp;&ensp;
                        {staffUser?.lastName}
                      </FormLabel>
                    </FormControl>
                    &ensp;&ensp;
                    <FormControl>
                      <Input
                        type="hidden"
                        {...register("staffId")}
                        value={staffUser?.id}
                      />
                    </FormControl>
                    <FormControl isInvalid={errors.branch}>
                      <Select
                        {...register("branchId")}
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
                  // isLoading={}
                >
                  Save
                </Button>
                {/* </Flex> */}
              </form>
              {/* </Card> */}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for adding new staff */}

      <Modal isOpen={showCreateStaffModal} onClose={onClosestaffModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <FormLabel color={isError ? "red" : "green"}>{message}</FormLabel>{" "} */}
            <Box>
              {/* <Card p={{ base: "30px", md: "30px", sm: "10px" }}> */}
              <form onSubmit={handleSubmit(addStaffToBranch)}>
                <Flex
                  gap="20px"
                  marginBottom="20px"
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <Box width={{ base: "100%", md: "100%", sm: "100%" }}>
                    <FormControl isInvalid={errors.branch}>
                      <FormLabel
                        htmlFor="address"
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        mb="8px"
                      >
                        User Name<Text>*</Text>
                      </FormLabel>

                      <Select
                        {...register("staffId")}
                        name="staffId"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a user
                        </option>
                        {users &&
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                              &ensp;&ensp;
                              {user.phoneNumber}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <FormControl isInvalid={errors.branch}>
                      <FormLabel
                        htmlFor="address"
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        mb="8px"
                      >
                        Branch Name<Text>*</Text>
                      </FormLabel>

                      <Select
                        {...register("branchId")}
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
                  Save
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
