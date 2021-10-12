import './TBPEditor.css';
import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {convertFromRaw, convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import {useDebouncedCallback} from 'use-debounce';
import BPageService from '../services/BPageService'
import {EditorContext} from "../editor-context";
import {ChainId, useEthers, useNotifications} from "@usedapp/core";
import {blankPage} from "../services/Page";
import {useEventListener} from "@chakra-ui/react";

type Props = {
    setEditorState: (initialState: any) => void
    editorState: any
}
export const TBPEditor = ({editorState, setEditorState}: Props) => {
    let initialState;
    const editor = useRef(null);
    const {page, setPage} = useContext(EditorContext);
    const { account, chainId } = useEthers();

    const newPage = () => {
        initialState = EditorState.createEmpty();
        let pg = blankPage(account);
        pg.content = initialState.getCurrentContent();
        pg.id = BPageService.create(account, pg);
        setPage(pg);
    }

    const handleKeyCommand = (command, state) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    useEffect(() => {
        if(page.content) {
            initialState = EditorState.createWithContent(convertFromRaw(page.content));
        }
        else {
            initialState = EditorState.createEmpty();
        }

        setEditorState(initialState);
    }, [page])

    const focusEditor = () => {
        if (editor.current !== undefined) {
            // @ts-ignore
            editor.current.focus();
        }
        else {
            console.log(editor.current);
        }
    };

    const handleOnChange = (state) => {
        setEditorState(state);
        if (state.getCurrentContent() !== editorState.getCurrentContent()) {
            saveContent(state.getCurrentContent());
        }
    }

    const saveContent = useDebouncedCallback((content) => {
        const raw = convertToRaw(content);
            if(content !== page.content) {
                page.content = raw;
                if(page.id < 1) {
                    page.id = BPageService.create(account, page);
                } else {
                    BPageService.update(account, page);
                }

                setPage(page);
                console.log("Updated page " + page.id);
            }

        }, 1000);


    return (
        <div className={"editor-wrapper"} onClick={focusEditor}>
            <Editor className={"full-page-editor"}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={handleOnChange}
                    preserveSelectionOnBlur={true}
                    spellCheck={true}
                    ref={editor}
                    placeholder={"Write something..."}
                    d={"inline-block"}
                    readOnly={(account && chainId === ChainId.Rinkeby) ? false : true}
            />
        </div>
    );
}

