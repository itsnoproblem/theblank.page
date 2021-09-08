import React, {useState} from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import { TBPEditor } from "./components/TBPEditor";
import theme from './theme';
import {EditorContext} from "./editor-context";
import {blankPage} from "./services/Page";

export default function App() {
    const [page, setPage] = useState(blankPage());
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
