/* eslint-disable */
import React from 'react';
import { useAuth } from 'contexts/AuthContext';

import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';

const hiddenRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/admin/user/create',
  '/admin/user/:id',
  '/admin/user/edit-user/:id',
  '/admin/branch/create',
  '/admin/branch/editbranch/:id',
  '/admin/branch/viewbranch/:id',
  '/admin/branch/viewstaff/:id',
  '/auth/sign-in',
  '/auth/sign-up',
  '/admin/user/create',
  '/admin/user/:id',
  '/admin/user/edit-user/:id',
  '/admin/customer/create',
  '/admin/customer/staffaccounts/:id',
  '/admin/branch/viewbranchcustomers/:branchId',
  '/admin/customer/create-account',
  '/admin/customer/:id',
  '/admin/customer/edit-customer/:id',
  '/admin/account/assign-manager',
  '/admin/transaction/deposit',
  '/admin/transaction/withdraw',
  '/admin/daily-savings',
  '/admin/daily-savings/deposit/:packageId',
  '/admin/daily-saving/package',
  '/admin/daily-savings/withdraw/:packageId',
  '/admin/customer/:id',
  '/admin/accounting/dashboard',
  '/admin/accounting/expenditure',
  '/admin/accounting/expenditure/:id',
];

export function SidebarLinks(props) {
  const { currentUser } = useAuth();

  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600'
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');
  ``;

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (hiddenRoutes.includes(route.layout + route.path)) {
        return null;
      }
      if (route.category) {
        return (
          <>
            <Text
              fontSize={'md'}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              pt="18px"
              pb="12px"
              key={index}
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl'
      ) {
        if (route.roles?.includes(currentUser.role)) {
          return (
            <NavLink key={index} to={route.layout + route.path}>
              {route.icon ? (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : textColor
                        }
                        me="18px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase())
                            ? 'bold'
                            : 'normal'
                        }
                      >
                        {route.name}
                      </Text>
                    </Flex>
                    <Box
                      h="36px"
                      w="4px"
                      bg={
                        activeRoute(route.path.toLowerCase())
                          ? brandColor
                          : 'transparent'
                      }
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? 'bold'
                          : 'normal'
                      }
                    >
                      {route.name}
                    </Text>
                    <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                  </HStack>
                </Box>
              )}
            </NavLink>
          );
        } else {
          return null;
        }
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
