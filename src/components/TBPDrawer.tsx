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
    Text,
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
    const {setPage} = useContext(EditorContext);

    const changeTab = (idx) => {
        setTabIndex(idx);
    }

    const handleAddPage = (e) => {
        console.log("Boop");

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

    const backgroundColor = useColorModeValue("gray.100", "gray.700");
    const footerColor = useColorModeValue("gray.700", "gray.500");
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
                    <DrawerCloseButton />
                    <DrawerHeader>

                    </DrawerHeader>
                    <DrawerBody>
                        <Tabs variant={"solid-rounded"} index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList>
                                <Tab><CopyIcon /></Tab>
                                <Tab><EditIcon /></Tab>
                                <Tab><AddIcon onClick={handleAddPage}/></Tab>
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
                            <Text color={footerColor} mr={2}>made by certified alchemists</Text>
                        </HStack>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
