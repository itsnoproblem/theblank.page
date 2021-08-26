import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import TBPEditor from "./components/TBPEditor";


class App extends React.Component {

    render() {

        return (
            <ChakraProvider>
                <Header/>
                <TBPEditor />
            </ChakraProvider>
        );
    }
}

export default App;