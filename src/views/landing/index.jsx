import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaRegMoneyBillAlt,
  FaStore,
  FaUserFriends,
  FaMobile,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import heroImage from '../../assets/img/auth/auth-bg.webp';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'all .2s ease',
      }}
      padding={{ base: '10px', md: '20px' }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'blue.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'}>
        {title}
      </Text>
      <Text color={'gray.600'} align={'center'}>
        {text}
      </Text>
    </Stack>
  );
};

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue('blue.50', 'gray.900')} minH={'100vh'} py={20}>
        <Container maxW={'7xl'}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={10}
            alignItems="center"
          >
            <Stack spacing={6}>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                color={useColorModeValue('gray.900', 'white')}
              >
                Save Daily Towards Your Dreams with{' '}
                <Text as="span" color="blue.500">
                  SureBank
                </Text>
              </Heading>
              <Text fontSize="xl" color={'gray.600'}>
                Create savings packages, make daily contributions, and achieve
                your goals. Whether it's buying products from our store or
                saving for something special, we've got you covered.
              </Text>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                display={{ base: 'flex' }}
                justifyContent={{ base: 'space-between' }}
                spacing={4}
              >
                <Button
                  as={NavLink}
                  to="/auth/sign-up"
                  rounded="full"
                  size="lg"
                  colorScheme="blue"
                  px={8}
                >
                  Get Started
                </Button>
                <Button
                  as={NavLink}
                  to="/auth/sign-in"
                  rounded="full"
                  size="lg"
                  px={8}
                >
                  Login
                </Button>
              </Stack>
            </Stack>
            <Box display={'flex'} justifyContent={'center'}>
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                src={heroImage}
                rounded={'xl'}
                height={{ base: '300px', md: '500px' }}
                width={{ base: '300px', md: '500px' }}
                borderRadius={'50%'}
              />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'3xl'}>Why Choose SureBank?</Heading>
            <Text color={'gray.600'} fontSize={'xl'}>
              Experience the easiest way to save and achieve your goals
            </Text>
          </Stack>

          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
            gap={8}
            mt={10}
          >
            <Feature
              icon={<Icon as={FaRegMoneyBillAlt} w={10} h={10} />}
              title={'Daily Savings'}
              text={'Make daily contributions towards your goals with ease'}
            />
            <Feature
              icon={<Icon as={FaStore} w={10} h={10} />}
              title={'Product Store'}
              text={'Shop from our curated collection of quality products'}
            />
            <Feature
              icon={<Icon as={FaUserFriends} w={10} h={10} />}
              title={'Agent Network'}
              text={'Swift deposits and withdrawals through our trusted agents'}
            />
            <Feature
              icon={<Icon as={FaMobile} w={10} h={10} />}
              title={'Easy Management'}
              text={'Create and manage your savings packages effortlessly'}
            />
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'3xl'}>How It Works</Heading>
            <Text color={'gray.600'} fontSize={'xl'}>
              Start your savings journey in three simple steps
            </Text>
          </Stack>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={10}
            mt={10}
          >
            {[
              {
                title: 'Create a Package',
                description:
                  'Set up your savings package with your desired goal and timeline',
              },
              {
                title: 'Make Contributions',
                description: 'Save daily through our network of trusted agents',
              },
              {
                title: 'Achieve Your Goals',
                description:
                  'Watch your savings grow and achieve your financial goals',
              },
            ].map((step, index) => (
              <Stack
                key={index}
                bg={'white'}
                boxShadow={'lg'}
                p={8}
                rounded={'xl'}
                align={'center'}
                pos={'relative'}
              >
                <Flex
                  w={16}
                  h={16}
                  align={'center'}
                  justify={'center'}
                  color={'white'}
                  rounded={'full'}
                  bg={'blue.500'}
                  mb={1}
                >
                  <Text fontSize={'2xl'} fontWeight={'bold'}>
                    {index + 1}
                  </Text>
                </Flex>
                <Text fontWeight={600} fontSize={'xl'}>
                  {step.title}
                </Text>
                <Text color={'gray.600'} align={'center'}>
                  {step.description}
                </Text>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align={'center'}
            justify={'center'}
            bg={'blue.500'}
            p={10}
            rounded={'xl'}
          >
            <Stack flex={1} spacing={4}>
              <Heading color={'white'}>Start Saving Today</Heading>
              <Text color={'white'} fontSize={'xl'}>
                Join thousands of people achieving their financial goals with
                SureBank
              </Text>
            </Stack>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                as={NavLink}
                to="/auth/sign-up"
                rounded="full"
                size="lg"
                bg={'white'}
                color={'blue.500'}
                _hover={{
                  bg: 'gray.100',
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
