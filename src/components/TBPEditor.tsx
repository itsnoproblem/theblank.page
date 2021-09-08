import './TBPEditor.css';
import React, {useEffect, useRef} from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import { useDebouncedCallback } from 'use-debounce';
import {useContext, useState} from "react";
import BPageService from  '../services/BPageService'
import {EditorContext} from "../editor-context";

export const TBPEditor = () => {
    let initialState;
    const editor = useRef(null);
    const {page, setPage} = useContext(EditorContext);

    if(page !== undefined) {
        const raw = JSON.parse(page.content);
        if(raw !== null && Array.isArray(raw.blocks)) {
            initialState = EditorState.createWithContent(convertFromRaw(raw))
        }
        else {
            initialState = EditorState.createEmpty();
        }
    } else {
        initialState = EditorState.createEmpty();
    }

    const [editorState, setEditorState] = React.useState(initialState);

    const handleKeyCommand = (command, state) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    useEffect(() => {
        const raw = JSON.parse(page.content);
        if(raw !== null && Array.isArray(raw.blocks)) {
            initialState = EditorState.createWithContent(convertFromRaw(raw))
        }
        else {
            initialState = EditorState.createEmpty();
        }
        setEditorState(initialState);

        setTimeout(() => { focusEditor() }, 1000);
    }, [page])

    const focusEditor = () => {
        console.log("focusEditor")
        if (editor.current !== undefined) {
            console.log("focus");
            // @ts-ignore
            editor.current.focus();
        }
        else {
            console.log("no editor yet");
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
            console.log("saveContent "+ (new Date()).toUTCString());
            const raw = JSON.stringify(convertToRaw(content))
            if (page === undefined) {
                let pg = {
                    title: "New Page",
                    id: -1,
                    content: raw,
                    modified: new Date()
                }
                pg.id = BPageService.create(pg);
                setPage(pg)
                console.log("Created page...");
                console.log(page);
            } else {
                if(raw != page.content) {
                    page.content = raw
                    BPageService.update(page);
                    setPage(page);
                    console.log("Updated page " + page.id);
                }
            }
        }, 2000);


    return (
        <div className={"editor-wrapper"} onClick={focusEditor}>
            <Editor className={"full-page-editor"}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={handleOnChange}
                    preserveSelectionOnBlur={true}
                    spellCheck={true}
                    ref={editor}
            />
        </div>
    );
}

