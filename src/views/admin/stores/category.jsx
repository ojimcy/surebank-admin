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

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import {
  DeleteIcon,
  EditIcon,
  SearchIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { toast } from 'react-toastify';

import CustomTable from 'components/table/CustomTable';
import CreateCategoryModal from 'components/modals/CreateCategoryModal';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import BackButton from 'components/menu/BackButton';

import { formatMdbDate } from 'utils/helper';

export default function Categories() {
  const [categories, setCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [createCategoryModal, setCreateCategoryModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/stores/categories?&limit=${pageSize}&page=${pageIndex + 1}`
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const handleDeleteIconClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      handleDeleteCollection(categoryToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleCreateCategoryModal = () => {
    setCreateCategoryModal(true);
  };

  const handleCloseCreateCategoryModal = () => {
    setCreateCategoryModal(false);
  };

  // Function to handle user deletion
  const handleDeleteCollection = async (categoryId) => {
    try {
      await axiosService.delete(`/stores/categories/${categoryId}`);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCreateCategory = async (data) => {
    try {
      await axiosService.post(`/stores/categories`, data);
      toast.success('Collection created successfully!');
      fetchCategories();
      handleCloseCreateCategoryModal();
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

  // Filter Users based on search term
  useEffect(() => {
    const filtered =
      categories &&
      categories?.filter((category) => {
        const title = `${category.title}`.toLowerCase();
        return title.includes(searchTerm.toLowerCase());
      });
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Slug',
        accessor: 'slug',
      },
      {
        Header: 'Created At',
        accessor: (row) => formatMdbDate(row.createdAt),
      },

      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {/* Edit category icon */}
            <NavLink to={`#`}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                mr={2}
                aria-label="Edit category"
              />
            </NavLink>
            {/* Delete category icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete category"
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
            <Text fontSize="2xl">Categories</Text>
            <Spacer />

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Category
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="#" onClick={handleCreateCategoryModal}>
                    New Category
                  </NavLink>
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
              <LoadingSpinner />
            ) : filteredCategories.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            ) : (
              filteredCategories && (
                <CustomTable
                  columns={columns}
                  data={filteredCategories}
                  onPageChange={onPageChange}
                />
              )
            )}
          </Box>
        </Card>
      </Grid>

      <CreateCategoryModal
        isOpen={createCategoryModal}
        onClose={handleCloseCreateCategoryModal}
        createCategory={handleCreateCategory}
        parentCategories={filteredCategories}
      />

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this category?</ModalBody>
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
