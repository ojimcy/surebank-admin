import React from 'react';
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
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

export default function EditCustomer() {
  const history = useHistory();
  const { branches, customerData } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },

  } = useForm();

  const submitHandler = async (userData) => {
    try {
      await axiosService.patch(`accounts/${customerData.id}`, userData);
      toast.success('Profile updated successfully!');
      history.push(`/admin/user/${customerData.id}`);
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
          <BackButton />
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
                  defaultValue={customerData?.email || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>First Name</FormLabel>
                <Input
                  {...register('firstName')}
                  placeholder="First Name"
                  defaultValue={customerData?.firstName || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Last Name</FormLabel>
                <Input
                  {...register('lastName')}
                  placeholder="Last Name"
                  defaultValue={customerData?.lastName || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Address</FormLabel>
                <Input
                  {...register('address')}
                  placeholder="Address"
                  defaultValue={customerData?.address || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phoneNumber')}
                  placeholder="Phone Number"
                  defaultValue={customerData?.phoneNumber || ''}
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
                        {branch.name}
                      </option>
                    ))}
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
                    defaultChecked={customerData?.role?.includes('admin')}
                  >
                    Admin
                  </Checkbox>
                  <Checkbox
                    value="user"
                    {...register('role')}
                    id="user"
                    name="role"
                    defaultChecked={customerData?.role?.includes('user')}
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
