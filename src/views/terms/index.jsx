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
  OrderedList,
} from '@chakra-ui/react';

const TermsOfService = () => {
  const lastUpdated = 'February 19, 2025';

  return (
    <Container maxW="4xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          Terms of Service
        </Heading>

        <Text color="gray.600">Last Updated: {lastUpdated}</Text>

        <Text>
          Welcome to SureBank. By accessing or using our services, including our
          website, mobile applications, and WhatsApp Business channel, you agree
          to be bound by these Terms of Service.
        </Text>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            1. Definitions
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              <Text fontWeight="semibold">"SureBank," "we," "us," "our"</Text>
              <Text>
                Refers to SureBank Limited and all its affiliated services.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">"Service," "Services"</Text>
              <Text>
                Our savings packages, financial services, and all related
                features.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">"User," "you," "your"</Text>
              <Text>Any individual or entity using our Services.</Text>
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            2. Savings Services
          </Heading>
          <OrderedList spacing={3} pl={4}>
            <ListItem>
              <Text fontWeight="semibold">Package Creation</Text>
              <Text>
                Users can create savings packages with specific goals and
                timelines. Each package must comply with our minimum and maximum
                contribution limits.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">Daily Contributions</Text>
              <Text>
                Contributions must be made through authorized SureBank agents.
                We are not responsible for payments made to unauthorized
                individuals.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="semibold">Withdrawals</Text>
              <Text>
                Withdrawals are subject to the terms of your specific savings
                package and must be processed through official channels.
              </Text>
            </ListItem>
          </OrderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            3. WhatsApp Business Service
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              Users agree to receive transactional and service messages through
              WhatsApp
            </ListItem>
            <ListItem>
              Response times may vary based on operating hours and service load
            </ListItem>
            <ListItem>
              Users must not share sensitive account information through
              WhatsApp
            </ListItem>
            <ListItem>
              WhatsApp communications are supplementary and not the primary
              method of account management
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            4. User Responsibilities
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              Maintain accurate and up-to-date personal information
            </ListItem>
            <ListItem>
              Protect account credentials and not share them with others
            </ListItem>
            <ListItem>
              Report any unauthorized account activity immediately
            </ListItem>
            <ListItem>
              Make contributions only through authorized channels
            </ListItem>
            <ListItem>Comply with all applicable laws and regulations</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            5. Product Purchase Terms
          </Heading>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              Products can be purchased through accumulated savings
            </ListItem>
            <ListItem>Product availability is subject to stock levels</ListItem>
            <ListItem>Prices are subject to change without notice</ListItem>
            <ListItem>
              Delivery terms vary by location and product type
            </ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            6. Limitation of Liability
          </Heading>
          <Text mb={4}>SureBank is not liable for:</Text>
          <UnorderedList spacing={3} pl={4}>
            <ListItem>
              Losses resulting from unauthorized transactions where you
              compromised your account security
            </ListItem>
            <ListItem>
              Service interruptions due to technical issues or maintenance
            </ListItem>
            <ListItem>Losses due to force majeure events</ListItem>
          </UnorderedList>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            7. Termination
          </Heading>
          <Text>
            We reserve the right to terminate or suspend services to any user
            for:
          </Text>
          <UnorderedList spacing={3} pl={4} mt={4}>
            <ListItem>Violation of these terms</ListItem>
            <ListItem>Suspicious or fraudulent activity</ListItem>
            <ListItem>Non-compliance with KYC requirements</ListItem>
            <ListItem>Any other reason we deem appropriate</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            8. Contact Information
          </Heading>
          <Text>For questions about these terms, contact us at:</Text>
          <UnorderedList spacing={3} pl={4} mt={4}>
            <ListItem>WhatsApp: +234 803 131 3024</ListItem>
            <ListItem>Email: support@surebankltd.com</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Text color="gray.600" fontSize="sm">
            These terms of service may be updated periodically. Continued use of
            our services constitutes acceptance of any changes.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default TermsOfService;
