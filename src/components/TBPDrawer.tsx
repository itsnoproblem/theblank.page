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
    Text, Tooltip,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import {AddIcon, CopyIcon, EditIcon} from "@chakra-ui/icons";
import {ImStack, ImQrcode, ImFeed} from "react-icons/all";
import Logo from './Logo';
import PageView from "./drawer/PageView";
import PageList from "./drawer/PageList";
import {EditorContext} from "../editor-context";
import BPageService from "../services/BPageService";
import RandomImage from "./RandomImage";
import {EditorState} from 'draft-js';
import EthereumQRCode from "./EthereumQRCode";
import Publisher from "./drawer/Publisher";


export default function TBPDrawer() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [tabIndex, setTabIndex] = React.useState(0);
    const {page, setPage} = useContext(EditorContext);

    const changeTab = (idx) => {
        setTabIndex(idx);
    }

    const handleAddPage = (e) => {
        let es = EditorState.createEmpty();
        let pg = {
            title: "New Page",
            id: -1,
            content: JSON.stringify(es.getCurrentContent()),
            modified: new Date()
        }

        pg.id = BPageService.create(pg);
        setPage(pg);
        setTabIndex(0);
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
                <DrawerContent backgroundColor={backgroundColor}>
                    <DrawerCloseButton colorScheme={colorScheme}/>
                    <DrawerHeader>

                    </DrawerHeader>
                    <DrawerBody>
                        <Tabs h="100%" pb={"56px"} variant={"solid-rounded"} index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList mb={4} borderBottom={"1px solid"} pb={2}>
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
                                        <span><AddIcon onClick={handleAddPage}/></span>
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
