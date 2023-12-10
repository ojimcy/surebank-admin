import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth-bg.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { toast } from 'react-toastify';

function SignIn() {
  const history = useHistory();
  const { currentUser, login } = useAuth();
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    if (currentUser) {
      history.push('/admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      await login(data.identifier, data.password);
      toast.success('Signin successful!');
      history.push('/admin');
    } catch (error) {
      if (error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl isInvalid={errors.identifier}>
              <FormLabel
                display="flex"
                htmlFor="identifier"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email or Phone Number<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                placeholder="mail@simmmple.com or +1234567890"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('identifier')}
              />
              {errors.identifier && (
                <FormErrorMessage>
                  {errors.identifier.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
                htmlFor="password"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  {...register('password')}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <NavLink to="/auth/forgot-password">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="124px"
                  fontWeight="500"
                >
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/auth/sign-up">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
