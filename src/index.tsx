import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChainId, Config, DAppProvider} from "@usedapp/core";
import theme from './theme'
import { ColorModeScript } from '@chakra-ui/react'

// const config: Config = {
//     readOnlyChainId: ChainId.Mainnet,
//     readOnlyUrls: {
//         [ChainId.Mainnet]: 'https://eth-mainnet.gateway.pokt.network/v1/lb/60ecb2bf67774900350d9c41',
//     },
// }

const config = {};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
