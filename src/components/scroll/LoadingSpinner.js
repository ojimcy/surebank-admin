import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

function LoadingSpinner() {
  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.500" />
    </Box>
  );
}

export default LoadingSpinner;
