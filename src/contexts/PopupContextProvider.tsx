import React, {ReactNode, createContext, useContext, useState} from "react";
import { PopupFragment } from "../components";

interface PopupContextValue {
  showPopup: () => void;
  closePopup: () => void;
  popupOpened: boolean
}

const initialValues: PopupContextValue = {
  showPopup: () => null,
  closePopup: () => null,
  popupOpened: false
}

const PopupContext = createContext<PopupContextValue>(initialValues);

interface PopupContextProviderProps {
  children: ReactNode
}

export const PopupContextProvider = ({children}: PopupContextProviderProps) => {
 const [show, setShow] = useState(false);

 const value: PopupContextValue = {
  showPopup: () => setShow(true),
  closePopup: () => setShow(false),
  popupOpened: show
 }

 return (
  <PopupContext.Provider value={value}>
    <PopupFragment show={show} closePopup={() => setShow(false)} />
    <div style={{
      height: "100%",
      width: "100%",
      filter: show ? "blur(2px)" :"none"
    }}>
      {children}
    </div>
  </PopupContext.Provider>
 )
}

export const usePopupContext = (): PopupContextValue => {
  const context = useContext(PopupContext)
  return context;
}