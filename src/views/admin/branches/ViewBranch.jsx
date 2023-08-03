import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

// Chakra imports
import {
  Box,
  Grid,
  Button,
  Center,
  Avatar,
  Spinner,
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

// Custom components

// Assets
import axiosService from "utils/axiosService";
import BackButton from "components/menu/BackButton";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

export default function User() {
  const history = useHistory();

  const [users, setUsers] = useState([]);

  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);

  const handleAddStaffToBranch = () => {
    setShowCreateStaffModal(true);
  };

  const onCloseModal = () => {
    setShowCreateStaffModal(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get("/users/");
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const addStaffToBranch = async (data) => {
    try {
      await axiosService.post(`branch/${id}/staff`, data);
      toast.success("Staff has been created successfully!");
      history.push(`/admin/branch/viewstaff/${id}`);
    } catch (error) {
      if (error.response.data.message) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  useEffect(() => {
    const fetchbranch = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(`branch/${id}`);
        setBranch(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchbranch();
  }, [id]);

  return (
    <Box>
      {loading ? (
        <Box
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
          <BackButton />
          <Grid
            mb="20px"
            gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
            gap={{ base: "20px", xl: "20px" }}
            display={{ base: "block", xl: "grid" }}
          >
            <Flex
              flexDirection="column"
              gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
            >
              <Center py={6}>
                <Box
                  w={{ base: "90%", md: "80%" }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                >
                  {branch && (
                    <Flex alignItems="center">
                      <Avatar
                        size="xl"
                        name={branch.name || ""}
                        src={branch.avatarUrl || ""}
                        m={4}
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">Branch Name</Text>
                          <Text>{branch.name}</Text>
                          <Text fontWeight="bold">Email:</Text>
                          <Text>{branch.email}</Text>
                          <Text fontWeight="bold">Phone Number:</Text>
                          <Text>{branch.phone}</Text>
                          <Text fontWeight="bold">Address:</Text>
                          <Text>{branch.address}</Text>
                          <Text fontWeight="bold">Manager:</Text>
                          <Text>{branch.manager}</Text>
                        </Grid>
                        <Stack spacing={4} direction="row" align="center">
                          <NavLink to={`/admin/branch/editbranch/${id}`}>
                            <Button mt={4} colorScheme="blue" size="xs">
                              Edit Branch
                            </Button>
                          </NavLink>
                          <NavLink to={`/admin/branch/viewstaff/${id}`}>
                            <Button mt={4} colorScheme="blue" size="xs">
                              View Staff
                            </Button>
                          </NavLink>
                          <Button
                            mt={4}
                            colorScheme="blue"
                            size="xs"
                            onClick={() => handleAddStaffToBranch(users.id)}
                          >
                            Create Staff
                          </Button>
                        </Stack>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
          {/* Modal for adding new staff */}
          <Modal isOpen={showCreateStaffModal} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Assign staff to branch</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel color={isError ? "red" : "green"}>
                  {message}
                </FormLabel>{" "}
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
                            Staff Name<Text>*</Text>
                          </FormLabel>

                          <Select
                            {...register("staffId")}
                            name="staffId"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select a staff
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
      )}
    </Box>
  );
}
