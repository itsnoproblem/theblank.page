import {
    Badge,
    Box,
    Button, ButtonGroup, CloseButton, Divider, Editable, EditableInput, EditablePreview, Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem, HStack, IconButton,
    Input,
    Kbd,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useBreakpointValue, useClipboard,
    useColorModeValue, useEditableControls,
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import BPageService from "../../services/BPageService";
import {ArrowForwardIcon, CheckCircleIcon, CheckIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import {useEthers} from "@usedapp/core";
import {EditorContext} from "../../editor-context";
import {FileUpload} from "./FileUpload";
import {IpfsLink} from "../IpfsUrl";
import {ImCopy, ImQrcode} from "react-icons/all";

function EditableControls() {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
        <ButtonGroup justifyContent="center" size="sm">
            <IconButton aria-label={"Accept"} icon={<CheckIcon />} {...getSubmitButtonProps()} />
            <IconButton aria-label={"Cancel"} icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
    ) : (
        <Flex justifyContent="center">
            <IconButton aria-label={"Edit"} size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
        </Flex>
    )
}

type Props = {
    changeTab: any;
}

export default function PageView({changeTab}: Props) {
    const {page, setPage} = useContext(EditorContext)
    const {account} = useEthers();
    const [pageTitle, setPageTitle] = useState(page.title);
    const [pageId, setPageId] = useState(page.id);

    const linkColor = useColorModeValue("blue.600", "cyan.400");
    const isMobile = useBreakpointValue({sm: true, md: false, lg: false});

    if(pageId !== page.id) {
        setPageId(page.id);
        setPageTitle(page.title);
    }

    const saveTitle = (title: string) => {
        page.title = title;
        setPage(page);
        BPageService.update(account, page);
    }

    let date;
    if(typeof page.modified === "string") {
        date = new Date(page.modified)
    }
    else {
        date = new Date();
    }

    const modTime = ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2);
    const modDate = date.toDateString();

    return(
        <>
            <Box>
                <Box>
                    <Box borderTopStartRadius={"none"}  overflow={"hidden"} borderWidth={1} p={4}>
                        <FormControl id="title" isRequired isDisabled={page.address !== undefined}>
                            <FormLabel>Title</FormLabel>
                            <Editable
                                value={pageTitle}
                                fontSize="2xl"
                                isPreviewFocusable={false}
                                onSubmit={saveTitle}
                                onChange={(nextValue) => {
                                    setPageTitle(nextValue)
                                }}
                            >
                                <HStack>
                                    <EditablePreview />
                                    <EditableInput />
                                    <EditableControls />
                                </HStack>
                            </Editable>
                        </FormControl>

                        <Grid maxW={"5"} templateColumns={"repeat(2, 1fr)"} gap={4} mt={2} mb={8}>
                            <GridItem colSpan={2}>
                                <CheckCircleIcon color={(page.address === undefined) ? "yellow.300" : "green.400"}/>&nbsp;&nbsp;
                                {(page.address === undefined) ? "un" : ""}published
                            </GridItem>

                            <GridItem colSpan={2} mt={4}>
                                <Divider/>
                            </GridItem>

                            <GridItem mt={4}>
                                Metadata:
                            </GridItem>
                            <GridItem mt={4}>
                                {!page._ipfsHashMetadata && '---'}
                                {page._ipfsHashMetadata && (<IpfsLink hash={page._ipfsHashMetadata ?? ''}/>)}
                            </GridItem>

                            <GridItem>Image:</GridItem>
                            <GridItem><IpfsLink hash={page._ipfsHashImage ?? ''}/></GridItem>

                            <GridItem>Contract:</GridItem>
                            <GridItem><Kbd d="inline" isTruncated={isMobile}>{page.address === undefined ? "---" : page.address}</Kbd></GridItem>

                            <GridItem colSpan={2} mt={4}>
                                <Divider/>
                            </GridItem>
                        </Grid>

                        <FormControl>
                            <FormLabel>Image</FormLabel>
                            <FileUpload/>
                        </FormControl>

                        <Box pt={4} visibility={(page.address !== undefined) ? "hidden" : "visible"}>
                            <Stat textAlign={"left"} mt={4}>
                                <StatLabel>{modTime}</StatLabel>
                                <StatNumber>{modDate}</StatNumber>
                                <StatHelpText>Last modified</StatHelpText>
                            </Stat>
                        </Box>
                    </Box>


                    <Box>
                        <Text d="block" textAlign={"right"} fontSize={"sm"} pt={4} pb={8}>
                            <Badge borderRadius={0} mr={2} variant={"solid"}>draft id</Badge>
                            <span>{("0000" + page.id).slice(-4)}</span>
                        </Text>
                    </Box>


                </Box>
            </Box>
        </>
    )
}