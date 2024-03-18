import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Flex,
  Spacer,
  Stack,
  FormControl,
  Input,
  Select,
  Text,
  IconButton,
} from '@chakra-ui/react';

import { useAuth } from 'contexts/AuthContext';
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import { toast } from 'react-toastify';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { formatDate, getStartDate, getEndDate } from 'utils/helper';
import CreateNoteModal from 'components/modals/CreateNoteModal';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import EditNoteModal from 'components/modals/EditNoteModal';

export default function Note() {
  const { currentUser } = useAuth();
  const [note, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [staffInfo, setStaffInfo] = useState({});
  const isMounted = useRef(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    isMounted.current = true;

    const fetchStaffAndNote = async () => {
      try {
        const getStaff = await axiosService.get(
          `/staff/user/${currentUser.id}`
        );

        if (isMounted.current) {
          setStaffInfo(getStaff.data);
          await fetchNote(getStaff.data);
        }
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a toast)
        toast.error('Failed to fetch staff information');
      }
    };

    fetchStaffAndNote();

    return () => {
      // Cleanup function to set the isMounted flag to false when the component unmounts
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchNote = async (staffData) => {
    setLoading(true);

    try {
      const endpoint = constructApiEndpoint(staffData);
      const response = await axiosService.get(endpoint);

      const convertedNote = response.data.results.map((note) => ({
        ...note,
        date: new Date(note.date).getTime(),
      }));

      setNote(convertedNote);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast)
      toast.error('Failed to fetch note');
    }
  };

  const constructApiEndpoint = (staffData) => {
    const { pageIndex, pageSize } = pagination;
    let endpoint = `/note-keeping`;

    // Default parameters
    const params = {
      limit: pageSize,
      page: pageIndex + 1,
    };

    // Add date range parameters based on timeRange
    if (timeRange === 'last7days') {
      Object.assign(params, getStartDate(7));
    } else if (timeRange === 'last30days') {
      Object.assign(params, getEndDate(30));
    }

    // Construct endpoint with parameters
    endpoint += `?${new URLSearchParams(params)}`;

    return endpoint;
  };

  const handleOpenNoteModal = () => {
    setShowNoteModal(true);
  };

  const handleNoteModalClosed = () => {
    setShowNoteModal(false);
  };

  // Function to handle "Edit" button click
  const handleEditNote = (noteData) => {
    setSelectedNote(noteData);
    setShowEditNoteModal(true);
  };

  const handleEditNoteModalClosed = () => {
    setShowEditNoteModal(false);
    fetchNote(staffInfo);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleCreateNote = async (noteData) => {
    try {
      await axiosService.post('/note-keeping', noteData);
      toast.success('Note successfully created');
      handleNoteModalClosed();
      await fetchNote(staffInfo);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating note.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axiosService.delete(`/note-keeping/${noteId}`);
        toast.success('Note deleted successfully');
        // Refetch notes after deletion
        await fetchNote();
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting note.');
      }
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Note',
        accessor: 'note',
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
      },

      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {/* Edit icon */}
            <IconButton
              icon={<EditIcon />}
              colorScheme="blue"
              aria-label="Edit Note"
              onClick={() => handleEditNote(row)}
            />
            {/* Delete icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete Note"
              style={{ marginLeft: '10px' }}
              onClick={() => handleDeleteNote(row.id)} // Pass the note ID to the delete function
            />
          </>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
          <Flex justifyContent="space-between" mb="20px">
            <BackButton />
            <div>
              <Button
                bgColor="blue.700"
                color="white"
                borderRadius="5px"
                mr={4}
                onClick={handleOpenNoteModal}
              >
                New Note
              </Button>
            </div>
          </Flex>
          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
                  <Select value={timeRange} onChange={handleTimeRangeChange}>
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                  </Select>
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search"
                      borderColor="black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Box>
            </Flex>
          </Box>
          <Box marginTop="30">
            {loading ? (
              <LoadingSpinner />
            ) : note.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            ) : (
              <CustomTable
                columns={columns}
                data={note}
                onPageChange={setPagination}
              />
            )}
          </Box>
        </Card>
      </Grid>

      <CreateNoteModal
        isOpen={showNoteModal}
        onClose={handleNoteModalClosed}
        onSubmit={handleCreateNote}
      />

      <EditNoteModal
        isOpen={showEditNoteModal}
        onClose={handleEditNoteModalClosed}
        selectedNote={selectedNote}
      />
    </Box>
  );
}
