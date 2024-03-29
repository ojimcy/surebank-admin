import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Flex, Spinner, Stack, Text } from '@chakra-ui/react';

import { toast } from 'react-toastify';

import axiosService from 'utils/axiosService';
import { useAppContext } from 'contexts/AppContext';

import BackButton from 'components/menu/BackButton';

const AssignManager = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const { customerData } = useAppContext();

  useEffect(() => {
    fetchStaffInBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerData]);
  const fetchStaffInBranch = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(
        `/staff/${customerData.branchId._id}`
      );
      setStaffList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAssignManager = async () => {
    if (!selectedManager) return;
    try {
      setAssigning(true);
      const data = { managerId: selectedManager };
      await axiosService.post(
        `/accounts/${customerData._id}/assign-manager`,
        data
      );
      toast.success(
        'The selected staff member has been assigned as the account manager.'
      );
      setAssigning(false);
      history.goBack();
      // Handle success or show a notification to the user
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while assigning the manager. Please try again later.'
      );
      setAssigning(false);
    }
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="space-between" mb="20px">
        <BackButton />
      </Flex>
      <Box p="4">
        {loading ? (
          <Spinner />
        ) : (
          <Stack spacing="4">
            <Text fontWeight="bold" fontSize="xl" mb="2">
              Staff:
            </Text>
            {staffList.length === 0 ? (
              <Text>No staff found in this branch.</Text>
            ) : (
              staffList.map((staff) => (
                <Flex
                  key={staff.id}
                  justifyContent="space-between"
                  alignItems="center"
                  p="4"
                  borderRadius="md"
                >
                  <Text>
                    {staff.staffId?.firstName} {staff.staffId?.lastName}
                  </Text>
                  <Button
                    size="sm"
                    onClick={() => setSelectedManager(staff.staffId?.id)}
                    disabled={assigning}
                  >
                    {assigning ? 'Assigning...' : 'Make Manager'}
                  </Button>
                </Flex>
              ))
            )}
          </Stack>
        )}
      </Box>
      <Button
        mt="4"
        colorScheme="blue"
        variant="outline"
        size="sm"
        onClick={handleAssignManager}
        disabled={!selectedManager || assigning}
      >
        Assign Selected Manager
      </Button>
    </Box>
  );
};

export default AssignManager;
