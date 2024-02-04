import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
  useColorModeValue,
  InputGroup,
  Textarea,
} from '@chakra-ui/react';
import CustomSelect from 'components/dataDispaly/CustomSelect';
import { useForm, Controller } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';

const DsChargesModal = ({ isOpen, onClose, packages }) => {
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  // Handle form submission
  const onSubmit = async (chargeData) => {
    try {
      setLoading(true);

      const selectedPackage = packages.find(
        (dsPackage) => dsPackage.id === chargeData.packageId.value
      );

      const chargeDetails = {
        ...chargeData,
        packageId: chargeData.packageId.value,
        userId: selectedPackage.userId,
      };
      await axiosService.post('/charge/ds', chargeDetails);

      toast.success('Charges saved successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Failed to save charges. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Charges</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns="1fr" gap={4}>
              <FormControl isRequired>
                <FormLabel
                  htmlFor="packageId"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Select To Package
                </FormLabel>
                <Controller
                  name="packageId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      options={packages.map((dsPackage) => ({
                        value: dsPackage.id,
                        label: dsPackage.target,
                      }))}
                      placeholder="Select a package"
                      onChange={(selectedOption) => {
                        setValue('packageId', selectedOption);
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl isInvalid={errors.chargeAmount}>
                <FormLabel
                  htmlFor="amount"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="4px"
                >
                  Charge Amount<Text color={brandStars}>*</Text>
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
                  bg="transparent"
                  color="secondaryGray.600"
                  {...register('amount', {
                    required: 'Charge amount is required',
                    min: {
                      value: 0,
                      message:
                        'Charge amount must be greater than or equal to 0',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.amount && errors.amount.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.reasons}>
                <FormLabel
                  htmlFor="reasons"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                  mt="10px"
                >
                  Reasons<Text>*</Text>
                </FormLabel>
                <InputGroup>
                  <Textarea
                    type="text"
                    placeholder="Enter reasons"
                    {...register('reasons', {
                      required: 'Reason is required',
                    })}
                  />
                </InputGroup>
              </FormControl>
            </Grid>

            <Button
              mt={4}
              colorScheme="green"
              variant="solid"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isSubmitting || loading}
            >
              Save Charges
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DsChargesModal;
