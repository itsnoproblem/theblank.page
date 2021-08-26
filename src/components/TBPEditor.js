import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import debounce from 'lodash/debounce';


class TBPEditor extends React.Component {

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

        this.onTab = (e) => this._onTab(e);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);

        this.editor = React.createRef();
        this.focusEditor = this.focusEditor.bind(this);
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
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
                        onTab={this.onTab}
                        preserveSelectionOnBlur={true}
                        spellCheck={true}
                        ref={this.editor}
                />
            </div>
        );
    }
}

export default TBPEditor;