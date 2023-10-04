import React from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const BackButton = () => {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <Flex>
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Go back"
        size="lg"
        onClick={handleGoBack}
        mb={4}
      />
    </Flex>
  );
};

export default BackButton;
