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
import CreateBrandModal from 'components/modals/CreateBrandModal';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import BackButton from 'components/menu/BackButton';

import { formatMdbDate } from 'utils/helper';

export default function Collections() {
  const [brands, setBrands] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setBrandToDelete] = useState(null);

  const [createBrandModal, setCreateBrandModal] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchBrands = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/store/brands?&limit=${pageSize}&page=${pageIndex + 1}`
      );
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const handleDeleteIconClick = (collectionId) => {
    setBrandToDelete(collectionId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (collectionToDelete) {
      handleDeleteCollection(collectionToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleCreateBrandModal = () => {
    setCreateBrandModal(true);
  };

  const handleCloseCreateBrandModal = () => {
    setCreateBrandModal(false);
  };
  
  // Function to handle user deletion
  const handleDeleteCollection = async (brandId) => {
    try {
      await axiosService.delete(`/store/brands/${brandId}`);
      toast.success('Brand deleted successfully!');
      fetchBrands();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCreateCollection = async (data) => {
    try {
      await axiosService.post(`/store/brands`, data);
      toast.success('Collection created successfully!');
      fetchBrands();
      handleCloseCreateBrandModal();
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
      brands &&
      brands?.filter((brand) => {
        const name = `${brand.name}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      });
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Created At',
        accessor: (row) => formatMdbDate(row.createdAt),
      },

      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {/* Edit collection icon */}
            <NavLink to={`#`}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                mr={2}
                aria-label="Edit collection"
              />
            </NavLink>
            {/* Delete collection icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete collection"
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
          <BackButton />
          <Flex>
            <Text fontSize="2xl">Brands</Text>
            <Spacer />

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Brands
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="#" onClick={handleCreateBrandModal}>
                    New Brand
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
            ) : (
              filteredBrands && (
                <CustomTable
                  columns={columns}
                  data={filteredBrands}
                  onPageChange={onPageChange}
                />
              )
            )}
          </Box>
        </Card>
      </Grid>

      <CreateBrandModal
        isOpen={createBrandModal}
        onClose={handleCloseCreateBrandModal}
        createCollection={handleCreateCollection}
      />

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Brand</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this brand?
          </ModalBody>
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
