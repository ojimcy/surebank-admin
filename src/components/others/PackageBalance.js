import React, { useState } from 'react';
import {
  Flex,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { formatNaira } from 'utils/helper';

const PackageBalance = ({ customerData }) => {
  const [showBalance, setShowBalance] = useState(true);

  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex>
        {isMobile ? null : (
          <Avatar
            size="xl"
            name="SB"
            src={(customerData && customerData.avatarUrl) || ''}
            m={4}
          />
        )}
        <Flex flexDirection="column" justifyContent="center">
          <Flex alignItems="center" justifyContent="center">
            <Text fontSize="lg">
              Balance
              <Icon
                ml="2"
                fontSize="lg"
                _hover={{ cursor: 'pointer', color: 'blue.500' }}
                as={showBalance ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={() =>
                  setShowBalance((prevShowBalance) => !prevShowBalance)
                }
              />
            </Text>
          </Flex>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
            {customerData && customerData?.availableBalance && showBalance
              ? formatNaira(customerData.availableBalance)
              : '****'}
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Withdraw
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NavLink to="/admin/transaction/withdraw">Withdraw Cash</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/transaction/bank-transfer">
                Bank Transfer
              </NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default PackageBalance;
