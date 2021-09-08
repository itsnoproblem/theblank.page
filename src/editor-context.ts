import React from 'react';
import BPage, {blankPage} from "./services/Page";
export const EditorContext = React.createContext({
    page: blankPage(),
    setPage: (bp: BPage) => {},
});