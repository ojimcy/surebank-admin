import React from 'react';
import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { HamburgerIcon } from '@chakra-ui/icons';
import LandingPage from 'views/landing';
import logo from '../../assets/img/logo.webp';

const HomeLayout = () => {
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Navigation Links Component
  const NavLinks = ({ isMobile = false, onClose }) => {
    const Component = isMobile ? VStack : HStack;
    return (
      <Component
        spacing={isMobile ? 4 : 8}
        align={isMobile ? 'stretch' : 'center'}
      >
        <NavLink to="/" onClick={isMobile ? onClose : undefined}>
          <Button variant="ghost" w={isMobile ? 'full' : 'auto'}>
            Home
          </Button>
        </NavLink>
        <NavLink to="/about" onClick={isMobile ? onClose : undefined}>
          <Button variant="ghost" w={isMobile ? 'full' : 'auto'}>
            About
          </Button>
        </NavLink>
        <NavLink
          to="https://wa.me/2348031313024"
          onClick={isMobile ? onClose : undefined}
        >
          <Button variant="ghost" w={isMobile ? 'full' : 'auto'}>
            Contact
          </Button>
        </NavLink>

        {currentUser ? (
          <NavLink to="/admin/default" onClick={isMobile ? onClose : undefined}>
            <Button colorScheme="blue" w={isMobile ? 'full' : 'auto'}>
              Dashboard
            </Button>
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/auth/sign-in"
              onClick={isMobile ? onClose : undefined}
            >
              <Button variant="ghost" w={isMobile ? 'full' : 'auto'}>
                Login
              </Button>
            </NavLink>
            <NavLink
              to="/auth/sign-up"
              onClick={isMobile ? onClose : undefined}
            >
              <Button colorScheme="blue" w={isMobile ? 'full' : 'auto'}>
                Get Started
              </Button>
            </NavLink>
          </>
        )}
      </Component>
    );
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Navbar */}
      <Box position="fixed" w="100%" boxShadow="sm" zIndex={1000} >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h="70px">
            {/* Logo */}
            <NavLink to="/">
              <Image h="50px" src={logo} alt="SureBank Logo" />
            </NavLink>

            {/* Desktop Navigation */}
            <Box display={{ base: 'none', md: 'block' }}>
              <NavLinks onClose={onClose} />
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              icon={<HamburgerIcon />}
              variant="ghost"
              aria-label="Open menu"
              size="lg"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="lg" />
          <DrawerHeader borderBottomWidth="1px">
            <Image h="40px" src={logo} alt="SureBank Logo" />
          </DrawerHeader>
          <DrawerBody pt={8}>
            <NavLinks isMobile={true} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex="1" mt="70px">
        <LandingPage />
      </Box>

      {/* Footer */}
      <Box py={10}>
        <Container maxW="7xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Box>
              <Image h="40px" src={logo} alt="SureBank Logo" mb={4} />
              <Box color="gray.600">
                © {new Date().getFullYear()} SureBank. All rights reserved.
              </Box>
            </Box>

            <HStack
              spacing={8}
              mt={{ base: 6, md: 0 }}
              flexWrap="wrap"
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <NavLink to="/privacy">
                <Button variant="link">Privacy Policy</Button>
              </NavLink>
              <NavLink to="/terms">
                <Button variant="link">Terms of Service</Button>
              </NavLink>
              <NavLink to="https://wa.me/2348031313024">
                <Button variant="link">Contact Us</Button>
              </NavLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeLayout;
