import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import store from './state'
import { NetworkContextName } from './constants'
import ListsUpdater from './state/lists/updater'
import UserUpdater from './state/user/updater'
import TicketUpdater from './state/ticket/updater'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider from './theme'
import getLibrary from './utils/getLibrary'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../node_modules/react-bubble-chart/src/style.css";
import 'rc-slider/assets/index.css';


// import { MoralisProvider } from "react-moralis";

// rich text editor styles
import 'draft-js/dist/Draft.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// remove log
import * as Bootstap from './bootstrap'
// @ts-ignore
import { CursorProvider } from "react-cursor-custom";

Bootstap.RemoveConsoleLog()
Bootstap.RemoveConsoleWarning()

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
const moralis_Server_URL = process.env.REACT_APP_MORALIS_SERVER_URL!
const moralis_Application_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID!

if ('ethereum' in window) {
  ; (window.ethereum as any).autoRefreshOnNetworkChange = false
}

function Updaters() {


  return (
    <>

      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <TicketUpdater />

    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Provider store={store}>
            {/* <CursorProvider
            color={'#ff0071'}
            noRing={false}
            ringSize={36}
            transitionTime={0}
          > */}
            <Updaters />
            <ThemeProvider>
              {/* <MoralisProvider serverUrl={moralis_Server_URL} appId={moralis_Application_ID}> */}

              <App />

              {/* </MoralisProvider> */}
            </ThemeProvider>
            {/* </CursorProvider> */}
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
