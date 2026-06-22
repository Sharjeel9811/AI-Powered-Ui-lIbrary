import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Store from './Redux/Store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
    <Provider store={Store}>



    <App />
     </Provider>

     </HashRouter>
  </StrictMode>,
)
