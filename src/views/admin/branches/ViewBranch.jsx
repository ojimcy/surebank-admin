import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Spinner,
  Text,
} from "@chakra-ui/react";

// Custom components

// Assets
import axiosService from "utils/axiosService";
import BackButton from "components/menu/BackButton";

export default function User() {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchInfo, setBranchInfo] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(`branch/${id}`);
        setBranch(response.data);

        // Fetch branch information using the branchId
        if (response.data.branchId) {
          const branchResponse = await axiosService.get(
            `branch/${response.data.branchId}`
          );
          setBranchInfo(branchResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  return (
    <Box>
      {loading ? (
        <Box
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
          <BackButton />
          <Grid
            mb="20px"
            gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
            gap={{ base: "20px", xl: "20px" }}
            display={{ base: "block", xl: "grid" }}
          >
            <Flex
              flexDirection="column"
              gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
            >
              <Center py={6}>
                <Box
                  w={{ base: "90%", md: "80%" }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                >
                  {branch && (
                    <Flex alignItems="center">
                      <Avatar
                        size="xl"
                        name={branch.name || ""}
                        src={branch.avatarUrl || ""}
                        m={4}
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">Branch Name</Text>
                          <Text>{branch.name}</Text>
                          <Text fontWeight="bold">Email:</Text>
                          <Text>{branch.email}</Text>
                          <Text fontWeight="bold">Phone Number:</Text>
                          <Text>{branch.phone}</Text>
                          <Text fontWeight="bold">Address:</Text>
                          <Text>{branch.address}</Text>
                          <Text fontWeight="bold">Manager:</Text>
                          <Text>{branch.manager}</Text>
                        </Grid>
                        <NavLink to={`/admin/branch/editbranch/${id}`}>
                          <Button mt={4} colorScheme="blue" size="md">
                            Edit Branch
                          </Button>
                        </NavLink>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
