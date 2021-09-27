import './TBPDrawer.css';
import React, {useContext} from "react";
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    HStack,
    Image,
    Link,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import {AddIcon, ArrowBackIcon, EditIcon} from "@chakra-ui/icons";
import {ImFeed, ImStack} from "react-icons/im";
import Logo from './Logo';
import PageView from "./drawer/PageView";
import PageList from "./drawer/PageList";
import {EditorContext} from "../editor-context";
import BPageService from "../services/BPageService";
import {EditorState} from 'draft-js';
import Publisher from "./drawer/Publisher";
import {useEthers} from "@usedapp/core";


export default function TBPDrawer() {
    const TAB_PAGELIST = 0;
    const TAB_EDITPAGE = 1;
    const TAB_PUBLISHER = 2;
    const TAB_NEWPAGE = 3;

    const backgroundColor = useColorModeValue("gray.50", "gray.700");
    const footerColor = useColorModeValue("gray.700", "gray.500");
    const colorScheme = useColorModeValue("blackAlpha", "blackAlpha");
    const isDesktop = useBreakpointValue({sm: false, md: false, lg: true})

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [tabIndex, setTabIndex] = React.useState(TAB_PAGELIST);
    const {page, setPage} = useContext(EditorContext);
    const {activateBrowserWallet, account } = useEthers();

    const changeTab = (idx) => {
        if(idx === TAB_NEWPAGE) {
            setTabIndex(TAB_EDITPAGE);
        }
        else {
            setTabIndex(idx);
        }
    }

    const handleAddPage = () => {
        let es = EditorState.createEmpty();
        let pg = {
            title: "New Page",
            id: -1,
            content: JSON.stringify(es.getCurrentContent()),
            modified: new Date()
        }

        pg.id = BPageService.create(account, pg);
        setPage(pg);
        setTabIndex(1);
    }

    return (
        <>
            <Logo onClick={onOpen} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                size="lg"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent mr={4} backgroundColor={backgroundColor} overflow={"hidden"}>
                    <DrawerCloseButton icon={(<ArrowBackIcon/>)} mt={4} colorScheme={colorScheme} tabIndex={-1}/>
                    <DrawerBody pt={5}>
                        <Box mt={"50%"} textAlign={"center"} h={"50%"} d={account ? "none" : "block"} visibility={(account ? "hidden" : "visible")}>
                            <Text fontSize={"lg"}>
                                Please connect an account to continue
                            </Text>
                        </Box>
                        <Tabs d={account ? "" : "none"} visibility={(account ? "visible" : "hidden")} pb={"56px"} variant={"solid-rounded"} index={tabIndex} onChange={changeTab}>
                            <TabList borderBottom={"1px solid"} pb={4}>
                                <Tab>
                                    <Tooltip isDisabled={!isDesktop} hasArrow placement="top" label="Drafts">
                                        <span><ImStack /></span>
                                    </Tooltip>
                                </Tab>
                                <Tab>
                                    <Tooltip isDisabled={!isDesktop} hasArrow placement="top" label="Details">
                                        <span><EditIcon /></span>
                                    </Tooltip>
                                </Tab>
                                <Tab disabled={true}>
                                    <Tooltip isDisabled={!isDesktop} hasArrow placement="top" label="Publish to network">
                                        <span><ImFeed/></span>
                                    </Tooltip>
                                </Tab>
                                <Tab onClick={handleAddPage}>
                                    <Tooltip isDisabled={!isDesktop} hasArrow placement="top" label="New page">
                                        <span><AddIcon/></span>
                                    </Tooltip>
                                </Tab>
                            </TabList>
                            <TabPanels h={"100%"}>

                                {/* Page LIst */}
                                <TabPanel>
                                    <PageList changeTab={changeTab} />
                                </TabPanel>

                                {/* Page View */}
                                <TabPanel>
                                    <PageView changeTab={changeTab}/>
                                </TabPanel>

                                {/* publish on blockchain */}
                                <TabPanel h={"100%"}>
                                    <Publisher/>
                                </TabPanel>
                                {/*
                                placeholder for new page
                                */}
                                <TabPanel>

                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </DrawerBody>

                    <DrawerFooter alignItems={"center"}>
                        <HStack alignItems={"center"} ml={"auto"} mr={"auto"}>
                            <Link href={"https://alchemist.wtf"} target="new">
                                <Image src={"/alchemist.png"} boxSize={["24px"]}/>
                            </Link>
                            <Text fontSize="sm" fontFamily={"Poppins"} color={footerColor} mr={2}>made by certified alchemists</Text>
                        </HStack>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
