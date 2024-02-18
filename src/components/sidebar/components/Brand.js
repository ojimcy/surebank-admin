import React from "react";

// Chakra imports
import { Flex, Image } from '@chakra-ui/react';

// Custom components
import { HSeparator } from "components/separator/Separator";

import sbLogo from 'assets/img/logo.png';

export function SidebarBrand() {
  //   Chakra color mode

  return (
    <Flex align="center" direction="column">
      <Image src={sbLogo} alt="Surebank LTD" h="106px" mb="15px" />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
