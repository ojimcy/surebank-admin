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
import axiosService from 'utils/axiosService';
const BuyModal = ({ isOpen, onClose, packageData }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLengthToShowButton = 100;

  // Access the app context
  const { setSelectedPackage } = useAppContext();

  // Function to add the product to the cart
  const addToCart = async (packageData) => {
    try {
      const { product } = packageData;
      const { productCatalogueId, sellingPrice } = product;

      await axiosService.post('/cart', {
        productCatalogueId,
        sellingPrice,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      await addToCart(packageData);
      setSelectedPackage(packageData);

      history.push('/admin/order/placeorder');
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
              <Text>Quantity: 1</Text>

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
            onClick={handleAddToCart}
          >
            Proceed
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BuyModal;
