import {
    Box, Button,
    Code, Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper, SimpleGrid,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack, Spacer,
    Stack,
    Switch,
    Text,
    Tooltip,
    VStack
} from "@chakra-ui/react";
import RandomImage from "../RandomImage";
import EthereumQRCode from "../EthereumQRCode";
import React from "react";
import '@fontsource/roboto-mono';
import {ArrowForwardIcon, ArrowRightIcon} from "@chakra-ui/icons";


const Publisher = () => {
    const defaultRoyalty = 1.5
    const [royaltyValue, setRoyaltyValue] = React.useState(defaultRoyalty)
    const handleRoyaltyChange = (value) => setRoyaltyValue(value)

    return (
        <Flex h="100%" flexDirection={"column"} mb={"30"}>
            <Box mb={12}>
                <SimpleGrid columns={[1,2]} spacing={12}>

                    {/* row 1 */}
                    <FormControl id="floor-price">
                        <FormLabel>Floor Price</FormLabel>
                        <InputGroup size={"md"}>
                            <Input id={"floor-price"} placeholder={"0.01"}/>
                            <InputRightAddon>ETH</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>The lowest price you will accept for an edition of this work.</FormHelperText>
                    </FormControl>

                    <FormControl id={"royalty"}>
                        <FormLabel>Royalty (%)</FormLabel>
                        <Flex>
                            <NumberInput
                                step={0.1}
                                precision={1}
                                min={0}
                                max={99.9}
                                maxW="100px"
                                mr="2rem"
                                value={royaltyValue}
                                onChange={handleRoyaltyChange}
                            >
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <FormHelperText>The percentage of the price that you will receive for the sale of this work</FormHelperText>
                    </FormControl>

                    {/* row 2 */}
                    <FormControl id="allow-forks">
                        <FormLabel>Allow Forks?</FormLabel>
                        <Switch id={"allow-forks"}/>
                        <FormHelperText>Enable this if you want to allow others to create derivatives of this work.</FormHelperText>
                    </FormControl>

                    <FormControl id="fork-fee">
                        <FormLabel>Forking Fee</FormLabel>
                        <InputGroup size={"md"}>
                            <Input id={"fork-fee"} placeholder={"0.50"}/>
                            <InputRightAddon>ETH</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>A one-time fee you collect when someone forks this work.</FormHelperText>
                    </FormControl>

                </SimpleGrid>
            </Box>

            <Spacer/>

            <Box textAlign={"center"} mb={5}>
                <Button key={"publish-btn"} colorScheme={"cyan"} rightIcon={(<ArrowForwardIcon/>)}>Publish</Button>
            </Box>

            {/*<Box borderWidth="1px" borderRadius="lg">*/}
            {/*    <HStack alignItems={"top"}>*/}

            {/*        <EthereumQRCode width="80px" value={1} gas={1300} to={"0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"} />*/}

            {/*        <Box>*/}
            {/*            <Box d="flex" alignItems={"baseline"}>*/}
            {/*                <Text fontFamily={"Roboto Mono"}>{addr}</Text>*/}
            {/*                <Tooltip label={(hasCopied ? "copied!" : "copy")} closeDelay={500}>*/}
            {/*                    <IconButton*/}
            {/*                        onClick={onCopy}*/}
            {/*                        ml={1}*/}
            {/*                        icon={(<CopyIcon/>)}*/}
            {/*                        size={"xs"}*/}
            {/*                        aria-label={"copy contract address"}*/}
            {/*                    />*/}
            {/*                </Tooltip>*/}
            {/*            </Box>*/}

            {/*        </Box>*/}
            {/*    </HStack>*/}
            {/*</Box>*/}
        </Flex>
    )
}

export default Publisher