import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from 'contexts/AuthContext';
import { useHistory } from 'react-router-dom/';

export default function MakeContribution() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [user, setUser] = useState({});
  const [packageId, setPackageId] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        const packages = await axiosService.get(
          `/daily-savings/package?userId=${currentUser.id}`
        );
        setPackageId(packages.data.id);
      } catch (error) {
        console.error(error);
      }
    };
    // Fetch user package and branches
    const fetchData = async () => {
      fetchUserPackage();

      if (currentUser?.role === 'user') {
        try {
          const response = await axiosService.get(
            `/accounts/${currentUser.id}`
          );
          setAccountNumber(response.data.accountNumber);
          fetchUserByAccountNumber(response.data.accountNumber);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  // Fetch user information for the given accountNumber
  const fetchUserByAccountNumber = async (accountNumber) => {
    try {
      const response = await axiosService.get(
        `/transactions/user/?accountNumber=${accountNumber}`
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form submission
  const onSubmit = async (depositData) => {
    try {
      console.log(packageId);
      await axiosService.post(
        `/daily-savings/make-contribution/?packageId=${packageId}`,
        depositData
      );
      toast.success('Contribution successful!');
      history.push('/');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      <BackButton />
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          <Center py={6}>
            <Box
              w={{ base: '90%', md: '80%' }}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="base"
              p="30px"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.accountNumber}>
                  <FormLabel
                    htmlFor="accountNumber"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Account Number<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="accountNumber"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    defaultValue={accountNumber}
                    {...register('accountNumber', {
                      required: 'Account number is required',
                    })}
                    onBlur={(e) => {
                      const accountNumber = e.target.value.trim();
                      if (accountNumber) {
                        fetchUserByAccountNumber(accountNumber);
                      }
                    }}
                  />
                  {user ? (
                    <Text fontSize="sm" color="green" mt="2px" pb="10px">
                      {user.firstName} {user.lastName}
                    </Text>
                  ) : (
                    <Text fontSize="sm" color="red" mt="2px" pb="10px">
                      ""
                    </Text>
                  )}
                  <FormErrorMessage>
                    {errors.accountNumber && errors.accountNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.amount}>
                  <FormLabel
                    htmlFor="amount"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Amount<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="amount"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('amount', {
                      required: 'Amount is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.amount && errors.amount.message}
                  </FormErrorMessage>
                </FormControl>

                <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                  <Button
                    colorScheme="green"
                    variant="solid"
                    w="100%"
                    h="50"
                    mb="24px"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Deposit
                  </Button>
                </Box>
              </form>
            </Box>
          </Center>
        </Flex>
      </Grid>
    </Box>
  );
}
