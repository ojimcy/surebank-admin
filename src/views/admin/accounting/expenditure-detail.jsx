import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import axiosService from 'utils/axiosService';
import { formatNaira, formatDate } from 'utils/helper';

import BackButton from 'components/menu/BackButton';

const ExpenditureDetail = () => {
  const { id } = useParams();
  const [expenditure, setExpenditure] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const fetchExpenditure = async () => {
        setLoading(true);
        const response = await axiosService.get(
          `/accounting/expenditure/${id}`
        );
        setExpenditure(response.data);
      };
      fetchExpenditure();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching expenditure details.'
      );
    } finally {
      setLoading(false);
    }
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
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
          <BackButton />
          <Grid
            mb="20px"
            gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}
          >
            <Flex
              flexDirection="column"
              gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
            >
              <Center py={6}>
                <Box
                  w={{ base: '90%', md: '80%' }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                >
                  {expenditure && (
                    <Flex alignItems="center">
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">User Reps</Text>
                          <Text>
                            {expenditure.userReps?.firstName}{' '}
                            {expenditure.userReps?.lastName}
                          </Text>
                          <Text fontWeight="bold">Reason:</Text>
                          <Text>{expenditure.reason}</Text>
                          <Text fontWeight="bold">Date:</Text>
                          <Text>{formatDate(expenditure?.date)}</Text>
                          <Text fontWeight="bold">Amount:</Text>
                          <Text>{formatNaira(expenditure?.amount)}</Text>
                        </Grid>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ExpenditureDetail;
