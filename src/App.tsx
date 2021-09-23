import "@fontsource/poppins";
import '@fontsource/roboto-mono';
import React, {useState} from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import theme from './theme';
import {EditorContext} from "./editor-context";
import Header from "./components/Header";
import {TBPEditor} from "./components/TBPEditor";
import BPageService from "./services/BPageService";
import {useEthers} from "@usedapp/core";

export default function App() {
    const {account} = useEthers()
    const [page, setPage] = useState(BPageService.latest(account));
    const value = { page, setPage }

    let chakraProvider =
    <>
        <ChakraProvider theme={theme}>
            <EditorContext.Provider value={value}>
                <Header/>
                <TBPEditor/>
            </EditorContext.Provider>
        </ChakraProvider>
    </>;
    return chakraProvider
}
