import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import ReactSelect from 'react-select';
import { useForm, Controller } from 'react-hook-form';

const MergePackageModal = ({ isOpen, onClose, packages, onMerge }) => {
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    control,
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    onMerge(data.fromPackage.value, data.toPackage.value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Merge Packages</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired>
              <FormLabel
                htmlFor="fromPackage"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Select From package
              </FormLabel>
              <Controller
                name="fromPackage"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={packages.map((sbPackage) => ({
                      value: sbPackage._id,
                      label: sbPackage.product.name,
                    }))}
                    placeholder="Select a package"
                  />
                )}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                htmlFor="toPackage"
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
                name="toPackage"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={packages.map((sbPackage) => ({
                      value: sbPackage._id,
                      label: sbPackage.product.name,
                    }))}
                    placeholder="Select a package"
                  />
                )}
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              variant="solid"
              w="100%"
              h="50"
              type="submit"
            >
              Merge
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MergePackageModal;
