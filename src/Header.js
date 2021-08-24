import React from "react";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import {useDisclosure} from "@chakra-ui/react";

export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div className="header">
            <figure className="logo">
                <img src="book-open.svg" alt="the blank page"/>
            </figure>
            <ConnectButton handleOpenModal={onOpen} />
            <AccountModal isOpen={isOpen} onClose={onClose} />
        </div>
    )
}