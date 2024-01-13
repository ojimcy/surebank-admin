import React, { useCallback, useEffect, useState } from 'react';
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
import { useHistory, useParams } from 'react-router-dom/';

export default function Withdrawal() {
  const { packageId } = useParams();
  const history = useHistory();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [userPackage, setUserPackage] = useState({});

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        const response = await axiosService.get(
          `/daily-savings/package/${packageId}`
        );
        setUserPackage(response.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching user package.'
        );
      }
    };

    fetchUserPackage();
  }, [packageId]);

  // Handle form submission
  const handleContributionSubmit = useCallback(
    async (withdrawData) => {
      try {
        await axiosService.post(`/daily-savings/withdraw`, withdrawData);
        toast.success('Contribution successful!');
        history.push(`/admin/default`);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while making contribution.'
        );
      }
    },
    [history]
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
              <form onSubmit={handleSubmit(handleContributionSubmit)}>
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
                    defaultValue={userPackage.accountNumber || ''}
                    {...register('accountNumber', {
                      required: 'Account number is required',
                    })}
                  />
                  {userPackage && userPackage ? (
                    <Text fontSize="sm" color="green" mt="2px" pb="10px">
                      {userPackage.userId?.firstName}{' '}
                      {userPackage.userId?.lastName}
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
                <FormControl isInvalid={errors.target}>
                  <FormLabel
                    htmlFor="target"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Target<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="target"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    defaultValue={userPackage.target || ''}
                    {...register('target', {
                      required: 'Target is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.target && errors.target.message}
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
                    colorScheme="red"
                    variant="solid"
                    w="100%"
                    h="50"
                    mb="24px"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Withdraw
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
