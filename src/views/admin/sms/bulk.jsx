// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  InputGroup,
  Select,
  Text,
  Textarea,
  Radio,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from 'contexts/AppContext';

// Assets
import Card from 'components/card/Card.js';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';

export default function BulkSms() {
  const history = useHistory();
  const { branches } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    accountType: '',
    branch: '',
  });

  const handleSubmit = async () => {
    const { accountType, branch } = selectedOption;
    try {
      setLoading(true);
      if (!accountType && !branch) {
        await axiosService.post('/sms', { message });
      } else if (accountType) {
        await axiosService.post(`/sms?accountType=${accountType}`, {
          message,
        });
      } else if (branch) {
        await axiosService.post(`/sms?branchId=${branch}`, {
          message,
        });
      }
      toast.success('SMS sent successfully!');
      history.push('/admin/customers');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (field, value) => {
    setSelectedOption((prev) => ({ ...prev, [field]: value }));
  };

  const handleGroupChange = (value) => {
    setSelectedOption({ group: value, accountType: '', branch: '' });
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
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <BackButton />
          <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
            Send Bulk SMS
          </Text>
          <Flex flexDirection="row">
            <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
              <Text mb="2">Select Group:</Text>
              <Flex mb="4">
                <Radio
                  value="accountType"
                  isChecked={selectedOption.group === 'accountType'}
                  onChange={() => handleGroupChange('accountType')}
                  marginRight="4"
                >
                  Customers
                </Radio>
                <Radio
                  value="branch"
                  isChecked={selectedOption.group === 'branch'}
                  onChange={() => handleGroupChange('branch')}
                >
                  Branch
                </Radio>
              </Flex>

              {selectedOption.group === 'accountType' && (
                <Select
                  value={selectedOption.accountType}
                  onChange={(e) =>
                    handleSelectChange('accountType', e.target.value)
                  }
                >
                  <option value="">Select Receivers</option>
                  <option value="">All Customers</option>
                  <option value="ds">DS Customers</option>
                  <option value="sb">SB Customers</option>
                </Select>
              )}

              {selectedOption.group === 'branch' && (
                <Select
                  value={selectedOption.branch}
                  onChange={(e) => handleSelectChange('branch', e.target.value)}
                >
                  <option>Select Branch</option>
                  {branches &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch?.name}
                      </option>
                    ))}
                </Select>
              )}
            </Box>
          </Flex>

          <Flex flexDirection="row">
            <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
              <InputGroup>
                <Textarea
                  type="text"
                  mt="24px"
                  placeholder="Enter Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </InputGroup>
            </Box>
          </Flex>
          <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
            <Button
              colorScheme="green"
              variant="solid"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Depositting"
            >
              Send
            </Button>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
