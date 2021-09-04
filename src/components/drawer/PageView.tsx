import {
    Button,
    FormControl,
    Input,
    FormLabel,
    FormHelperText,
    Box,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import React from "react";

export default function PageView() {
    const  onClose = () => {
        console.log("boop");
    }

    return(
        <>
            <Box p={4}>
                <FormControl id="title">
                    <FormLabel>Title</FormLabel>
                    <Input type="text" />
                    {/*<FormHelperText>We'll never share your email.</FormHelperText>*/}
                </FormControl>
            </Box>

            <Box p={4}>
                <Stat>
                    {/*<StatLabel>Last modified</StatLabel>*/}
                    <StatNumber>20/April/2021</StatNumber>
                    <StatHelpText>Last modified</StatHelpText>
                </Stat>
            </Box>

            <Box p={4}>
                <Stat>
                    <StatLabel>Stat label</StatLabel>
                    <StatNumber>Stat number</StatNumber>
                    <StatHelpText>Stat helper text</StatHelpText>
                </Stat>
            </Box>

            <Box p={4}>
                <FormControl>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue">Save</Button>
                </FormControl>
            </Box>
        </>
    )
}