import {Box, Button, Text, useColorModeValue} from "@chakra-ui/react";
import {useEtherBalance, useEthers} from "@usedapp/core";
import {formatEther} from "@ethersproject/units";
import React, {useContext} from "react";
import './ConnectButton.css';
import {EditorContext} from "../editor-context";
import BPageService from "../services/BPageService";


type Props = {
    handleOpenModal: any;
}

export default function ConnectButton({handleOpenModal}: Props) {
    const {activateBrowserWallet, account} = useEthers();

    const etherBalance = useEtherBalance(account);
    const {setPage} = useContext(EditorContext)

    function handleConnectWallet() {
        activateBrowserWallet();
        setPage(BPageService.latest(account))
    }

    const outerBg = useColorModeValue(
        "blue.500",
        "cyan.700"
    );
    const outerColor = useColorModeValue(
        "white",
        "gray.800"
    );
    const innerBg = useColorModeValue(
        "blue.200",
        "blue.100"
    );
    const innerColor = useColorModeValue(
        "gray.600",
        "blue.700"
    );


    const innerBorder = useColorModeValue("1px solid transparent", "1px solid transparent");

    return account ? (
        <Box
            display="flex"
            alignItems="center"
            background={outerBg}
            color={outerColor}
            borderRadius="xl"
            py="0"
        >
            <Box px="3">
                <Text color={outerColor} fontSize="md">
                    {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
                </Text>
            </Box>

            <Button
                onClick={handleOpenModal}
                bg={innerBg}
                color={innerColor}
                border={innerBorder}
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    // borderColor: "blue.400",
                    // backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                m="1px"
                px={3}
                height="38px"
            >
                <Text color={innerColor} fontSize="md" fontWeight="medium" mr="2">
                    {account &&
                    `${account.slice(0, 6)}...${account.slice(
                        account.length - 4,
                        account.length
                    )}`}
                </Text>
            </Button>
        </Box>
    ) : (
        <Button onClick={handleConnectWallet}>Connect</Button>
    )
}