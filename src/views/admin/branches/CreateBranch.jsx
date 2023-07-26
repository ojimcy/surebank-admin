// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Card from "components/card/Card";
import axiosService from "utils/axiosService";

export default function Settings() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [manager, setManager] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const submitBranch = async (e) => {
    e.preventDefault();
    try {
      const branchDetail = {
        name,
        address,
        phone,
        email,
        manager,
      };
      const { data } = await axiosService.post("/branch/create", branchDetail);
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setManager("");
      if (!data.success) {
        setMessage(data.message);
        setIsError(true);
        return;
      } else {
        setMessage(name + " branch Successfully Created");
        setIsError(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Chakra Color Mode
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Card p={{ base: "30px", md: "30px", sm: "10px" }}>
        <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
          Create Branch
        </Text>
        <FormLabel color={isError ? "red" : "green"}>{message}</FormLabel>{" "}
        <form onSubmit={submitBranch}>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl>
                <FormLabel>Branch Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Box>
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </FormControl>
            </Box>
          </Flex>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Box>
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl>
                <FormLabel>Branch Address</FormLabel>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Box>
          </Flex>
          <Flex
            gap="20px"
            marginBottom="20px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box width={{ base: "50%", md: "50%", sm: "100%" }}>
              <FormControl>
                <FormLabel>Branch Manager</FormLabel>
                <Input
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  type="text"
                  required
                />
              </FormControl>
            </Box>
          </Flex>

          <Flex marginTop="30">
            <Spacer />
            <Button bgColor="blue.700" color="white" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
