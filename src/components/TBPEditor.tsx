import React, {useEffect, useRef} from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import debounce from 'lodash/debounce';
import './TBPEditor.css';
import BPageService from  '../services/BPageService'
import BPage from "../services/Page";
import {useContext} from "react";
import {EditorContext} from "../editor-context";

export const TBPEditor = () => {

    const editor = useRef(null);
    const {page, setPage} = useContext(EditorContext);
    let initialState;

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

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            handleOnChange(newState);
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
    }, [page])

    const focusEditor = () => {
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

    const handleOnChange = (editorState) => {
        setEditorState(editorState);
        saveContent(editorState.getCurrentContent());
    }

    const saveContent = debounce((content) => {
            console.log("bounce");
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
                    BPageService.update(page)
                    console.log("Updated page...");
                    console.log(page);
                }
            }


        }, 3000);


    // useEffect(() => {
        // console.log("mounted");
        // setTimeout(() => { focusEditor() }, 1000)
    // });

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

