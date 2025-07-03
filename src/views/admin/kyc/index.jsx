import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Stack,
  FormControl,
  Input,
  Select,
  Badge,
  IconButton,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FaEye, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Card from 'components/card/Card';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import BackButton from 'components/menu/BackButton';
import axiosService from 'utils/axiosService';
import { formatDate } from 'utils/helper';

function KYC() {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
  });
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [actionType, setActionType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // Fetch KYC requests
  const fetchKycRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await axiosService.get(`/kyc?${queryParams.toString()}`);
      setKycRequests(response.data.results || []);
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
      toast.error('Failed to fetch KYC requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRequests();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle KYC action (approve/reject)
  const handleKycAction = async () => {
    if (!selectedKyc || !actionType) return;

    if (actionType === 'rejected' && !remarks.trim()) {
      toast.error('Please provide remarks for rejection');
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosService.post(`/kyc/${selectedKyc.id}`, {
        status: actionType,
        remarks: remarks.trim(),
      });

      toast.success(`KYC request ${actionType} successfully`);
      fetchKycRequests();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating KYC:', error);
      toast.error(error.response?.data?.message || 'Failed to update KYC request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedKyc(null);
    setActionType('');
    setRemarks('');
    onClose();
  };

  // Open action modal
  const openActionModal = (kyc, action) => {
    setSelectedKyc(kyc);
    setActionType(action);
    onOpen();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get KYC type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'bvn':
        return 'blue';
      case 'id':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Table columns
  const columns = useMemo(() => [
    {
      Header: 'User',
      accessor: (row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold">{row.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {row.userId?.email || 'N/A'}
          </Text>
        </VStack>
      ),
    },
    {
      Header: 'Type',
      accessor: (row) => (
        <Badge colorScheme={getTypeColor(row.type)} variant="solid">
          {row.type?.toUpperCase()}
        </Badge>
      ),
    },
    {
      Header: 'Status',
      accessor: (row) => (
        <Badge colorScheme={getStatusColor(row.status)} variant="solid">
          {row.status?.toUpperCase()}
        </Badge>
      ),
    },
    {
      Header: 'Phone',
      accessor: 'phoneNumber',
    },
    {
      Header: 'Date of Birth',
      accessor: (row) => formatDate(row.dateOfBirth),
    },
    {
      Header: 'Submitted',
      accessor: (row) => formatDate(row.submittedAt),
    },
    {
      Header: 'Actions',
      accessor: (row) => (
        <HStack spacing={2}>
          <IconButton
            as={NavLink}
            to={`/admin/kyc/details/${row.id}`}
            icon={<FaEye />}
            size="sm"
            colorScheme="blue"
            variant="outline"
            aria-label="View details"
          />
          {row.status === 'pending' && (
            <>
              <IconButton
                icon={<FaCheck />}
                size="sm"
                colorScheme="green"
                variant="outline"
                aria-label="Approve"
                onClick={() => openActionModal(row, 'approved')}
              />
              <IconButton
                icon={<FaTimes />}
                size="sm"
                colorScheme="red"
                variant="outline"
                aria-label="Reject"
                onClick={() => openActionModal(row, 'rejected')}
              />
            </>
          )}
        </HStack>
      ),
    },
  ], []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />

      <Card mb="20px">
        <Flex direction="column" w="100%">
          <Flex justifyContent="space-between" alignItems="center" mb="20px">
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              KYC Requests Management
            </Text>
          </Flex>

          {/* Filters */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb="20px">
            <FormControl maxW="200px">
              <Select
                placeholder="Filter by Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </FormControl>

            <FormControl maxW="200px">
              <Select
                placeholder="Filter by Type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="bvn">BVN</option>
                <option value="id">ID Verification</option>
              </Select>
            </FormControl>

            <FormControl maxW="300px">
              <Input
                placeholder="Search by name, email, or phone"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FormControl>

            <Button
              leftIcon={<FaFilter />}
              colorScheme="blue"
              variant="outline"
              onClick={() => setFilters({ status: '', type: '', search: '' })}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Statistics */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb="20px">
            <Box bg="yellow.50" p={3} rounded="md" border="1px" borderColor="yellow.200">
              <Text fontSize="sm" color="yellow.800">
                Pending: {kycRequests.filter(k => k.status === 'pending').length}
              </Text>
            </Box>
            <Box bg="green.50" p={3} rounded="md" border="1px" borderColor="green.200">
              <Text fontSize="sm" color="green.800">
                Approved: {kycRequests.filter(k => k.status === 'approved').length}
              </Text>
            </Box>
            <Box bg="red.50" p={3} rounded="md" border="1px" borderColor="red.200">
              <Text fontSize="sm" color="red.800">
                Rejected: {kycRequests.filter(k => k.status === 'rejected').length}
              </Text>
            </Box>
          </Stack>

          {/* Table */}
          {kycRequests.length > 0 ? (
            <CustomTable columns={columns} data={kycRequests} />
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>No KYC requests found!</AlertTitle>
              <AlertDescription>
                There are no KYC requests matching your current filters.
              </AlertDescription>
            </Alert>
          )}
        </Flex>
      </Card>

      {/* Action Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === 'approved' ? 'Approve' : 'Reject'} KYC Request
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedKyc && (
              <VStack align="start" spacing={3}>
                <Text><strong>User:</strong> {selectedKyc.name}</Text>
                <Text><strong>Type:</strong> {selectedKyc.type?.toUpperCase()}</Text>
                <Text><strong>Phone:</strong> {selectedKyc.phoneNumber}</Text>

                {actionType === 'rejected' && (
                  <FormControl isRequired>
                    <Text mb={2} fontWeight="semibold">Reason for Rejection:</Text>
                    <Textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Please provide a reason for rejecting this KYC request..."
                      rows={4}
                    />
                  </FormControl>
                )}

                {actionType === 'approved' && (
                  <FormControl>
                    <Text mb={2} fontWeight="semibold">Remarks (Optional):</Text>
                    <Textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Any additional remarks..."
                      rows={3}
                    />
                  </FormControl>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              colorScheme={actionType === 'approved' ? 'green' : 'red'}
              onClick={handleKycAction}
              isLoading={isSubmitting}
              loadingText={actionType === 'approved' ? 'Approving...' : 'Rejecting...'}
            >
              {actionType === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default KYC;