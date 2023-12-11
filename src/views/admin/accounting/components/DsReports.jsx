// Chakra imports
import { Box, Spinner, Flex, Text, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { formatDate } from 'utils/helper';
import { formatNaira } from 'utils/helper';
import CustomTable from 'components/table/CustomTable';

export default function DsReports() {
  const [dsChargedPackages, setDsChargedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmountPerDay, setTotalAmountPerDay] = useState(0);

  const fetchDsChargedPackages = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/reports/packages/charged');

      setDsChargedPackages(response.data.chargedPackages);
      setTotalAmountPerDay(response.data.totalAmountPerDay);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDsChargedPackages();
  }, []);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.id}`}>
            {row.userId.firstName} {row.userId.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amountPerDay',
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.startDate),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
console.log(dsChargedPackages);
  return (
    <Box>
      <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
        <Flex>
          <Text fontSize="2xl">DS Income</Text>
          <Spacer />
          <Text fontSize="2xl" fontWeight="bold">
            {formatNaira(totalAmountPerDay)}
          </Text>
        </Flex>
        <Box marginTop="30">
          {loading ? (
            <Spinner />
          ) : dsChargedPackages && dsChargedPackages.length > 0 ? (
            <CustomTable
              columns={columns}
              data={dsChargedPackages}
            />
          ) : (
            <Text fontSize="lg" textAlign="center" mt="20">
              No records found!
            </Text>
          )}
        </Box>
      </Card>
    </Box>
  );
}
