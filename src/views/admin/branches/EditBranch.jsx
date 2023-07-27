import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useForm } from "react-hook-form";
import axiosService from "utils/axiosService";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditBranch() {
  const [branch, setBranch] = useState(null);
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
        const response = await axiosService.get(`branch/${id}`);
        setBranch(response.data);
        setValue("name", response.data.name);
        setValue("address", response.data.address);
        setValue("email", response.data.email);
        setValue("phone", response.data.phone);
        setValue("manager", response.data.manager);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [setValue, id]);
  const submitHandler = async (userData) => {
    try {
      console.log(userData);
      const response = await axiosService.patch(`branch/${id}`, userData);
      toast.success("Branch updated successfully!");
      setBranch(response.data);
      // history.push(`/admin/user/${id}`);
      history.push(`/admin/branches`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "3.96fr",
        }}
        templateRows={{
          base: "repeat(1, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Card>
          <Flex w="50%" mx="auto" mt="26px">
            <form
              className="update-form"
              onSubmit={handleSubmit(submitHandler)}
            >
              <FormControl>
                <FormLabel pt={3}>Branch Name</FormLabel>
                <Input
                  {...register("name")}
                  placeholder="Branch Name"
                  defaultValue={branch?.firstName || ""}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register("email")}
                  placeholder="Email"
                  defaultValue={branch?.email || ""}
                />
              </FormControl>

              <FormControl>
                <FormLabel pt={3}>Address</FormLabel>
                <Input
                  {...register("address")}
                  placeholder="Address"
                  defaultValue={branch?.address || ""}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register("phone")}
                  placeholder="Phone Number"
                  defaultValue={branch?.phone || ""}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Manager</FormLabel>
                <Input
                  {...register("manager")}
                  placeholder="Manager"
                  defaultValue={branch?.manager || ""}
                />
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
