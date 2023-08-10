import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Box, Icon } from '@chakra-ui/react';

const ActionButton = ({ to, icon, label }) => {
  return (
    <NavLink to={to}>
      <Button
        borderRadius="none"
        size="md"
        boxShadow="md"
        _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
        p="40px"
        m="5"
        minWidth="200px"
        flexDirection="column"
        square
      >
        <Box
          display="inline-block"
          bg="rgb(64, 25, 109)"
          borderRadius="full"
          mr={2}
          mb={3}
          w="20px"
          h="20px"
        >
          <Icon as={icon} w={4} h={3} color="white" />
        </Box>
        {label}
      </Button>
    </NavLink>
  );
};

export default ActionButton;
