import './TBPDrawer.css';
import React, {useContext} from "react";
import {
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
import Logo from './Logo';
import PageView from "./drawer/PageView";
import PageList from "./drawer/PageList";
import {EditorContext} from "../editor-context";
import BPageService from "../services/BPageService";
import {EditorState} from 'draft-js';


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

    const backgroundColor = useColorModeValue("blue.200", "gray.700");
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
                        <Tabs variant={"solid-rounded"} index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList mb={4} borderBottom={"1px solid"} pb={2}>
                                <Tab>
                                    <Tooltip hasArrow label={"Pages"} placement={"top"}>
                                        <CopyIcon />
                                    </Tooltip>
                                </Tab>
                                <Tab>
                                    <Tooltip hasArrow label={"Modify \"" + page.title + "\""} placement={"top"}>
                                        <EditIcon />
                                    </Tooltip>
                                </Tab>
                                <Tab>
                                    <Tooltip hasArrow label={"Create page"} placement={"top"}>
                                        <AddIcon onClick={handleAddPage}/>
                                    </Tooltip>
                                </Tab>
                            </TabList>
                            <TabPanels>
                                {/* Page LIst */}
                                <TabPanel>
                                    <EditorContext.Consumer>
                                        {({page, setPage}) => (
                                            <PageList page={page} setPage={setPage} changeTab={changeTab}/>
                                        )}
                                    </EditorContext.Consumer>
                                </TabPanel>
                                {/*
                                Page View
                                */}
                                <TabPanel>
                                    <EditorContext.Consumer>
                                        {({page, setPage}) => (
                                            <PageView page={page} setPage={setPage} changeTab={changeTab}/>
                                        )}
                                    </EditorContext.Consumer>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </DrawerBody>

                    <DrawerFooter alignItems={"center"}>
                        {/*<VStack alignItems={"center"} ml={"auto"} mr={"auto"}>*/}
                        {/*    <Link href={"https://discord.alchemist.wtf/"}>*/}
                        {/*        <Image src={"/alchemist.png"} boxSize={["24px"]}/>*/}
                        {/*    </Link>*/}
                        {/*    <Text color={footerColor} mr={2}>made by the alchemists of the #chaos-lab</Text>*/}
                        {/*</VStack>*/}
                        <HStack alignItems={"center"} ml={"auto"} mr={"auto"}>
                            <Link href={"https://discord.alchemist.wtf/"}>
                                <Image src={"/alchemist.png"} boxSize={["24px"]}/>
                            </Link>
                            <Text fontSize="sm" fontFamily={"Poppins"} color={footerColor} mr={2}>made by alchemists</Text>
                        </HStack>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
