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
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Link,
  keyframes,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaRegMoneyBillAlt,
  FaStore,
  FaUserFriends,
  FaMobile,
  FaShieldAlt,
  FaChartLine,
  FaGift,
  FaCreditCard,
  FaUniversity,
  FaCalendarAlt,
  FaPercentage,
  FaShoppingCart,
  FaHandshake,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaApple,
  FaGooglePlay,
  FaQrcode,
  FaDownload,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

// Using a high-quality fintech hero image
const fintech_hero_image =
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80';

// App Store Links (replace with actual URLs when available)
const APP_STORE_URL = 'https://apps.apple.com/app/surebank';
const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.surebank.app';
const APK_DIRECT_URL = '/downloads/surebank-latest.apk';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInLeft = keyframes`
  0% { transform: translateX(-100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  0% { transform: translateX(100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInUp = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-15px); }
  70% { transform: translateY(-7px); }
  90% { transform: translateY(-3px); }
`;

const Feature = ({ title, text, icon, color = 'blue.500' }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _hover={{
        transform: 'translateY(-10px) scale(1.02)',
        transition: 'all .4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '2xl',
      }}
      transition={'all .4s cubic-bezier(0.4, 0, 0.2, 1)'}
      animation={`${slideInUp} 0.6s ease-out`}
      cursor={'pointer'}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={color}
        mb={4}
        _hover={{
          animation: `${pulse} 2s infinite`,
        }}
        transition={'all .3s ease'}
      >
        {icon}
      </Flex>
      <Text
        fontWeight={600}
        fontSize={'xl'}
        textAlign={'center'}
        _hover={{ color: color }}
        transition={'color .3s ease'}
      >
        {title}
      </Text>
      <Text color={'gray.600'} textAlign={'center'}>
        {text}
      </Text>
    </Stack>
  );
};

const PackageCard = ({ title, description, features, color, icon }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      rounded={'xl'}
      p={8}
      _hover={{
        transform: 'translateY(-8px) scale(1.02)',
        transition: 'all .4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '2xl',
        borderColor: color,
        borderWidth: '2px',
      }}
      transition={'all .4s cubic-bezier(0.4, 0, 0.2, 1)'}
      animation={`${slideInUp} 0.8s ease-out`}
      cursor={'pointer'}
      border={'2px solid transparent'}
    >
      <VStack spacing={4} align={'start'}>
        <HStack>
          <Icon as={icon} w={8} h={8} color={color} />
          <Heading size={'lg'} color={color}>
            {title}
          </Heading>
        </HStack>
        <Text color={'gray.600'} fontSize={'md'}>
          {description}
        </Text>
        <VStack spacing={2} align={'start'} w={'full'}>
          {features.map((feature, index) => (
            <HStack key={index} spacing={2}>
              <Icon as={FaCheckCircle} color={'green.500'} w={4} h={4} />
              <Text fontSize={'sm'} color={'gray.700'}>
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

const StatBox = ({ title, value, description, icon, color = 'blue.500' }) => {
  return (
    <Stat
      px={6}
      py={4}
      bg={useColorModeValue('white', 'gray.800')}
      shadow={'lg'}
      rounded={'lg'}
      textAlign={'center'}
      _hover={{
        transform: 'translateY(-5px) scale(1.05)',
        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'xl',
      }}
      transition={'all .3s cubic-bezier(0.4, 0, 0.2, 1)'}
      animation={`${fadeIn} 0.8s ease-out`}
      cursor={'pointer'}
    >
      <Flex justify={'center'} mb={2}>
        <Icon
          as={icon}
          w={8}
          h={8}
          color={color}
          _hover={{
            animation: `${bounce} 1s ease-in-out`,
          }}
        />
      </Flex>
      <StatNumber
        fontSize={'2xl'}
        fontWeight={'bold'}
        color={color}
        _hover={{
          animation: `${pulse} 1.5s infinite`,
        }}
      >
        {value}
      </StatNumber>
      <StatLabel fontSize={'md'} fontWeight={'medium'}>
        {title}
      </StatLabel>
      <StatHelpText fontSize={'sm'} color={'gray.600'}>
        {description}
      </StatHelpText>
    </Stat>
  );
};

const AppDownloadButton = ({ platform, icon, url, children, ...props }) => {
  return (
    <Button
      as={Link}
      href={url}
      isExternal
      leftIcon={
        <Icon
          as={icon}
          w={5}
          h={5}
          _hover={{
            animation: `${bounce} 0.6s ease-in-out`,
          }}
        />
      }
      bg={'gray.900'}
      color={'white'}
      px={6}
      py={6}
      rounded={'xl'}
      _hover={{
        bg: 'gray.800',
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: '2xl',
      }}
      _active={{
        transform: 'translateY(-1px) scale(0.98)',
      }}
      transition={'all .3s cubic-bezier(0.4, 0, 0.2, 1)'}
      fontSize={'sm'}
      fontWeight={'medium'}
      animation={`${slideInUp} 0.5s ease-out`}
      {...props}
    >
      {children}
    </Button>
  );
};

const LandingPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        minH={'100vh'}
        py={20}
        bgGradient={useColorModeValue(
          'linear(to-br, blue.50, purple.50, pink.50)',
          'linear(to-br, gray.900, blue.900, purple.900)'
        )}
        position={'relative'}
        overflow={'hidden'}
      >
        {/* Background Pattern */}
        <Box
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          bgImage={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
          animation={`${fadeIn} 2s ease-out`}
        />

        {/* Floating geometric shapes */}
        <Box
          position={'absolute'}
          top={'10%'}
          left={'5%'}
          w={4}
          h={4}
          bg={'blue.300'}
          rounded={'full'}
          opacity={0.4}
          animation={`${float} 5s ease-in-out infinite`}
        />
        <Box
          position={'absolute'}
          top={'60%'}
          right={'10%'}
          w={6}
          h={6}
          bg={'purple.300'}
          opacity={0.3}
          animation={`${float} 7s ease-in-out infinite reverse`}
          transform={'rotate(45deg)'}
        />
        <Box
          position={'absolute'}
          bottom={'20%'}
          left={'15%'}
          w={3}
          h={3}
          bg={'pink.300'}
          rounded={'full'}
          opacity={0.5}
          animation={`${float} 4s ease-in-out infinite`}
        />

        <Container maxW={'7xl'} position={'relative'} zIndex={1}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={10}
            alignItems="center"
          >
            <Stack spacing={8} animation={`${slideInLeft} 0.8s ease-out`}>
              <VStack spacing={4} align={'start'}>
                <Badge
                  colorScheme="blue"
                  px={3}
                  py={1}
                  rounded={'full'}
                  animation={`${bounce} 2s ease-in-out infinite`}
                  _hover={{
                    animation: `${pulse} 0.5s ease-in-out`,
                  }}
                  cursor={'pointer'}
                >
                  🚀 Your Financial Future Starts Here
                </Badge>
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="black"
                  lineHeight={'1.1'}
                  color={useColorModeValue('gray.900', 'white')}
                  bgGradient={'linear(to-r, blue.500, purple.500)'}
                  bgClip={'text'}
                  animation={`${fadeIn} 1s ease-out 0.3s both`}
                  _hover={{
                    bgGradient: 'linear(to-r, purple.500, pink.500)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Smart Savings, Smarter Shopping with{' '}
                  <Text as="span" color="blue.500">
                    SureBank
                  </Text>
                </Heading>
                <Text
                  fontSize="xl"
                  color={textColor}
                  lineHeight={'1.7'}
                  fontWeight={'medium'}
                  animation={`${fadeIn} 1s ease-out 0.6s both`}
                >
                  Transform your savings journey with our innovative daily
                  savings packages, competitive interest rates, and integrated
                  shopping experience. Save towards your goals while shopping
                  for the products you love.
                </Text>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={6}
                animation={`${slideInUp} 1s ease-out 0.9s both`}
              >
                <HStack
                  spacing={3}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition={'all 0.3s ease'}
                  cursor={'pointer'}
                >
                  <Box
                    p={2}
                    bg={'green.100'}
                    rounded={'full'}
                    _hover={{
                      bg: 'green.200',
                      animation: `${pulse} 1s ease-in-out infinite`,
                    }}
                    transition={'all 0.3s ease'}
                  >
                    <Icon as={FaShieldAlt} color={'green.600'} w={5} h={5} />
                  </Box>
                  <VStack align={'start'} spacing={0}>
                    <Text fontSize={'sm'} fontWeight={'bold'} color={textColor}>
                      Bank-level Security
                    </Text>
                    <Text fontSize={'xs'} color={'gray.500'}>
                      Top-tier Security
                    </Text>
                  </VStack>
                </HStack>
                <HStack
                  spacing={3}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition={'all 0.3s ease'}
                  cursor={'pointer'}
                >
                  <Box
                    p={2}
                    bg={'blue.100'}
                    rounded={'full'}
                    _hover={{
                      bg: 'blue.200',
                      animation: `${pulse} 1s ease-in-out infinite`,
                    }}
                    transition={'all 0.3s ease'}
                  >
                    <Icon as={FaPercentage} color={'blue.600'} w={5} h={5} />
                  </Box>
                  <VStack align={'start'} spacing={0}>
                    <Text fontSize={'sm'} fontWeight={'bold'} color={textColor}>
                      Up to 15% Returns
                    </Text>
                    <Text fontSize={'xs'} color={'gray.500'}>
                      Competitive Interest
                    </Text>
                  </VStack>
                </HStack>
                <HStack
                  spacing={3}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition={'all 0.3s ease'}
                  cursor={'pointer'}
                >
                  <Box
                    p={2}
                    bg={'purple.100'}
                    rounded={'full'}
                    _hover={{
                      bg: 'purple.200',
                      animation: `${pulse} 1s ease-in-out infinite`,
                    }}
                    transition={'all 0.3s ease'}
                  >
                    <Icon as={FaCreditCard} color={'purple.600'} w={5} h={5} />
                  </Box>
                  <VStack align={'start'} spacing={0}>
                    <Text fontSize={'sm'} fontWeight={'bold'} color={textColor}>
                      Paystack Integration
                    </Text>
                    <Text fontSize={'xs'} color={'gray.500'}>
                      Secure Payments
                    </Text>
                  </VStack>
                </HStack>
                <HStack
                  spacing={3}
                  _hover={{ transform: 'scale(1.05)' }}
                  transition={'all 0.3s ease'}
                  cursor={'pointer'}
                >
                  <Box
                    p={2}
                    bg={'orange.100'}
                    rounded={'full'}
                    _hover={{
                      bg: 'orange.200',
                      animation: `${pulse} 1s ease-in-out infinite`,
                    }}
                    transition={'all 0.3s ease'}
                  >
                    <Icon as={FaHandshake} color={'orange.600'} w={5} h={5} />
                  </Box>
                  <VStack align={'start'} spacing={0}>
                    <Text fontSize={'sm'} fontWeight={'bold'} color={textColor}>
                      Agent Network
                    </Text>
                    <Text fontSize={'xs'} color={'gray.500'}>
                      Nationwide Coverage
                    </Text>
                  </VStack>
                </HStack>
              </SimpleGrid>

              {/* App Download Buttons */}
              <VStack spacing={4} align={'start'} pt={4}>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  spacing={4}
                  w={'full'}
                >
                  <AppDownloadButton
                    platform="ios"
                    icon={FaApple}
                    url={APP_STORE_URL}
                  >
                    <VStack spacing={0} align={'start'}>
                      <Text fontSize={'xs'}>Download on the</Text>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        App Store
                      </Text>
                    </VStack>
                  </AppDownloadButton>

                  <AppDownloadButton
                    platform="android"
                    icon={FaGooglePlay}
                    url={GOOGLE_PLAY_URL}
                  >
                    <VStack spacing={0} align={'start'}>
                      <Text fontSize={'xs'}>Get it on</Text>
                      <Text fontSize={'sm'} fontWeight={'bold'}>
                        Google Play
                      </Text>
                    </VStack>
                  </AppDownloadButton>
                </SimpleGrid>
              </VStack>
            </Stack>

            <Box
              display={'flex'}
              justifyContent={'center'}
              position={'relative'}
              animation={`${slideInRight} 0.8s ease-out`}
            >
              {/* Decorative elements */}
              <Box
                position={'absolute'}
                top={-10}
                right={-10}
                w={20}
                h={20}
                bg={'blue.200'}
                rounded={'full'}
                opacity={0.3}
                filter={'blur(20px)'}
                animation={`${float} 6s ease-in-out infinite`}
              />
              <Box
                position={'absolute'}
                bottom={-10}
                left={-10}
                w={16}
                h={16}
                bg={'purple.200'}
                rounded={'full'}
                opacity={0.3}
                filter={'blur(15px)'}
                animation={`${float} 4s ease-in-out infinite reverse`}
              />

              <Box
                position={'relative'}
                _hover={{
                  transform: 'scale(1.05) rotate(1deg)',
                  transition: 'all .4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                transition={'all .4s cubic-bezier(0.4, 0, 0.2, 1)'}
                animation={`${float} 8s ease-in-out infinite`}
              >
                <Image
                  alt={'SureBank - Modern Financial Solutions'}
                  src={fintech_hero_image}
                  rounded={'2xl'}
                  height={{ base: '350px', md: '550px' }}
                  width={{ base: '350px', md: '550px' }}
                  objectFit={'cover'}
                  boxShadow={'2xl'}
                  border={'4px solid'}
                  borderColor={'white'}
                  _hover={{
                    boxShadow: '3xl',
                    borderColor: 'blue.200',
                  }}
                  transition={'all .3s ease'}
                />

                {/* Floating stats card */}
                <Box
                  position={'absolute'}
                  bottom={4}
                  right={4}
                  bg={'white'}
                  rounded={'xl'}
                  p={4}
                  boxShadow={'lg'}
                  border={'1px solid'}
                  borderColor={'gray.100'}
                  animation={`${slideInUp} 1.2s ease-out 0.5s both`}
                  _hover={{
                    transform: 'scale(1.1) rotate(-2deg)',
                    boxShadow: 'xl',
                    borderColor: 'green.200',
                  }}
                  transition={'all .3s cubic-bezier(0.4, 0, 0.2, 1)'}
                  cursor={'pointer'}
                >
                  <VStack spacing={1} align={'start'}>
                    <Text
                      fontSize={'xs'}
                      color={'gray.500'}
                      fontWeight={'medium'}
                    >
                      Total Savings
                    </Text>
                    <Text
                      fontSize={'lg'}
                      fontWeight={'bold'}
                      color={'green.500'}
                      _hover={{
                        animation: `${pulse} 1s ease-in-out infinite`,
                      }}
                    >
                      ₦25M+
                    </Text>
                    <HStack spacing={1}>
                      <Icon
                        as={FaArrowRight}
                        color={'green.400'}
                        w={3}
                        h={3}
                        transform={'rotate(-45deg)'}
                        _hover={{
                          animation: `${bounce} 0.5s ease-in-out`,
                        }}
                      />
                      <Text fontSize={'xs'} color={'green.500'}>
                        +12% this month
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Download Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW={'7xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                Get Started in Minutes
              </Heading>
              <Text color={textColor} fontSize={'xl'} maxW={'2xl'}>
                Download the SureBank mobile app and start your savings journey
                today
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w={'full'}>
              {/* QR Code Section */}
              <Box
                bg={cardBg}
                boxShadow={'lg'}
                rounded={'xl'}
                p={8}
                textAlign={'center'}
              >
                <VStack spacing={4}>
                  <Icon as={FaQrcode} w={16} h={16} color={'blue.500'} />
                  <Heading size={'md'} color={'blue.500'}>
                    Scan to Download
                  </Heading>
                  <Text color={'gray.600'} fontSize={'sm'}>
                    Scan with your phone's camera to download the app instantly
                  </Text>
                  <Box
                    w={32}
                    h={32}
                    bg={'gray.100'}
                    rounded={'lg'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    border={'2px solid'}
                    borderColor={'gray.200'}
                  >
                    <Text
                      fontSize={'xs'}
                      color={'gray.500'}
                      textAlign={'center'}
                    >
                      QR Code
                      <br />
                      Coming Soon
                    </Text>
                  </Box>
                </VStack>
              </Box>

              {/* iOS Download */}
              <Box
                bg={cardBg}
                boxShadow={'lg'}
                rounded={'xl'}
                p={8}
                textAlign={'center'}
              >
                <VStack spacing={4}>
                  <Icon as={FaApple} w={16} h={16} color={'gray.800'} />
                  <Heading size={'md'} color={'gray.800'}>
                    iOS App
                  </Heading>
                  <Text color={'gray.600'} fontSize={'sm'}>
                    Available on the App Store for iPhone and iPad
                  </Text>
                  <AppDownloadButton
                    platform="ios"
                    icon={FaApple}
                    url={APP_STORE_URL}
                    w={'full'}
                  >
                    Download for iOS
                  </AppDownloadButton>
                </VStack>
              </Box>

              {/* Android Download */}
              <Box
                bg={cardBg}
                boxShadow={'lg'}
                rounded={'xl'}
                p={8}
                textAlign={'center'}
              >
                <VStack spacing={4}>
                  <Icon as={FaGooglePlay} w={16} h={16} color={'green.600'} />
                  <Heading size={'md'} color={'green.600'}>
                    Android App
                  </Heading>
                  <Text color={'gray.600'} fontSize={'sm'}>
                    Available on Google Play Store and direct APK download
                  </Text>
                  <VStack spacing={2} w={'full'}>
                    <AppDownloadButton
                      platform="android"
                      icon={FaGooglePlay}
                      url={GOOGLE_PLAY_URL}
                      w={'full'}
                    >
                      Google Play
                    </AppDownloadButton>
                    <AppDownloadButton
                      platform="apk"
                      icon={FaDownload}
                      url={APK_DIRECT_URL}
                      bg={'green.600'}
                      _hover={{ bg: 'green.700' }}
                      w={'full'}
                    >
                      Direct APK
                    </AppDownloadButton>
                  </VStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <VStack spacing={8}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                Trusted by Thousands
              </Heading>
              <Text color={textColor} fontSize={'lg'} maxW={'2xl'}>
                Join our growing community of smart savers
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w={'full'}>
              <StatBox
                title="Active Savers"
                value="1,000+"
                description="Growing community"
                icon={FaUserFriends}
                color="blue.500"
              />
              <StatBox
                title="Total Savings"
                value="₦25M+"
                description="Secured & growing"
                icon={FaRegMoneyBillAlt}
                color="green.500"
              />
              <StatBox
                title="Products Available"
                value="100+"
                description="Quality items"
                icon={FaStore}
                color="purple.500"
              />
              <StatBox
                title="Agent Locations"
                value="20+"
                description="Nationwide coverage"
                icon={FaMobile}
                color="orange.500"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Savings Packages Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW={'7xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                Choose Your Savings Journey
              </Heading>
              <Text color={textColor} fontSize={'xl'} maxW={'2xl'}>
                Three powerful ways to save, each designed to meet your unique
                financial goals
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <PackageCard
                title="Daily Savings"
                description="Build your savings habit with small daily contributions that grow into something big"
                features={[
                  'Flexible daily amounts',
                  'Anytime withdrawals',
                  'No fixed timeline',
                  'Perfect for beginners',
                  'Track your progress',
                ]}
                color="blue.500"
                icon={FaCalendarAlt}
              />

              <PackageCard
                title="Savings-Buying"
                description="Save towards specific products in our catalog and get them when you reach your target"
                features={[
                  'Save for specific products',
                  'Integrated shopping',
                  'Price protection',
                  'Product reservation',
                  'Flexible payments',
                ]}
                color="purple.500"
                icon={FaShoppingCart}
              />

              <PackageCard
                title="Interest-Based"
                description="Grow your money faster with competitive interest rates on fixed-term savings"
                features={[
                  'Up to 15% annual returns',
                  'Fixed terms available',
                  'Compound interest',
                  'Secure investment',
                  'Guaranteed returns',
                ]}
                color="green.500"
                icon={FaChartLine}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                Why SureBank Works
              </Heading>
              <Text color={textColor} fontSize={'xl'} maxW={'2xl'}>
                Built with modern technology and user-centric design for the
                best savings experience
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
              <Feature
                icon={<Icon as={FaShieldAlt} w={10} h={10} />}
                title={'Bank-Level Security'}
                text={
                  'Your funds are protected with enterprise-grade security and encryption'
                }
                color="green.500"
              />
              <Feature
                icon={<Icon as={FaCreditCard} w={10} h={10} />}
                title={'Seamless Payments'}
                text={
                  'Powered by Paystack for secure card payments and bank transfers'
                }
                color="blue.500"
              />
              <Feature
                icon={<Icon as={FaUserFriends} w={10} h={10} />}
                title={'Agent Network'}
                text={
                  'Cash deposits and withdrawals through our nationwide agent network'
                }
                color="orange.500"
              />
              <Feature
                icon={<Icon as={FaUniversity} w={10} h={10} />}
                title={'Virtual Accounts'}
                text={
                  'Get dedicated virtual account numbers for easy bank transfers'
                }
                color="purple.500"
              />
              <Feature
                icon={<Icon as={FaStore} w={10} h={10} />}
                title={'Integrated Shopping'}
                text={
                  'Browse and buy from our curated catalog using your savings'
                }
                color="pink.500"
              />
              <Feature
                icon={<Icon as={FaPercentage} w={10} h={10} />}
                title={'Competitive Returns'}
                text={
                  'Earn up to 15% annual returns on your interest-based savings'
                }
                color="teal.500"
              />
              <Feature
                icon={<Icon as={FaMobile} w={10} h={10} />}
                title={'Mobile-First Design'}
                text={
                  'Optimized for mobile with intuitive interface and smooth experience'
                }
                color="cyan.500"
              />
              <Feature
                icon={<Icon as={FaGift} w={10} h={10} />}
                title={'Rewards & Bonuses'}
                text={'Earn rewards for consistent saving and referrals'}
                color="red.500"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW={'7xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                How It Works
              </Heading>
              <Text color={textColor} fontSize={'xl'} maxW={'2xl'}>
                Start your financial journey in four simple steps
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {[
                {
                  step: '01',
                  title: 'Download the App',
                  description:
                    'Get the SureBank mobile app from App Store, Google Play, or direct APK download',
                  icon: FaMobile,
                  color: 'blue.500',
                },
                {
                  step: '02',
                  title: 'Sign Up & Verify',
                  description:
                    'Create your account and complete KYC verification to unlock all features',
                  icon: FaUserFriends,
                  color: 'purple.500',
                },
                {
                  step: '03',
                  title: 'Choose Your Package',
                  description:
                    'Select from Daily Savings, Savings-Buying, or Interest-Based packages',
                  icon: FaGift,
                  color: 'green.500',
                },
                {
                  step: '04',
                  title: 'Start Saving',
                  description:
                    'Make contributions via card, bank transfer, or through our agent network',
                  icon: FaCreditCard,
                  color: 'orange.500',
                },
              ].map((item, index) => (
                <VStack
                  key={index}
                  bg={cardBg}
                  boxShadow={'lg'}
                  p={8}
                  rounded={'xl'}
                  spacing={4}
                  position={'relative'}
                  _hover={{
                    transform: 'translateY(-5px)',
                    transition: 'all .3s ease',
                    boxShadow: 'xl',
                  }}
                  transition={'all .3s ease'}
                >
                  <Box
                    position={'absolute'}
                    top={-4}
                    left={4}
                    bg={item.color}
                    color={'white'}
                    px={3}
                    py={1}
                    rounded={'full'}
                    fontSize={'sm'}
                    fontWeight={'bold'}
                  >
                    {item.step}
                  </Box>
                  <Icon
                    as={item.icon}
                    w={12}
                    h={12}
                    color={item.color}
                    mt={4}
                  />
                  <Text fontWeight={600} fontSize={'xl'} textAlign={'center'}>
                    {item.title}
                  </Text>
                  <Text color={'gray.600'} textAlign={'center'} fontSize={'sm'}>
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                What Our Users Say
              </Heading>
              <Text color={textColor} fontSize={'xl'}>
                Join thousands of satisfied savers achieving their financial
                goals
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Small Business Owner',
                  testimonial:
                    'SureBank helped me save consistently for my business expansion. The daily savings feature made it so easy to build my emergency fund.',
                  rating: 5,
                },
                {
                  name: 'Michael Adebayo',
                  role: 'Software Developer',
                  testimonial:
                    'I love the savings-buying feature! Saved for my laptop through SureBank and got it exactly when I needed it. The process was seamless.',
                  rating: 5,
                },
                {
                  name: 'Grace Okafor',
                  role: 'Teacher',
                  testimonial:
                    'The interest-based savings gave me better returns than my traditional bank. The security and ease of use convinced me to move all my savings here.',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  boxShadow={'lg'}
                  rounded={'xl'}
                  p={8}
                  _hover={{
                    transform: 'translateY(-5px)',
                    transition: 'all .3s ease',
                    boxShadow: 'xl',
                  }}
                  transition={'all .3s ease'}
                >
                  <VStack spacing={4}>
                    <HStack>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Icon key={i} as={FaStar} color={'yellow.400'} />
                      ))}
                    </HStack>
                    <Text
                      color={'gray.600'}
                      fontStyle={'italic'}
                      textAlign={'center'}
                    >
                      "{testimonial.testimonial}"
                    </Text>
                    <VStack spacing={1}>
                      <Text fontWeight={'bold'}>{testimonial.name}</Text>
                      <Text fontSize={'sm'} color={'gray.500'}>
                        {testimonial.role}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW={'4xl'}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading
                fontSize={'3xl'}
                bgGradient={'linear(to-r, blue.500, purple.500)'}
                bgClip={'text'}
              >
                Frequently Asked Questions
              </Heading>
              <Text color={textColor} fontSize={'xl'}>
                Everything you need to know about SureBank
              </Text>
            </VStack>

            <VStack spacing={6} w={'full'}>
              {[
                {
                  question: 'How do I get started with SureBank?',
                  answer:
                    'Simply download our mobile app from the App Store, Google Play, or via direct APK download. Create your account, complete KYC verification, and start saving immediately.',
                },
                {
                  question: 'Is the app available for both Android and iOS?',
                  answer:
                    'Yes! SureBank is available on both iOS (App Store) and Android (Google Play Store). Android users can also download the APK directly from our website.',
                },
                {
                  question: 'How secure is my money with SureBank?',
                  answer:
                    'Your funds are protected with bank-level security, encryption, and are held in secure partner banks. We use Paystack for payment processing, ensuring your financial data is always protected.',
                },
                {
                  question: 'Can I withdraw my money anytime?',
                  answer:
                    'Yes! Daily Savings packages offer flexible withdrawals anytime. Interest-based packages have fixed terms but allow early withdrawal with penalties. Savings-buying packages can be withdrawn or used for purchases.',
                },
                {
                  question: 'How do I make contributions?',
                  answer:
                    'You can contribute via card payments, bank transfers, or through our nationwide agent network. We also provide virtual account numbers for easy bank transfers.',
                },
              ].map((faq, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  boxShadow={'md'}
                  rounded={'lg'}
                  p={6}
                  w={'full'}
                >
                  <VStack spacing={3} align={'start'}>
                    <Text fontWeight={'bold'} fontSize={'lg'}>
                      {faq.question}
                    </Text>
                    <Text color={'gray.600'}>{faq.answer}</Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={20}
        bgGradient={'linear(to-br, blue.600, purple.600, pink.500)'}
        position={'relative'}
        overflow={'hidden'}
      >
        {/* Background Pattern */}
        <Box
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          bgImage={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
        />

        <Container maxW={'7xl'} position={'relative'} zIndex={1}>
          <VStack spacing={8}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading color={'white'} fontSize={'4xl'} fontWeight={'black'}>
                Ready to Transform Your Financial Future?
              </Heading>
              <Text
                color={'whiteAlpha.900'}
                fontSize={'xl'}
                maxW={'2xl'}
                lineHeight={'1.6'}
              >
                Join thousands of Nigerians who are already building wealth with
                SureBank. Download the app and start your savings journey today
                with just ₦100.
              </Text>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={4}
              w={'full'}
              maxW={'4xl'}
            >
              <AppDownloadButton
                platform="ios"
                icon={FaApple}
                url={APP_STORE_URL}
                w={'full'}
              >
                <VStack spacing={0} align={'start'}>
                  <Text fontSize={'xs'}>Download on the</Text>
                  <Text fontSize={'sm'} fontWeight={'bold'}>
                    App Store
                  </Text>
                </VStack>
              </AppDownloadButton>

              <AppDownloadButton
                platform="android"
                icon={FaGooglePlay}
                url={GOOGLE_PLAY_URL}
                w={'full'}
              >
                <VStack spacing={0} align={'start'}>
                  <Text fontSize={'xs'}>Get it on</Text>
                  <Text fontSize={'sm'} fontWeight={'bold'}>
                    Google Play
                  </Text>
                </VStack>
              </AppDownloadButton>

              <AppDownloadButton
                platform="apk"
                icon={FaDownload}
                url={APK_DIRECT_URL}
                bg={'green.600'}
                _hover={{ bg: 'green.700' }}
                w={'full'}
              >
                <VStack spacing={0} align={'start'}>
                  <Text fontSize={'xs'}>Direct</Text>
                  <Text fontSize={'sm'} fontWeight={'bold'}>
                    APK Download
                  </Text>
                </VStack>
              </AppDownloadButton>

              <Button
                as={NavLink}
                to="/auth/sign-in"
                size="lg"
                variant="outline"
                color={'white'}
                borderColor={'white'}
                borderWidth={2}
                px={6}
                py={6}
                fontSize={'sm'}
                leftIcon={<FaPlay />}
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
                w={'full'}
              >
                <VStack spacing={0} align={'start'}>
                  <Text fontSize={'xs'}>Access</Text>
                  <Text fontSize={'sm'} fontWeight={'bold'}>
                    Admin Portal
                  </Text>
                </VStack>
              </Button>
            </SimpleGrid>

            <HStack spacing={8} pt={4}>
              <HStack spacing={2}>
                <Icon as={FaShieldAlt} color={'whiteAlpha.800'} />
                <Text
                  color={'whiteAlpha.800'}
                  fontSize={'sm'}
                  fontWeight={'medium'}
                >
                  100% Secure
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaCheckCircle} color={'whiteAlpha.800'} />
                <Text
                  color={'whiteAlpha.800'}
                  fontSize={'sm'}
                  fontWeight={'medium'}
                >
                  No Hidden Fees
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaUserFriends} color={'whiteAlpha.800'} />
                <Text
                  color={'whiteAlpha.800'}
                  fontSize={'sm'}
                  fontWeight={'medium'}
                >
                  24/7 Support
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
