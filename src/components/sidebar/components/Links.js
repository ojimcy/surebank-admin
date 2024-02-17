/* eslint-disable */
import React from 'react';
import { useAuth } from 'contexts/AuthContext';

import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

const hiddenRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/admin/user/create',
  '/admin/user/:id',
  '/admin/profile/reset-password',
  '/admin/user/edit-user/:id',
  '/admin/branch/create',
  '/admin/branch/editbranch/:id',
  '/admin/branch/viewbranch/:id',
  '/admin/branch/viewstaff/:id',
  '/auth/sign-in',
  '/auth/sign-up',
  '/admin/user/:id',
  '/admin/user/edit-user/:id',
  '/admin/customer/create',
  '/admin/customer/staffaccounts/:id',
  '/admin/branch/viewbranchcustomers/:branchId',
  '/admin/customer/create-account',
  '/admin/customer/ds/:id',
  '/admin/customer/sb/:id',
  '/admin/customer/edit-customer/:id',
  '/admin/account/assign-manager',
  '/admin/transaction/deposit',
  '/admin/transaction/bank-transfer',
  '/admin/transaction/withdraw',
  '/admin/transaction/withdraw/:requestId',
  '/admin/daily-savings',
  '/admin/daily-savings/deposit/:packageId',
  '/admin/daily-saving/package',
  '/admin/daily-savings/withdraw/:packageId',
  '/admin/customer/:id',
  '/admin/accounting/dashboard',
  '/admin/accounting/expenditure',
  '/admin/accounting/expenditure/:id',
  '/admin/products/catalogue-details/:id',
  '/admin/products/catalogue/create',
  '/admin/products/requests',
  '/admin/products/sb-products',
  '/admin/products/catalogue/edit/:id',
  '/admin/branch/staff/:id',
  '/admin/stores/collections',
  '/admin/stores/categories',
  '/admin/stores/brands',
  '/admin/orders/placeorder',
  '/admin/orders/:id',
  '/admin/branch/dashboard/:id'
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
  const secondaryColor = 'gray.500';
  const { isOpen, onToggle } = useDisclosure();

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
      if (route.subRoutes) {
        return (
          <Box key={index}>
            <Box d="inline-flex" alignItems="center">
              <HStack
                spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '6px'}
                py="5px"
                ps="10px"
              >
                <Flex alignItems="center" justifyContent="center">
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
                    fontSize="sm"
                    color={activeColor}
                    fontWeight="bold"
                    letterSpacing="wide"
                    py="6px"
                    pr="10px"
                    cursor="pointer"
                    _hover={{ color: textColor }}
                    onClick={onToggle}
                  >
                    {route.name}
                  </Text>
                  <FaChevronDown
                    cursor="pointer"
                    color={textColor}
                    _hover={{ color: secondaryColor }}
                    onClick={onToggle}
                  />
                </Flex>
              </HStack>
            </Box>

            <Collapse in={isOpen}>
              <Box ml={2} fontSize="sm">
                {route.subRoutes.map((subRoute, subIndex) => (
                  <NavLink key={subIndex} to={route.layout + subRoute.path}>
                    <Flex
                      alignItems="center"
                      p={2}
                      _hover={{ bg: secondaryColor }}
                    >
                      <Text
                        color={
                          activeRoute(
                            `${route.layout}${subRoute.path}`.toLowerCase()
                          )
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(
                            `${route.layout}${subRoute.path}`.toLowerCase()
                          )
                            ? 'bold'
                            : 'normal'
                        }
                      >
                        {subRoute.name}
                      </Text>
                    </Flex>
                  </NavLink>
                ))}
              </Box>
            </Collapse>
          </Box>
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
