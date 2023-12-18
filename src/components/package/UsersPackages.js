import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Spacer,
} from '@chakra-ui/react';
import PackageCard from 'components/package/PackageCard';
import CreateAccountModal from 'components/modals/CreateAccountModal';
import { useAppContext } from 'contexts/AppContext';

import { NavLink, useParams } from 'react-router-dom';

import axiosService from 'utils/axiosService';

const UsersPackages = ({ handleTransferSuccess, handleDepositSuccess }) => {
  const { id } = useParams();
  const { customerData } = useAppContext();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [userPackages, setUserPackages] = useState([]);

  const handleShowAccountModal = useCallback(() => {
    setShowAccountModal(true);
  }, []);

  const closeAccountModal = useCallback(() => {
    setShowAccountModal(false);
  }, []);

  useEffect(() => {
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

    fetchPackages();
  }, [id]);

  const handleCreateAccountClick = useCallback(() => {
    handleShowAccountModal();
  }, [handleShowAccountModal]);

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
        {!customerData ? (
          <Button
            bgColor="blue.700"
            color="white"
            onClick={handleCreateAccountClick}
          >
            Create Account
          </Button>
        ) : (
          <NavLink to="/admin/daily-saving/package">
            <Button bgColor="blue.700" color="white">
              Create Package
            </Button>
          </NavLink>
        )}
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
    </>
  );
};

export default UsersPackages;
