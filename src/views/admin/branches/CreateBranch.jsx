// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Card from "components/card/Card";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axiosService from "utils/axiosService";

export default function CreateBranch() {
  const history = useHistory();
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const textColor = useColorModeValue("navy.700", "white");
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (branchData) => {
    try {
      await axiosService.post(`/branch`, branchData);
      toast.success("Branch has been created successfully!");
      history.push("/admin/branches");
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
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Card p={{ base: "30px", md: "30px", sm: "10px" }}>
        <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
          Create Branch
        </Text>
        {/* <FormLabel color={isError ? "red" : "green"}>{message}</FormLabel>{" "} */}
        <form onSubmit={handleSubmit(submitHandler)}>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl isInvalid={errors.name}>
                <FormLabel
                  htmlFor="name"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Branch Name<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  id="name"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register("name", {
                    required: "name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl isInvalid={errors.email}>
                <FormLabel
                  htmlFor="email"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Branch Email<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  id="email"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register("email", {
                    required: "email is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl isInvalid={errors.phone}>
                <FormLabel
                  htmlFor="phone"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Branch Phone Number<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  id="phone"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register("phone", {
                    required: "phone is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl isInvalid={errors.address}>
                <FormLabel
                  htmlFor="address"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Branch Adress<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  id="address"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register("address", {
                    required: "address is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.address && errors.address.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl isInvalid={errors.manager}>
                <FormLabel
                  htmlFor="manager"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Branch Manager<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="text"
                  id="manager"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register("manager", {
                    required: "manager is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.manager && errors.manager.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>

          <Flex marginTop="30">
            <Spacer />
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
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
