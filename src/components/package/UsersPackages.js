import React from 'react';
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Spacer,
} from '@chakra-ui/react';
import PackageCard from 'components/package/PackageCard';

import { NavLink } from 'react-router-dom';

const UsersPackages = ({ userPackages }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

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
        <NavLink to="/admin/daily-saving/package">
          <Button bgColor="blue.700" color="white">
            Create Package
          </Button>
        </NavLink>
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
            <PackageCard key={index} packageData={packageData} />
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center" mt="4">
          <Button color="green" as={NavLink} to="/admin/daily-saving/package">
            No Package Found, Create One
          </Button>
        </Flex>
      )}
    </>
  );
};

export default UsersPackages;
