import "@fontsource/poppins";
import '@fontsource/roboto-mono';
import React, {useEffect, useState} from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import theme from './theme';
import {EditorContext} from "./editor-context";
import Header from "./components/Header";
import {TBPEditor} from "./components/TBPEditor";
import BPageService from "./services/BPageService";
import {useEthers, useNotifications} from "@usedapp/core";
import {convertFromRaw, EditorState} from 'draft-js';

export default function App() {
    const {account} = useEthers()
    const [page, setPage] = useState(BPageService.latest(account));
    const pageState = { page, setPage }
    let initialState;

    const {notifications} = useNotifications();

    useEffect(() => {
        notifications.map((notice) => {
            if(notice.type === 'walletConnected') {
                console.log("Changed account");
                const pg = BPageService.latest(notice.address);
                setPage(pg);
            }
        })
    }, [notifications, setPage])

    if(page.content) {
        const raw = convertFromRaw(page.content);
        initialState = EditorState.createWithContent(raw);
    } else {
        initialState = EditorState.createEmpty();
    }

    const [editorState, setEditorState] = React.useState(initialState);


    let chakraProvider =
    <>
        <ChakraProvider theme={theme}>
            <EditorContext.Provider value={pageState}>
                <Header/>
                <TBPEditor editorState={editorState} setEditorState={setEditorState}/>
            </EditorContext.Provider>
        </ChakraProvider>
    </>;
    return chakraProvider
}
