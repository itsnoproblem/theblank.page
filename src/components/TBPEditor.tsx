import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import debounce from 'lodash/debounce';
import './TBPEditor.css';

export class TBPEditor extends React.Component {
    private editor: React.RefObject<any>;
    public state: any;

    constructor(props) {
        super(props);
        const content = window.localStorage.getItem('content');
        let initialState;

        if (content) {
            initialState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
        } else {
            initialState = EditorState.createEmpty();
        }

        this.state = {
            editorState: initialState
        }

        this._onTab = (e) => this._onTab(e);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);

        this.editor = React.createRef();
        this.focusEditor = this.focusEditor.bind(this);
    }

    _onTab(e) {
        const maxDepth = 4;
        // this.onChange(RichUtils.onTab(e, editorState, maxDepth));
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    onChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        this.saveContent(contentState)
        this.setState({
            editorState,
        });
    }

    saveContent = debounce((content) => {
        window.localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
        console.log("Saved content...")
    }, 1000);

    componentDidMount() {
        console.log("mounted");
        setTimeout(() => { this.focusEditor() }, 1000)
    };

    focusEditor = () => {
        if (this.editor.current) {
            console.log("focus");
            this.editor.current.focus();
        }
        else {
            console.log("no editor yet");
            console.log(this.editor.current);
        }
    };

    render() {
        return (
            <div className={"editor-wrapper"} onClick={this.focusEditor}>
                <Editor className={"full-page-editor"}
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this._onTab}
                        preserveSelectionOnBlur={true}
                        spellCheck={true}
                        ref={this.editor}
                />
            </div>
        );
    }
}

// export default { TBPEditor };

// import "draft-js/dist/Draft.css";
// import './TBPEditor.css';
// import React from "react";
// import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
// import debounce from 'lodash/debounce';
// import BPage from "../types/Page";
// import BPageService from "../services/BPageService";
//
//
// interface TBPEditorProps {
// }
//
// class TBPEditor extends React.Component<TBPEditorProps, any> {
//     constructor(props: TBPEditorProps) {
//         super(props);
//
//         let initialState = EditorState.createEmpty();
//
//         let currentPageId = parseInt(window.localStorage.getItem('currentPageId') || "");
//         let initialState: any;
//         let currentPage: BPage|undefined;
//
//         if(currentPageId > 0) {
//             currentPage = BPageService.get(currentPageId);
//         }
//
//         if(typeof currentPage?.content !== "undefined") {
//             initialState = EditorState.createWithContent(convertFromRaw(currentPage.content));
//         } else {
//             initialState = EditorState.createEmpty();
//             currentPage = {
//                 title: "New Page",
//                 content: {},
//             }
//
//             currentPage.id = BPageService.create(currentPage);
//         }
//
//         this.state = {
//             editorState: initialState
//         }
//
//         this.state = {
//             editorState: EditorState.createEmpty(),
//         };
//     }
//
//     handleChange(e: EditorState) {
//         this.setState({ editorState: e });
//     }
//
//     render() {
//         return (
//             <Editor editorState={this.state.editorState} onChange={e => this.handleChange(e)} />
//         );
//     }
// }
//
// export { TBPEditor }
//
//
// // class TBPEditor extends React.Component {
// //     private editor: React.MutableRefObject<any>;
// //     private currentPage: BPage | undefined;
// //     private currentPageId: number;
// //     public state: any;
// //
// //     loadPage(id) {
// //
// //     }
// //
// //     constructor(props) {
// //         super(props);
// //         this.currentPageId = parseInt(window.localStorage.getItem('currentPageId') || "");
// //         let initialState;
// //
// //         if(this.currentPageId > 0) {
// //             this.currentPage = BPageService.get(this.currentPageId);
// //         }
// //
// //         if(typeof this.currentPage?.content !== "undefined") {
// //             initialState = EditorState.createWithContent(this.currentPage.content);
// //         } else {
// //             initialState = EditorState.createEmpty();
// //             this.currentPage = {
// //                 title: "New Page",
// //                 content: convertToRaw()
// //             }
// //             this.currentPage.id = BPageService.create(this.currentPage);
// //         }
// //
// //         this.state = {
// //             editorState: initialState
// //         }
// //
// //         // this.onTab = (e) => this._onTab(e);
// //         // this.handleKeyCommand = this.handleKeyCommand.bind(this);
// //
// //         this.editor = React.createRef()
// //         this.focusEditor = this.focusEditor.bind(this);
// //     }
// //
// //     // _onTab(e) {
// //     //     const maxDepth = 4;
// //     //     this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
// //     // }
// //
// //     handleKeyCommand(command, editorState) {
// //         const newState = RichUtils.handleKeyCommand(editorState, command);
// //
// //         if (newState) {
// //             this.onChange(newState);
// //             return 'handled';
// //         }
// //
// //         return 'not-handled';
// //     }
// //
// //     onChange = (editorState) => {
// //         const contentState = editorState.getCurrentContent();
// //         this.saveContent(contentState)
// //         this.setState({
// //             editorState,
// //         });
// //     }
// //
// //     saveContent = debounce((content) => {
// //         if(this.currentPage) {
// //             this.currentPage.content = content;
// //             if(BPageService.update(this.currentPage)) {
// //                 console.log("updated");
// //             }
// //         }
// //     }, 1000);
// //
// //     componentDidMount() {
// //         console.log("mounted");
// //         setTimeout(() => { this.focusEditor() }, 1000)
// //     };
// //
// //     focusEditor = () => {
// //         if (this.editor.current) {
// //             console.log("focus");
// //             this.editor.current.focus();
// //         }
// //         else {
// //             console.log("no editor yet");
// //             console.log(this.editor.current);
// //         }
// //     };
// //
// //     render() {
// //         return (
// //             <div className={"editor-wrapper"} onClick={this.focusEditor}>
// //                 <Editor className={"full-page-editor"}
// //                         editorState={this.state.editorState}
// //                         handleKeyCommand={this.handleKeyCommand}
// //                         onChange={this.onChange}
// //                         // onTab={this.onTab}
// //                         preserveSelectionOnBlur={true}
// //                         spellCheck={true}
// //                         ref={this.editor}
// //                 />
// //             </div>
// //         );
// //     }
// // }
// //
// // export default TBPEditor;