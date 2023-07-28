import React from 'react';
import { Button, Icon, Box } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export const CustomButton = ({
  colorScheme,
  textColor,
  size,
  icon,
  name,
  to,
  ...props
}) => {
  return (
    <NavLink to={to}>
      <Button
        borderRadius="none"
        size="md"
        boxShadow="md"
        _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
        m="10px"
      >
        <Box
          display="inline-block"
          bg="rgb(64, 25, 109)"
          borderRadius="full"
          mr={2}
          w="20px"
          h="20px"
        >
          <Icon as={icon} w={4} h={3} color="white" />
        </Box>
        {name}
      </Button>
    </NavLink>
  );
};
