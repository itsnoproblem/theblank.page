import './TBPDrawer.css';
import React from "react";
import {
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

type Props = {
    handleSelectPage: any;
    handleEditPage: any;
}

export default function TBPDrawer() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [tabIndex, setTabIndex] = React.useState(0)

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
                        <Tabs onChange={(index) => setTabIndex(index)}>
                            <TabList>
                                <Tab><CopyIcon /></Tab>
                                <Tab><EditIcon /></Tab>
                            </TabList>
                            <TabPanels p="2rem">
                                <TabPanel>
                                    <div>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={<SearchIcon color="gray.300" />}
                                            />
                                            <Input type="text" placeholder="Search" />
                                        </InputGroup>
                                        <PageList />
                                    </div>
                                </TabPanel>
                                <TabPanel><PageView /></TabPanel>
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
