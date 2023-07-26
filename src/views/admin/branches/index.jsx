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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Custom components

// Assets
import axiosService from "utils/axiosService";
import Card from "components/card/Card.js";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";

export default function Users() {
  const [branchs, setBranchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get("/branch/");
      setBranchs(response.data.results);
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

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axiosService.delete(`/branch/${userId}`);
      toast.success("User deleted successfully!");
      // After successful deletion, refetch the users to update the list
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
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
            <Text fontSize="2xl">Branchs</Text>
            <Spacer />
            <NavLink to="/admin/branch/create">
              <Button bgColor="blue.700" color="white">
                Create Branch
              </Button>
            </NavLink>
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
                      <Th>Branch Name </Th>
                      <Th>Address</Th>
                      <Th>Phone Number</Th>
                      <Th>Last Updated </Th>
                      <Th>Created Date </Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {branchs.map((branch) => (
                      <Tr key={branch.id}>
                        <Td>
                          <NavLink
                            to={`/admin/branch/${branch.id}`}
                          >{`${branch.name}`}</NavLink>{" "}
                        </Td>
                        <Td>{branch.address}</Td>
                        <Td>{branch.phone}</Td>
                        <Td>{formatDate(branch.updatedAt)}</Td>
                        <Td>{formatDate(branch.createdAt)}</Td>
                        <Td>
                          <HStack>
                            {/* Edit branch icon */}
                            <NavLink
                              to={`/admin/branch/edit-branch/${branch.id}`}
                            >
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
                              onClick={() => handleDeleteIconClick(branch.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            <HStack mt="4" justify="space-between" align="center">
              {branchs && (
                <Box>
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, branchs.length)} of{" "}
                  {branchs.length} entries
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
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
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

// import React, { useEffect, useState } from "react";
// import axiosService from "utils/axiosService";

// import {
//   Flex,
//   Spacer,
//   Box,
//   Text,
//   Link,
//   Button,
//   FormControl,
//   Input,
//   Table,
//   Thead,
//   Tbody,
//   Tfoot,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
//   Stack,
//   // Card,
// } from "@chakra-ui/react";
// // import NextLink from "next/link";
// import AdminLayout from "../../../layouts/admin";
// import { SearchIcon } from "@chakra-ui/icons";
// import Card from "components/card/Card.js";
// // import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
// import { toast } from "react-toastify";

// export default function Branches() {
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   const fetchBranches = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosService.get("/branch/");
//       console.log(response);
//       setBranches(response.data.results);
//       setTotalPages(response.data.totalPages);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchBranches(currentPage);
//   }, [currentPage]);

//   const handleNextPageClick = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPageClick = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <AdminLayout>
//       <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
//         <Card p={{ base: "30px", md: "30px", sm: "10px" }}>
//           <Flex>
//             <Text fontSize="2xl">Branches</Text>
//             <Spacer />
//             <Link href="/admin/branch/create">
//               <Button bgColor="blue.700" color="white">
//                 Create Branch
//               </Button>
//             </Link>
//           </Flex>
//           <Box marginTop="30">
//             <Flex>
//               <Spacer />
//               <Box>
//                 <Stack direction="row">
//                   <FormControl>
//                     <Input
//                       type="search"
//                       placeholder="Type a name"
//                       borderColor="black"
//                     />
//                   </FormControl>
//                   <Button bgColor="blue.700" color="white">
//                     <SearchIcon />
//                   </Button>
//                 </Stack>
//               </Box>
//             </Flex>
//           </Box>
//           <Box marginTop="30">
//             {branches && (
//               <TableContainer>
//                 <Table variant="simple" bordered>
//                   <Thead>
//                     <Tr>
//                       <Th>Branch Name</Th>
//                       <Th>Branch Address</Th>
//                     </Tr>
//                   </Thead>
//                   {branches.map((b) => (
//                     <Tbody>
//                       <Tr key={b._id} mr="50px">
//                         <Link href={`/admin/branch/${b._id}/branchdetail`}>
//                           <Td>{b.name}</Td>
//                         </Link>

//                         <Td>{b.address}</Td>
//                       </Tr>
//                     </Tbody>
//                   ))}
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>
//         </Card>
//       </Box>
//     </AdminLayout>
//   );
// }
