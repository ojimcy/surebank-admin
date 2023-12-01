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

import SimpleTable from 'components/table/SimpleTable';
import CreateCollectionModal from 'components/modals/CreateCollectionModal';
import AddProductToCollectionModal from 'components/modals/AddProductToCollectionModal';

import { formatDate } from 'utils/helper';

export default function Collections() {
  const [collections, setCollections] = useState(false);
  const [products, setProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollections, setFilteredCollections] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionsToDelete] = useState(null);

  const [createCollectionModal, setCreateCollectionModal] = useState(false);
  const [addProductToCollectionModal, setAddProductToCollectionModal] =
    useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/collections');
      setTotalResults(response.data.length);
      setCollections(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/products/catalogue');
      setProducts(response.data.results);
      setTotalResults(response.data.totalResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteIconClick = (collectionId) => {
    setCollectionsToDelete(collectionId);
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

  const handleCreateCollectionModal = () => {
    setCreateCollectionModal(true);
  };

  const handleCloseCreateCollectionModal = () => {
    setCreateCollectionModal(false);
  };
  const handleAddProductToCollectionModal = () => {
    setAddProductToCollectionModal(true);
  };

  const handleCloseAddProductToCollectionModal = () => {
    setAddProductToCollectionModal(false);
  };

  // Function to handle user deletion
  const handleDeleteCollection = async (collectionId) => {
    try {
      await axiosService.delete(`/collections/${collectionId}`);
      toast.success('Collection deleted successfully!');
      fetchCollections();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCreateCollection = async (data) => {
    try {
      await axiosService.post(`/collections`, data);
      toast.success('Collection created successfully!');
      fetchCollections();
      handleCloseCreateCollectionModal();
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

  const addProductToCollection = async (data) => {
    try {
      await axiosService.post(
        `/products/collections?productCatalogueId=${data.productCatalogueId}&collectionId=${data.collectionId}`
      );
      toast.success('Product added to collection successfully');
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
      collections &&
      collections?.filter((collection) => {
        const title = `${collection.title}`.toLowerCase();
        return title.includes(searchTerm.toLowerCase());
      });
    setFilteredCollections(filtered);
  }, [searchTerm, collections]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Slug',
        accessor: 'slug',
      },
      {
        Header: 'Created At',
        accessor: (row) => formatDate(row.createdAt),
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
          <Flex>
            <Text fontSize="2xl">Collections</Text>
            <Spacer />

            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Products
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="#" onClick={handleCreateCollectionModal}>
                    New Collection
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="#" onClick={handleAddProductToCollectionModal}>
                    Add Product to collection
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
              <Spinner />
            ) : (
              filteredCollections && (
                <SimpleTable
                  columns={columns}
                  data={filteredCollections}
                  pageSize={totalResults}
                  totalPages={totalResults}
                />
              )
            )}
          </Box>
        </Card>
      </Grid>

      <CreateCollectionModal
        isOpen={createCollectionModal}
        onClose={handleCloseCreateCollectionModal}
        createCollection={handleCreateCollection}
      />

      <AddProductToCollectionModal
        isOpen={addProductToCollectionModal}
        onClose={handleCloseAddProductToCollectionModal}
        addProductToCollection={addProductToCollection}
        collections={collections}
        products={products}
      />

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this collection?
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
