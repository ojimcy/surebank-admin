import React, { useState } from 'react';
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
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalHeader,
} from '@chakra-ui/react';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom/';
import { useAppContext } from 'contexts/AppContext';

export default function CreatePackage() {
  const history = useHistory();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const [target, setTarget] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState('');

  const [targetOptions, setTargetOptions] = useState([
    'School Fees',
    'House Rent',
    'Building Projects',
    'Shop Rent',
    'Donations',
    'Staff Salaries',
    'Enter custom target',
  ]);

  const handleCustomTargetSubmit = () => {
    if (customTargetInput) {
      // Update the select field's options array
      setTargetOptions([...targetOptions, customTargetInput]);

      // Update the select field's value
      setValue('target', customTargetInput);

      setTarget(customTargetInput);
      setCustomTargetInput('');
      setShowModal(false);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const { customerData } = useAppContext();

  // Handle form submission
  const onSubmit = async (packageData) => {
    try {
      await axiosService.post(`/daily-savings/package`, packageData);
      toast.success('Package created successfully!');
      history.push(`/admin/customer/${customerData.userId}`);
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
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
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
                    defaultValue={customerData?.accountNumber}
                    {...register('accountNumber', {
                      required: 'Account number is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.accountNumber && errors.accountNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel
                    htmlFor="predefinedTarget"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Select Target
                  </FormLabel>
                  <Select
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    id="target"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    value={target}
                    {...register('target', {
                      required: 'Target is required',
                    })}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === 'custom') {
                        setShowModal(true);
                      } else {
                        setTarget(selectedValue);
                      }
                    }}
                  >
                    {targetOptions.map((targetOption) => (
                      <option key={targetOption} value={targetOption}>
                        {targetOption}
                      </option>
                    ))}
                    <option value="custom">Add Custom Target</option>
                  </Select>
                </FormControl>
                <FormControl isInvalid={errors.amountPerDay}>
                  <FormLabel
                    htmlFor="amountPerDay"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Amount Per Day<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="amountPerDay"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('amountPerDay', {
                      required: 'Amount is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.amountPerDay && errors.amountPerDay.message}
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
                    Save
                  </Button>
                </Box>
              </form>
            </Box>
          </Center>
        </Flex>
      </Grid>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Custom Target</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                id="customTarget"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={customTargetInput}
                onChange={(e) => setCustomTargetInput(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCustomTargetSubmit}>
                Add
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
