import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Icon,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export function SidebarLinks(props) {
  const [expandedCategories, setExpandedCategories] = useState([]);
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600'
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');
  const { isOpen, onToggle } = useDisclosure();

  const { routes } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

   const toggleCategory = (categoryName) => {
     setExpandedCategories((prevExpanded) => ({
       ...prevExpanded,
       [categoryName]: !prevExpanded[categoryName],
     }));
   };

   const isCategoryExpanded = (categoryName) => {
     return expandedCategories[categoryName];
   };


  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (hiddenRoutes.includes(route.layout + route.path)) {
        return null;
      }
      if (route.category) {
        const isExpanded = isCategoryExpanded(route.name);
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
              onClick={() => toggleCategory(route.name)} // Toggle the category visibility on click
              cursor="pointer"
            >
              {route.name}{' '}
              <Icon as={isExpanded ? FaChevronUp : FaChevronDown} />
            </Text>
            {isExpanded && createLinks(route.items)}
          </>
        );
      } else if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl'
      ) {
        if (route.subRoutes) {
          return (
            <Box key={index}>
              <Box d="inline-flex" alignItems="center">
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '6px'
                  }
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
                      color={textColor}
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
                      onClick={onToggle}
                    />
                  </Flex>
                </HStack>
              </Box>

              <Collapse in={isOpen}>
                <Box ml={2} fontSize="sm">
                  {route.subRoutes.map((subRoute, subIndex) => (
                    <NavLink
                      key={subIndex}
                    to={`${route.layout}${subRoute.path}`}
                    >
                      <Flex
                        alignItems="center"
                        p={2}
                      >
                        {subRoute.icon && (
                          <Box
                            as={subRoute.icon}
                            me="12px"
                            color={
                              activeRoute(
                                `${route.layout}${subRoute.path}`.toLowerCase()
                              )
                                ? activeIcon
                                : textColor
                            }
                          />
                        )}
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
                          ml="2rem"
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
        }
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
                      activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
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
      }
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
