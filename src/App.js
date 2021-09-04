import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import { TBPEditor } from "./components/TBPEditor";
import theme from './theme.ts';

class App extends React.Component {
    render() {

        return (
            <ChakraProvider theme={theme}>
                <Header/>
                <TBPEditor/>
            </ChakraProvider>
        );
    }
}

export default App;