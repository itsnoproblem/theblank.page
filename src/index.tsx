import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Fathom from 'fathom-react';
import reportWebVitals from './reportWebVitals';
import {ChainId, Config, DAppProvider} from "@usedapp/core";
import theme from './theme'
import {ColorModeScript} from '@chakra-ui/react'

const config: Config = {
    readOnlyChainId: ChainId.Mainnet,
    readOnlyUrls: {
        [ChainId.Mainnet]: 'https://cdbb41dde3e914493dcc48ff6adac730:@eth-mainnet.gateway.pokt.network/v1/lb/60ecb2bf67774900350d9c41',
    },
}

// const config = {};

ReactDOM.render(
  <React.StrictMode>
      <Fathom siteId={"VSLRANZD"}>
        <DAppProvider config={config}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </DAppProvider>
      </Fathom>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
