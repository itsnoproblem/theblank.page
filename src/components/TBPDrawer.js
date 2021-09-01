import './TBPDrawer.css';
import React from "react";
import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from "@chakra-ui/react";
import {CopyIcon} from "@chakra-ui/icons";
import Logo from './Logo';
import AccountPages from "./drawer/AccountPages";
import PageView from "./drawer/PageView";

export default function TBPDrawer() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [tabIndex, setTabIndex] = React.useState(0)

    return (
        <>
            <Logo onClick={onOpen}/>
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
                                <Tab></Tab>
                            </TabList>
                            <TabPanels p="2rem">
                                <TabPanel><AccountPages /></TabPanel>
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
