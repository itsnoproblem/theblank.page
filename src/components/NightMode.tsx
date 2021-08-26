import { MoonIcon } from '@chakra-ui/icons'
import { Button, useColorModeValue, useColorMode } from '@chakra-ui/react'
import React from "react";

export default function NightMode() {
    const { toggleColorMode } = useColorMode();
    const bgColor = useColorModeValue("blue.700", "black");
    const bgColorHover = useColorModeValue("blue.500", "gray.500");
    const borderColor = useColorModeValue("blue.500", "gray.500");
    const color = useColorModeValue("blue.50", "gray.500");
    const colorHover = useColorModeValue("gray.500", "blue.50");

    return(
        <>
            <Button backgroundColor={bgColor}
                    mr={6}
                    color={color}
                    border={0}
                    borderColor={borderColor}
                    _hover={{
                        background: {bgColorHover},
                        color: {colorHover},
                        border: 0
                    }}
                    cursor={"pointer"}
                    onClick={toggleColorMode}
            ><MoonIcon/></Button>
        </>
    )
}