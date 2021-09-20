import './TBPDrawer.css';
import React, {useContext} from "react";
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
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
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import {ImFeed, ImStack} from "react-icons/all";
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

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [tabIndex, setTabIndex] = React.useState(TAB_PAGELIST);
    const {page, setPage} = useContext(EditorContext);
    const {activateBrowserWallet, account } = useEthers();

    const changeTab = (idx) => {
        if(idx === TAB_NEWPAGE) {
            handleAddPage();
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

        pg.id = BPageService.create(pg);
        setPage(pg);
        setTabIndex(1);
    }

    const backgroundColor = useColorModeValue("gray.50", "gray.700");
    const footerColor = useColorModeValue("gray.700", "gray.500");
    const colorScheme = useColorModeValue("blackAlpha", "blackAlpha");

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

                    <DrawerCloseButton colorScheme={colorScheme}/>
                    <DrawerHeader>

                    </DrawerHeader>
                    <DrawerBody>
                        <Box visibility={(account ? "hidden" : "visible")}>
                            <Text fontSize={"lg"}>Please connect a wallet to continue</Text>
                        </Box>
                        <Tabs visibility={(account ? "visible" : "hidden")} h="100%" pb={"56px"} variant={"solid-rounded"} index={tabIndex} onChange={changeTab}>
                            <TabList borderBottom={"1px solid"} pb={2}>
                                <Tab>
                                    <Tooltip hasArrow placement="top" label="Pages">
                                        <span><ImStack /></span>
                                    </Tooltip>
                                </Tab>
                                <Tab>
                                    <Tooltip hasArrow placement="top" label="Edit page details">
                                        <span><EditIcon /></span>
                                    </Tooltip>
                                </Tab>
                                <Tab disabled={true}>
                                    <Tooltip  hasArrow placement="top" label="Publish to network">
                                        <span><ImFeed/></span>
                                    </Tooltip>
                                </Tab>
                                <Tab>
                                    <Tooltip hasArrow placement="top" label="Create page">
                                        <span><AddIcon/></span>
                                    </Tooltip>
                                </Tab>
                            </TabList>
                            <TabPanels h={"100%"}>

                                {/* Page LIst */}
                                <TabPanel>
                                    <EditorContext.Consumer>
                                        {({page, setPage}) => (
                                            <PageList page={page} setPage={setPage} changeTab={changeTab}/>
                                        )}
                                    </EditorContext.Consumer>
                                </TabPanel>

                                {/* Page View */}
                                <TabPanel>
                                    <EditorContext.Consumer>
                                        {({page, setPage}) => (
                                            <PageView page={page} setPage={setPage} changeTab={changeTab}/>
                                        )}
                                    </EditorContext.Consumer>
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
