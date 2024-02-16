import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Link,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

const AccountDetails = ({ customerData }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Function to handle copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    const textField = document.createElement('textarea');
    textField.innerText = customerData.accountNumber;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }, [customerData.accountNumber]);

  const handleShowUserDetails = () => {
    setShowUserDetails((prevShowUserDetails) => !prevShowUserDetails);
  };

  return (
    <>
      <Link onClick={handleShowUserDetails}>
        {showUserDetails ? 'Hide Details' : 'Show Details'}
      </Link>

      {showUserDetails && customerData && (
        <Flex
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: '4', md: '0' }}
          justifyContent={{ base: 'center', md: 'space-between' }}
        >
          <Flex alignItems="center" mt="4">
            <Box px={6} py={2}>
              <Grid templateColumns="repeat(1fr)" gap={1}>
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                  Account Name: {customerData?.firstName} {customerData?.lastName}
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                  Account Number: {customerData.accountNumber}
                  <Button size="sm" onClick={handleCopyToClipboard}>
                    {isCopied ? 'Copied!' : <FaCopy />}
                  </Button>
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                  Account Type: {customerData.accountType}
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                  Branch: {customerData.branchId?.name}
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                  Account Manager: {customerData.accountManagerId?.firstName}{' '}
                  {customerData.accountManagerId?.lastName}
                </Text>
              </Grid>
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default AccountDetails;
