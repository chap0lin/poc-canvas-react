import React, {useState, useEffect, useLayoutEffect} from "react";

type Props = {
  show?: boolean;
  closePopup: () => void;
}

export const PopupFragment = ({ show, closePopup }: Props) => {

  return (
    <div style={{
      display: show ? "flex" : "none",
      height: "100%",
      width: "100%",
      background: "rgba(0,0,0, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: 0
    }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "white",
          width: "400px",
          height: "300px"
        }}
      >
        <h1>Popup</h1>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  )
}