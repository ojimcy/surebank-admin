import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Spinner, Stack, Text } from '@chakra-ui/react';

import { toast } from 'react-toastify';

import axiosService from 'utils/axiosService';
import { useAppContext } from 'contexts/AppContext';

import BackButton from 'components/menu/BackButton';

const AssignManager = () => {
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
        `/branch/${customerData.branchId}/staff`
      );
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAssignManager = async () => {
    if (!selectedManager) return;
    try {
      setAssigning(true);
      const data = { managerId: selectedManager };
      console.log(customerData.id);
      await axiosService.post(
        `/accounts/${customerData.id}/assign-manager`,
        data
      );
      toast.success(
        'The selected staff member has been assigned as the account manager.'
      );
      setAssigning(false);
      // Handle success or show a notification to the user
    } catch (error) {
      console.error(error);
      toast.error(
        'An error occurred while assigning the manager. Please try again later.'
      );
      setAssigning(false);
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
                  bg="gray.100"
                  borderRadius="md"
                >
                  <Text>
                    {staff.firstName} {staff.lastName}
                  </Text>
                  <Button
                    size="sm"
                    onClick={() => setSelectedManager(staff.id)}
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
