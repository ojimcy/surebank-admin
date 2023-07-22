// Chakra imports
import { Box, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/users/components/Banner';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import React from 'react';
import { useAuth } from 'contexts/AuthContext';

export default function User() {
  const { currentUser } = useAuth();
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name={`${currentUser.firstName} ${currentUser.lastName}`}
          job={currentUser.role}
          posts="17"
          followers="9.7k"
          following="274"
          currentUser={currentUser}
        />
      </Grid>
    </Box>
  );
}
