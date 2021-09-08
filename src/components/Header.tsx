import './Header.css';
import React from "react";
import { useDisclosure } from '@chakra-ui/react';
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import TBPDrawer from "./TBPDrawer";
import NightMode from "./NightMode";

export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className="header">
                <TBPDrawer/>
                <div className="controls">
                    <NightMode/>
                    <ConnectButton handleOpenModal={onOpen} />
                </div>
                <AccountModal isOpen={isOpen} onClose={onClose} />

            </div>
        </>
    )
}