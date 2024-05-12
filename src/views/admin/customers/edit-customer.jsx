import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

export default function EditCustomer() {
  const textColor = useColorModeValue('navy.500', 'white');
  const { id } = useParams();
  const history = useHistory();
  const { branches } = useAppContext();

  const [account, setAccount] = useState({});
  const [staffList, setStaffList] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // Extract the id from the query parameters in the URL
    const fetchAccount = async () => {
      try {
        const response = await axiosService.get(`accounts/${id}/details`);
        setAccount(response.data);
        setValue('firstName', response.data.firstName);
        setValue('lastName', response.data.lastName);
        setValue('accountManagerId', response.data.accountManagerId._id);
        setValue('branchId', response.data.branchId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
  }, [setValue, id]);

  useEffect(() => {
    const fetchStaffInBranch = async () => {
      try {
        if (account && account.branchId) {
          const response = await axiosService.get(
            `/staff/${account?.branchId._id}`
          );
          setStaffList(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaffInBranch();
  }, [account, account.branchId]);

  const submitHandler = async (userData) => {
    try {
      await axiosService.patch(`accounts/${id}/details`, userData);
      toast.success('Profile updated successfully!');
      history.push(`/admin/customer/${account.userId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
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
        <Card>
          <BackButton />
          <Flex w={{ base: '100%', md: '50%' }} mx="auto" mt="26px">
            <form
              className="update-form"
              onSubmit={handleSubmit(submitHandler)}
            >
              <FormControl>
                <FormLabel pt={3}>First Name</FormLabel>
                <Input
                  color={textColor}
                  {...register('firstName')}
                  placeholder="First Name"
                  defaultValue={account?.firstName}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Last Name</FormLabel>
                <Input
                  color={textColor}
                  {...register('lastName')}
                  placeholder="Last Name"
                  defaultValue={account?.lastName}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Phone Number</FormLabel>
                <Input
                  color={textColor}
                  {...register('phoneNumber')}
                  placeholder="Phone Number"
                  defaultValue={account?.phoneNumber}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel
                  htmlFor="accountManagerId"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Account Manager
                </FormLabel>
                <Select
                  color={textColor}
                  {...register('accountManagerId')}
                  name="accountManagerId"
                  defaultValue={account?.accountManagerId?._id}
                >
                  <option value="" disabled>
                    Select Account Manager
                  </option>
                  {staffList &&
                    staffList.map((staff) => (
                      <option key={staff.staffId?.id} value={staff.staffId?.id}>
                        {staff.staffId?.firstName} {staff.staffId?.lastName}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel
                  htmlFor="branchId"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Branch
                </FormLabel>

                <Select
                  color={textColor}
                  {...register('branchId')}
                  name="branchId"
                  defaultValue={account?.branchId?.name}
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
