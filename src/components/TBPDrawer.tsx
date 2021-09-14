import './TBPDrawer.css';
import React, {useContext} from "react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay, Input, InputGroup, InputLeftElement,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    useColorModeValue, Image, Link, VStack,
} from "@chakra-ui/react";
import {AddIcon, CopyIcon, EditIcon, SearchIcon} from "@chakra-ui/icons";
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
                        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList>
                                <Tab><CopyIcon /></Tab>
                                <Tab><EditIcon /></Tab>
                                <Tab><AddIcon onClick={handleAddPage}/></Tab>
                            </TabList>
                            <TabPanels>
                                {/* Page LIst */}
                                <TabPanel>
                                    {/*<InputGroup mb={6}>*/}
                                    {/*    <InputLeftElement*/}
                                    {/*        pointerEvents="none"*/}
                                    {/*        children={<SearchIcon color="gray.300" />}*/}
                                    {/*    />*/}
                                    {/*    <Input type="text" placeholder="Search" />*/}
                                    {/*</InputGroup>*/}
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
                        <VStack alignItems={"center"} ml={"auto"} mr={"auto"}>
                            <Link href={"https://discord.alchemist.wtf/"}>
                                <Image src={"/alchemist.png"} boxSize={["24px"]}/>
                            </Link>
                            <Text color={footerColor} mr={2}>made by the alchemists of the #chaos-lab</Text>
                        </VStack>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}