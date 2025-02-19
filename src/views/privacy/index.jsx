import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
} from '@chakra-ui/react';

const PrivacyPolicy = () => {
const lastUpdated = 'February 19, 2025'; // Update this as needed

  return (
    <Container maxW="4xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          Privacy Policy
        </Heading>

        <Text color="gray.600">Last Updated: {lastUpdated}</Text>

        <Text>
          Welcome to SureBank. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our services,
          including our WhatsApp Business integration.
        </Text>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Information We Collect
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              <Text fontWeight="semibold">Personal Information:</Text>
              <Text>
                Name, phone number, email address, and other contact details you
                provide.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">Financial Information:</Text>
              <Text>
                Transaction history, account balances, and savings package
                details.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">WhatsApp Communication:</Text>
              <Text>
                Messages, media, and information shared through our WhatsApp
                Business channel.
              </Text>
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            How We Use Your Information
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              Provide and maintain our savings and financial services
            </ListItem>
            <ListItem>
              Process your transactions and maintain your accounts
            </ListItem>
            <ListItem>
              Send important updates about your accounts and services
            </ListItem>
            <ListItem>Communicate with you through WhatsApp Business</ListItem>
            <ListItem>Improve our services and customer experience</ListItem>
            <ListItem>Comply with legal obligations</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            WhatsApp Business Integration
          </Heading>
          <Text mb={4}>
            By using our WhatsApp Business service, you agree that:
          </Text>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              We may send you messages through WhatsApp regarding your accounts,
              transactions, and services
            </ListItem>
            <ListItem>
              Your WhatsApp number will be used to provide customer support and
              service updates
            </ListItem>
            <ListItem>
              Messages exchanged via WhatsApp are subject to WhatsApp's own
              privacy policy and terms of service
            </ListItem>
            <ListItem>
              You can opt-out of WhatsApp communications at any time
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Data Security
          </Heading>
          <Text mb={4}>
            We implement appropriate security measures to protect your
            information:
          </Text>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>Encryption of sensitive data</ListItem>
            <ListItem>Secure servers and databases</ListItem>
            <ListItem>Regular security audits and updates</ListItem>
            <ListItem>Strict access controls for staff</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Your Rights
          </Heading>
          <Text mb={4}>You have the right to:</Text>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>Access your personal information</ListItem>
            <ListItem>Correct inaccurate information</ListItem>
            <ListItem>Request deletion of your information</ListItem>
            <ListItem>Opt-out of marketing communications</ListItem>
            <ListItem>Withdraw consent for WhatsApp communications</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Contact Us
          </Heading>
          <Text>
            If you have any questions about this Privacy Policy or our
            practices, please contact us at:
          </Text>
          <UnorderedList spacing={3} pl={4} mt={4}>
            <ListItem>WhatsApp: +234 803 131 3024</ListItem>
            <ListItem>Email: support@surebankltd.com</ListItem>
            <ListItem>Address: [Your Business Address]</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Text color="gray.600" fontSize="sm">
            This privacy policy is subject to change. We will notify you of any
            material changes through our website or other appropriate means.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPolicy;
