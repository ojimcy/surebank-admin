import React, { useState } from 'react';
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';
import { useHistory } from 'react-router-dom';
const BuyModal = ({ isOpen, onClose, packageData }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLengthToShowButton = 100;

  // Access the app context
  const { setSelectedPackage } = useAppContext();

  const handleCheckout = async () => {
    try {
      setLoading(true);

      setSelectedPackage(packageData);

      history.push('/admin/order/shipping');
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {packageData && (
            <VStack spacing={4}>
              <Text>Product: {packageData.product.name}</Text>
              <Text>
                Price: {formatNaira(packageData.product.sellingPrice)}
              </Text>

              {packageData.product.description && (
                <>
                  <Text>
                    Description:{' '}
                    {showFullDescription
                      ? packageData.product.description
                      : packageData.product.description.slice(
                          0,
                          maxDescriptionLengthToShowButton
                        )}
                  </Text>
                  {packageData.product.description.length >
                    maxDescriptionLengthToShowButton &&
                    '...' +
                    (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {showFullDescription ? 'Collapse' : 'View All'}
                      </Button>
                    )}
                </>
              )}
            </VStack>
          )}

          <Button
            mt={4}
            colorScheme="green"
            variant="solid"
            w="100%"
            h="50"
            mb="24px"
            isLoading={loading}
            onClick={handleCheckout} // Call the handleCheckout function on button click
          >
            Checkout
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BuyModal;
