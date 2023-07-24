import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditUser() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // Extract the id from the query parameters in the URL
    const fetchUser = async () => {
      try {
        const response = await axiosService.get(`users/${id}`);
        setUser(response.data);
        setValue('email', response.data.email);
        setValue('firstName', response.data.firstName);
        setValue('lastName', response.data.lastName);
        setValue('address', response.data.address);
        setValue('phoneNumber', response.data.phoneNumber);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [setValue, id]);
  const submitHandler = async (userData) => {
    // Convert the 'role' field to a string if it's an array
    if (Array.isArray(userData.role)) {
      userData.role = userData.role.join(',');
    }
    try {
      console.log(userData);
      const response = await axiosService.patch(`users/${id}`, userData);
      toast.success('Profile updated successfully!');
      setUser(response.data);
      history.push(`/admin/user/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
        <Card>
          <Flex w="50%" mx="auto" mt="26px">
            <form
              className="update-form"
              onSubmit={handleSubmit(submitHandler)}
            >
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register('email')}
                  placeholder="Email"
                  defaultValue={user?.email || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>First Name</FormLabel>
                <Input
                  {...register('firstName')}
                  placeholder="First Name"
                  defaultValue={user?.firstName || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Last Name</FormLabel>
                <Input
                  {...register('lastName')}
                  placeholder="Last Name"
                  defaultValue={user?.lastName || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Address</FormLabel>
                <Input
                  {...register('address')}
                  placeholder="Address"
                  defaultValue={user?.address || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phoneNumber')}
                  placeholder="Phone Number"
                  defaultValue={user?.phoneNumber || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel
                  htmlFor="address"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Branch
                </FormLabel>
                <Select
                  {...register('branch')}
                  name="branch"
                  defaultValue={user?.branch}
                >
                  <option value="">Select a branch</option>
                  <option value="Hq">HQ</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel
                  htmlFor="address"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Role
                </FormLabel>
                {/* <Text fontSize="sm">Select one or more role</Text> */}
                <Stack>
                  <Checkbox
                    value="admin"
                    {...register('role')}
                    id="admin"
                    name="role"
                    defaultChecked={user?.role?.includes('admin')}
                  >
                    Admin
                  </Checkbox>
                  <Checkbox
                    value="user"
                    {...register('role')}
                    id="user"
                    name="role"
                    defaultChecked={user?.role?.includes('user')}
                  >
                    User
                  </Checkbox>
                </Stack>
              </FormControl>

              <Button
                fontSize="sm"
                colorScheme="green"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                mt="20px"
                type="submit"
                isLoading={isSubmitting}
              >
                Update
              </Button>
            </form>
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}