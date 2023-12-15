import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  useColorModeValue,
  // Button,
} from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import BackButton from 'components/menu/BackButton';
import DsReports from './components/DsReports';
import SbReports from './components/sbReports';

export default function Accounting() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);

  const netBal = totalIncome - totalExpenditure;

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const response = await axiosService.get(
          '/reports/contribution-incomes/supperadmin'
        );
        setTotalIncome(response.data.totalCharge);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching total income.'
        );
      }
    };
    fetchTotalIncome();
  }, []);

  useEffect(() => {
    const fetchTotalExpenditure = async () => {
      try {
        const response = await axiosService.get('accounting/expenditure/total');
        setTotalExpenditure(response.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching total expenditure.'
        );
      }
    };
    fetchTotalExpenditure();
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex>
        <BackButton />
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3, '2xl': 3 }}
        gap="20px"
        mb="20px"
        mt="40px"
      >
        {/* Use the fetched total contributions data */}
        <NavLink to="/admin/accounting/expenditure">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name="Total Income"
            value={formatNaira(totalIncome)}
          />
        </NavLink>

        <NavLink to="/admin/accounting/expenditure">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name="Total Expenditure"
            value={formatNaira(totalExpenditure)}
          />
        </NavLink>

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Net Balance"
          value={formatNaira(netBal)}
        />
      </SimpleGrid>
      <Tabs colorScheme="blue" mt="2rem">
        <TabList>
          <Tab>DS Report</Tab>
          <Tab>SB Report</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DsReports />
          </TabPanel>
          <TabPanel>
            <SbReports />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
