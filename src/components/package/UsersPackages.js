import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import PackageCard from 'components/package/PackageCard';
import CreateAccountModal from 'components/modals/CreateAccountModal';
import { useAppContext } from 'contexts/AppContext';
import ChargeModal from 'components/modals/DsChargeModal';

import { NavLink, useParams } from 'react-router-dom';

import axiosService from 'utils/axiosService';
import { ChevronDownIcon } from '@chakra-ui/icons';

const UsersPackages = ({ handleTransferSuccess, handleDepositSuccess, handleEditSuccess }) => {
  const { id } = useParams();
  const { customerData } = useAppContext();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [userPackages, setUserPackages] = useState([]);
  const [showChargeModal, setShowChargeModal] = useState(false);

  const handleShowAccountModal = useCallback(() => {
    setShowAccountModal(true);
  }, []);

  const closeAccountModal = useCallback(() => {
    setShowAccountModal(false);
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axiosService.get(
        `daily-savings/package?userId=${id}`
      );
      setUserPackages(response.data);
    } catch (error) {
      // Handle error
    } finally {
    }
  };
  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateAccountClick = useCallback(() => {
    handleShowAccountModal();
  }, [handleShowAccountModal]);

  const handleShowChargeModal = () => {
    setShowChargeModal(true);
  };

  const closeChargeModal = () => {
    setShowChargeModal(false);
    fetchPackages();
  };

  return (
    <>
      <Flex alignItems="center">
        <Flex flexDirection="column">
          <Text fontWeight="bold" fontSize="xl" mt="10px" color={textColor}>
            Packages
          </Text>
          <Text fontSize="sm" color={textColorSecondary} pb="20px">
            Lists of user's packages
          </Text>
        </Flex>

        <Spacer />
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Manage Account
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NavLink to="/admin/account/assign-manager">
                Assign Account Manager
              </NavLink>
            </MenuItem>

            <MenuItem>
              {!customerData ? (
                <NavLink to="#" onClick={handleCreateAccountClick}>
                  Create Account
                </NavLink>
              ) : (
                <NavLink to="/admin/daily-saving/package">
                  Create Package
                </NavLink>
              )}
            </MenuItem>
            <MenuItem>
              <NavLink to="#" onClick={handleShowChargeModal}>
                Record charge
              </NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <hr color={textColor} />

      {userPackages.length !== 0 ? (
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          gap={2}
          mt="20px"
        >
          {userPackages?.map((packageData, index) => (
            <PackageCard
              key={index}
              packageData={packageData}
              handleTransferSuccess={handleTransferSuccess}
              handleDepositSuccess={handleDepositSuccess}
              handleEditSuccess={handleEditSuccess}
            />
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center" mt="4">
          {customerData ? (
            <Button color="green" as={NavLink} to="/admin/daily-saving/package">
              No Package Found, Create One
            </Button>
          ) : (
            <Button color="green" onClick={handleCreateAccountClick}>
              No Account Found, Create an account and a new package.
            </Button>
          )}
        </Flex>
      )}

      <CreateAccountModal
        isOpen={showAccountModal}
        onClose={closeAccountModal}
      />

      <ChargeModal
        isOpen={showChargeModal}
        onClose={closeChargeModal}
        packages={userPackages}
      />
    </>
  );
};

export default UsersPackages;
