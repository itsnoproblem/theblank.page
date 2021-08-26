import React from "react";
import {useDisclosure} from '@chakra-ui/react';
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import TBPDrawer from "./TBPDrawer";
import './Header.css';

export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className="header">
                <TBPDrawer />
                <ConnectButton handleOpenModal={onOpen} />
                <AccountModal isOpen={isOpen} onClose={onClose} />
            </div>
        </>
    )
}