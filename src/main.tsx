import React from 'react'
import ReactDOM from 'react-dom/client'
import { Game } from './scenes/Game'
import { PopupContextProvider } from './contexts/PopupContextProvider'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PopupContextProvider>
    <Game />
  </PopupContextProvider>
)
