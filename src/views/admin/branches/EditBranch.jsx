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
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';

export default function EditBranch() {
  const [branch, setBranch] = useState(null);
  const [staffs, setStaffs] = useState(null);
  const history = useHistory();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm();

  const fetchStaffs = async () => {
    try {
      const response = await axiosService.get(`/branch/staff`);
      setStaffs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    // Extract the id from the query parameters in the URL
    const fetchBranch = async () => {
      try {
        const response = await axiosService.get(`branch/${id}`);
        setBranch(response.data);
        setValue('name', response.data.name);
        setValue('address', response.data.address);
        setValue('email', response.data.email);
        setValue('phoneNumber', response.data.phoneNumber);
        setValue('manager', response.data.manager);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranch();
  }, [setValue, id]);

  const submitHandler = async (userData) => {
    try {
      const response = await axiosService.patch(`branch/${id}`, userData);
      toast.success('Branch updated successfully!');
      setBranch(response.data);
      history.push(`/admin/branches`);
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
          <Flex>
            <BackButton />
          </Flex>
          <Flex w={{ base: '100%', md: '50%' }} mx="auto" mt="26px">
            <form
              className="update-form"
              onSubmit={handleSubmit(submitHandler)}
            >
              <FormControl>
                <FormLabel pt={3}>Branch Name</FormLabel>
                <Input
                  {...register('name')}
                  placeholder="Branch Name"
                  defaultValue={branch?.firstName || ''}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register('email')}
                  placeholder="Email"
                  defaultValue={branch?.email || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Address</FormLabel>
                <Input
                  {...register('address')}
                  placeholder="Address"
                  defaultValue={branch?.address || ''}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phoneNumber')}
                  placeholder="Phone Number"
                  defaultValue={branch?.phoneNumber || ''}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Manager</FormLabel>

                <Select
                  {...register('manager')}
                  name="manager"
                  defaultValue={branch?.manager}
                >
                  <option value="" disabled>
                    Select a staff
                  </option>
                  {staffs &&
                    staffs.map((staff) => (
                      <option
                        key={staff.id}
                        value={`${staff.staffId?.firstName} ${staff.staffId?.lastName}`}
                      >
                        {staff.staffId?.firstName} {staff.staffId?.lastName}
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
