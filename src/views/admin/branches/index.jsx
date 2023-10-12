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
import { NavLink } from 'react-router-dom';

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';

import SimpleTable from 'components/table/SimpleTable';
import { useAppContext } from 'contexts/AppContext';

export default function Users() {
  const { branches, setBranches } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/branch/');
      setBranches(response.data.results);
      setTotalResults(response.data.totalResults);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteIconClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteBranch(userToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to handle user deletion
  const handleDeleteBranch = async (branchId) => {
    try {
      await axiosService.delete(`/branch/${branchId}`);
      await axiosService.delete(`/branch/${branchId}/deletestaffbranch`);
      toast.success('Branch deleted successfully!');
      // After successful deletion, refetch the users to update the list
      fetchBranches();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  // Filter Users based on search term
  useEffect(() => {
    const filtered = branches?.filter((branch) => {
      const name = `${branch.name}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Branch Name',
        accessor: (row) => (
          <NavLink to={`/admin/branch/viewbranch/${row.id}`}>
            {row.name}
          </NavLink>
        ),
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Manager',
        accessor: 'manager',
      },

      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {/* Edit branch icon */}
            <NavLink to={`/admin/branch/editbranch/${row.id}`}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                mr={2}
                aria-label="Edit branch"
              />
            </NavLink>
            {/* Delete branch icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete branch"
              onClick={() => handleDeleteIconClick(row.id)}
            />
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Flex>
            <Text fontSize="2xl">Branches</Text>
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
                data={filteredBranches}
                pageSize={totalResults}
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
          <ModalHeader>Delete Branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this branch?</ModalBody>
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
