import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    SimpleGrid,
    Spacer,
    Spinner,
    Switch,
    Text
} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import '@fontsource/roboto-mono';
import {ArrowForwardIcon} from "@chakra-ui/icons";
import {EditorContext} from "../../editor-context";
import BPageService from "../../services/BPageService";
import env from 'react-dotenv';
import {useEthers} from "@usedapp/core";
import {Contract} from "@ethersproject/contracts";

type Props = {
    changeTab: any
}
const Publisher = ({changeTab}: Props) => {
    const STATE_DEFAULT = 0;
    const STATE_PUBLISHING = 1;
    const STATE_WAITING = 2;

    const defaultRoyalty = 1.5;
    const defaultForkingFee = 1.0;
    const solidityContract = require('../../build/contracts/TheBlankPage.json');

    const {library, account} = useEthers();
    const [isPublishing, setIsPublishing] = useState(false);
    const [royaltyValue, setRoyaltyValue] = useState(defaultRoyalty);
    const [maxMintable, setMaxMintable] = useState(100);
    const [allowForks, setAllowForks] = useState(false);
    const [limitedEdition, setLimitedEdition] = useState(false);
    const [forkingFee, setForkingFee] = useState(defaultForkingFee);
    const [publishingState, setPublishingState] = useState(STATE_DEFAULT);
    const {page, setPage} = useContext(EditorContext);
    const nftAddress = '0xBb742e6a6460998d0dC29b33184E274Ef661583c'; // rinkeby
    const nftContract = new Contract(nftAddress, JSON.stringify(solidityContract.abi), library?.getSigner());

    const handleRoyaltyChange = (value) => setRoyaltyValue(value);
    const handleMaxMintableChange = (value) => setMaxMintable(value);
    const handleForkingFeeChange = (value) => {
        setForkingFee(value);
    }
    const handleAllowForksChange = (value) => {
        console.log("allow forks", value)
        setAllowForks(value)
    };
    const handleLimitedEditionChange = (value) => {
        console.log("limitedEdition", value)
        setLimitedEdition(value)
    };

    const handleClickPublish = () => {
        setIsPublishing(true);
        const pinataSDK = require('@pinata/sdk');
        const pinata = pinataSDK(env.PINATA_API_KEY, env.PINATA_API_SECRET);

        const metadata = {
            name: page.title,
            image: '',
            page: page,
            traits: [
                {
                    "display_type": "date",
                    "trait_type": "Publish Date",
                    "value": new Date(page.modified).getTime(),
                }
            ]
        };

        if (page._ipfsHashImage) {
            metadata.image = `ipfs://` + page._ipfsHashImage;
        }

        const options = {
            pinataMetadata: {
                name: page.title,
                keyvalues: {
                    type: "TBP Metadata",
                    version: 1.0,
                    title: page.title.toString(),
                    id: page.id.toString(),
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        pinata.pinJSONToIPFS(metadata, options).then((result: { IpfsHash: string | undefined; }) => {
            console.log(result);
            page._ipfsHashMetadata = result.IpfsHash;
            setPage(page);
            BPageService.update(account, page);

            const args = {
                recipient: account,
                hash: page._ipfsHashMetadata,
                metadata: `ipfs://${page._ipfsHashMetadata}`
            };
            console.log("about to mint", args);
            setPublishingState(STATE_PUBLISHING);

            //
            // MINT
            //
            if(library !== undefined) {

                nftContract.newPage(account, page._ipfsHashMetadata, page._ipfsHashMetadata).then(async (response) => {
                    console.log("minted", response);
                    setPublishingState(STATE_WAITING);

                    nftContract.on('TokenID', (value, event) => {
                        console.log("caught event", value, event);
                        page._tokenId = value.toNumber();
                        page._transactionHash = response.hash;
                        page._contract = nftAddress;
                        setPage(page);
                        BPageService.update(account, page);

                        setPublishingState(STATE_DEFAULT);
                        setIsPublishing(false);
                        changeTab(1);
                    });

                    await response.wait();
                    setPublishingState(STATE_DEFAULT);

                }).catch((reason) => {
                    console.log("mint failed", reason);
                    setPublishingState(STATE_DEFAULT);
                    setIsPublishing(false);
                });
            }
            else {
                console.log("LIBRARY WAS UNDEFINED");
                setPublishingState(STATE_DEFAULT);
                setIsPublishing(false);
            }

        }).catch((err) => {
            console.log(err);
            setPublishingState(STATE_DEFAULT);
            setIsPublishing(false);
        });
    };

    const publishStatus = (state: number) => {
        switch (state) {
            case STATE_PUBLISHING:
                return "publishing to network...";
            case STATE_WAITING:
                return "waiting for confirmations...";
            default:
                return "";
        }
    }

    return (
        <Flex h="100%" flexDirection={"column"} mb={"30"}>
            <Box>
                <Text fontSize={"4xl"} lineHeight={"1.1em"}>{page.title}</Text>
                <Divider mb={6} mt={2}/>
            </Box>
            <Box mb={12}>
                <SimpleGrid columns={[1,2]} spacing={12}>

                    {/* floor price */}
                    <FormControl id="floor-price" isRequired={true}>
                        <FormLabel>Floor Price</FormLabel>
                        <InputGroup size={"md"}>
                            <Input id={"floor-price"}
                                   placeholder={"0.01"}
                                   isDisabled={(page._tokenId) ? true : false}
                            />
                            <InputRightAddon>ETH</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>The lowest price you will accept for an edition of this work.</FormHelperText>
                    </FormControl>

                    {/* royalty */}
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
                                isDisabled={(page._tokenId) ? true : false}
                            >
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <FormHelperText>% of the price you will receive for the re-sale of this work
                            after it has left your account</FormHelperText>
                    </FormControl>

                    {/* Allow Forks */}
                    <FormControl>
                        <FormLabel>Allow Forks?</FormLabel>
                        <Switch id="allow-forks"
                                defaultChecked={allowForks}
                                onChange={() => handleAllowForksChange(!allowForks) }
                                isDisabled={(page._tokenId) ? true : false}
                        />
                        <FormHelperText>Enable this if you want to allow others to create derivatives of this work.</FormHelperText>
                    </FormControl>

                    {/* forking fee */}
                    <FormControl id="fork-fee">
                        <FormLabel>Forking Fee</FormLabel>
                        <InputGroup size={"md"}>
                            <NumberInput
                                isDisabled={(page._tokenId) ? true : false}
                            >
                                <NumberInputField  value={forkingFee} onChange={handleForkingFeeChange} textAlign={"right"} id={"fork-fee"} placeholder={"0.50"} disabled={!allowForks}/>
                            </NumberInput>å
                            <InputRightAddon>ETH</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>
                            A one-time fee you collect when someone forks this work.
                        </FormHelperText>
                    </FormControl>

                    {/* limited edition */}
                    <FormControl>
                        <FormLabel>Limited Edition?</FormLabel>
                        <Switch id={"limited-edition"}
                                defaultChecked={limitedEdition}
                                onChange={() => handleLimitedEditionChange(!limitedEdition)}
                                isDisabled={(page._tokenId) ? true : false}
                        />
                        <FormHelperText>
                            Enable this to limit the number of editions that can be minted
                        </FormHelperText>
                    </FormControl>

                    {/* max editions */}
                    <FormControl>
                        <FormLabel>Max editions that can be minted</FormLabel>
                        <Flex>
                            <NumberInput
                                id="max-mintable"
                                step={5}
                                maxW="100px"
                                mr="2rem"
                                value={maxMintable}
                                onChange={handleMaxMintableChange}
                                isDisabled={!limitedEdition}
                            >
                                <NumberInputField disabled={!limitedEdition || page._tokenId ? true : false}/>
                                <NumberInputStepper visibility={(!limitedEdition) ? "hidden" : "visible"}>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                    </FormControl>

                </SimpleGrid>
            </Box>

            <Spacer/>

            <Box textAlign={"center"} mb={5}>
                {isPublishing &&
                    <Box>
                        <Spinner size={"lg"}/>
                        <Text>{publishStatus(publishingState)}</Text>
                    </Box>
                }
                {!isPublishing &&
                    <Button
                        key={"publish-btn"}
                        colorScheme={"cyan"}
                        rightIcon={(<ArrowForwardIcon/>)}
                        onClick={handleClickPublish}
                        disabled={(page._tokenId) ? true : false}
                    >
                        Publish
                    </Button>
                }
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