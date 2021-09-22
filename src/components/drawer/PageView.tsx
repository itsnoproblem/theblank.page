import {
    Badge,
    Box,
    Button, ButtonGroup,
    Divider, Flex,
    FormControl,
    FormLabel, Grid, GridItem, IconButton,
    Input, Kbd, Link, List, ListItem, SimpleGrid,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text, useBreakpointValue, useColorModeValue, useEditable, useEditableControls,
} from "@chakra-ui/react";
import React, {useState} from "react";
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";
import {ArrowForwardIcon, CheckCircleIcon, CheckIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import {zip} from "lodash";

type Props = {
    changeTab: any;
    page: BPage;
    setPage: any;
}

export default function PageView({changeTab, page, setPage}: Props) {
    const [pageTitle, setPageTitle] = useState(page.title);
    const [pageId, setPageId] = useState(page.id);

    const linkColor = useColorModeValue("blue.600", "cyan.400");
    const isMobile = useBreakpointValue({sm: true, md: false, lg: false});

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

    if(pageId !== page.id) {
        setPageId(page.id);
        setPageTitle(page.title);
    }

    const save = () => {
        page.title = pageTitle;
        BPageService.update(page);
        setPage(page);
        changeTab(0);
    }

    return(
        <>
            <Box p={4}>
                <Box pt={4}>
                    <Stat>
                        <StatLabel>{modTime}</StatLabel>
                        <StatNumber>{modDate}</StatNumber>
                        <StatHelpText>updated</StatHelpText>
                    </Stat>

                    <Box borderTopStartRadius={"none"}  overflow={"hidden"} borderWidth={1} p={4}>
                        <FormControl id="title" isRequired isDisabled={page.address !== undefined}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type="text"
                                value={pageTitle}
                                size="lg"
                                onChange={(e) => { setPageTitle(e.currentTarget.value)}}
                            />
                        </FormControl>

                        <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mt={8} mb={12}>

                            <GridItem visibility={(page.address !== undefined) ? "hidden" : "visible"} color={linkColor} cursor={"pointer"} onClick={() => changeTab(2)}>publish settings</GridItem>
                            <GridItem visibility={(page.address !== undefined) ? "hidden" : "visible"} color={linkColor} cursor={"pointer"} onClick={() => changeTab(2)}><ArrowForwardIcon/></GridItem>

                            <GridItem>{(page.address === undefined) ? "not" : ""} published</GridItem>
                            <GridItem><CheckCircleIcon color={(page.address === undefined) ? "gray.300" : "green.400"}/></GridItem>

                            <GridItem>address:</GridItem>
                            <GridItem><Kbd d="inline" isTruncated={isMobile}>{page.address === undefined ? "---" : "0xb772ce9f14fc7c7db0d4525adb9349fbd7ce456a"}</Kbd></GridItem>

                        </Grid>

                        <Box pt={4} textAlign={"right"} visibility={(page.address !== undefined) ? "hidden" : "visible"}>
                            <FormControl>
                                <Button variant="outline" mr={3} onClick={(e) => changeTab(0)}>Cancel</Button>
                                <Button colorScheme="blue" onClick={() => save()}>Save</Button>
                            </FormControl>
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