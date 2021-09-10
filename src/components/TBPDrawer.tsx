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
    useDisclosure,
} from "@chakra-ui/react";
import {CopyIcon, EditIcon, SearchIcon} from "@chakra-ui/icons";
import Logo from './Logo';
import PageView from "./drawer/PageView";
import PageList from "./drawer/PageList";
import {EditorContext} from "../editor-context";


export default function TBPDrawer() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [tabIndex, setTabIndex] = React.useState(0)
    const changeTab = (idx) => {
        setTabIndex(idx);
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
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>

                    </DrawerHeader>
                    <DrawerBody>
                        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList>
                                <Tab><CopyIcon /></Tab>
                                <Tab><EditIcon /></Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<SearchIcon color="gray.300" />}
                                        />
                                        <Input type="text" placeholder="Search" />
                                    </InputGroup>
                                    <EditorContext.Consumer>
                                        {({page, setPage}) => (
                                            <PageList page={page} setPage={setPage} changeTab={changeTab}/>
                                        )}
                                    </EditorContext.Consumer>
                                </TabPanel>
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

                    <DrawerFooter>
                        drawer footer
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
