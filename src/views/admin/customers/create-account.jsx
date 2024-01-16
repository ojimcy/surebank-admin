// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Custom components
import ReactSelect from 'react-select';

// Assets
import Card from 'components/card/Card.js';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { toSentenceCase } from 'utils/helper';
import BackButton from 'components/menu/BackButton';

export default function CreateAccount() {
  const history = useHistory();

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [branches, setBranches] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchUsers = async () => {
    try {
      const UserResponse = await axiosService.get(
        `/users?role=user&limit=10000000`
      );
      setUsers(UserResponse.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosService.get('/branch/');
      setBranches(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const submitHandler = async (accountData) => {
    try {
      // If a user is selected
      if (selectedUser) {
        accountData.email = selectedUser.value;
        accountData.phoneNumber = selectedUser.phoneNumber;
      }
      await axiosService.post(`/accounts`, accountData);
      toast.success('Account created successfully!');
      history.push('/admin/customers');
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
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <BackButton />
          <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
            Create Customer
          </Text>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl>
                  <FormLabel
                    htmlFor="address"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Users<Text>*</Text>
                  </FormLabel>
                  <ReactSelect
                    options={users.map((user) => ({
                      value: user.email,
                      label: `${user.firstName} ${user.lastName} - ${user.email}`,
                    }))}
                    onChange={handleUserSelect}
                    placeholder="Select User"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        color: 'black',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: 'black',
                      }),
                    }}
                  />
                </FormControl>
              </Box>
            </Flex>
            <Flex flexDirection="row">
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.accountType}>
                  <FormLabel
                    htmlFor="address"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Account Type<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    {...register('accountType')}
                    name="accountType"
                    defaultValue="Hq"
                  >
                    <option value="">Select account rype</option>
                    <option value="ds">DS</option>
                    <option value="sb">SB</option>
                  </Select>
                </FormControl>
              </Box>
            </Flex>
            <Flex flexDirection="row">
              <Box width={{ base: '50%', md: '50%', sm: '100%' }} mt="20px">
                <FormControl isInvalid={errors.branch}>
                  <FormLabel
                    htmlFor="branch"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Branch<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    {...register('branchId')}
                    name="branchId"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a branch
                    </option>
                    {branches &&
                      branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {toSentenceCase(branch?.name)}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Flex>
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
                Save
              </Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Box>
  );
}
