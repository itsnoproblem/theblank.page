import './TBPEditor.css';
import React, {useContext, useEffect, useRef} from 'react';
import {convertFromRaw, convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import {useDebouncedCallback} from 'use-debounce';
import BPageService from '../services/BPageService'
import {EditorContext} from "../editor-context";

export const TBPEditor = () => {
    let initialState;
    const editor = useRef(null);
    const {page, setPage} = useContext(EditorContext);

    const newPage = () => {
        initialState = EditorState.createEmpty();
        console.log("empty state");
        console.log(initialState);
        let pg = {
            title: "New Page",
            id: -1,
            content: JSON.stringify(initialState.getCurrentContent()),
            modified: new Date()
        }

        pg.id = BPageService.create(pg);
        setPage(pg);
    }

    if(page.id < 1) {
        console.log("Creating newPage");
        console.log(page);
        newPage();
    }

    const raw = JSON.parse(page.content);
    if(raw !== null && Array.isArray(raw.blocks)) {
        initialState = EditorState.createWithContent(convertFromRaw(raw))
    }
    else {
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
        } else {
            initialState = EditorState.createEmpty();
        }

        setEditorState(initialState);
        setTimeout(() => { focusEditor() }, 1000);
    }, [page])

    const focusEditor = () => {
        if (editor.current !== undefined) {
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
            const raw = JSON.stringify(convertToRaw(content));
            if(raw !== page.content) {
                page.content = raw;
                if(page.id < 1) {
                    page.id = BPageService.create(page);
                } else {
                    BPageService.update(page);

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
            />
        </div>
    );
}

