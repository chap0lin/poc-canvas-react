import React, {useRef, useEffect, useLayoutEffect} from "react";
import { usePopupContext } from "../../contexts/PopupContextProvider";
import { useGameLoop, useGameState } from "../../hooks";
import { SocketConnection } from "../../events/Socket";

export type GameCallbacks = {
  showPopup: () => void;
}

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showPopup, popupOpened } = usePopupContext()
  const { startGame } = useGameLoop({showPopup})
  const { resumeGame } = useGameState()

  const socket = new SocketConnection()



  useEffect(() => {
    if (popupOpened === false) {
      resumeGame()
    }
  }, [popupOpened])

  const handleSetCurrentPlayer = (playerType: string) => {
    startGame(canvasRef, playerType)
  }

  useLayoutEffect(() => {
    socket.subscribe("PlayerType", "setPlayer", handleSetCurrentPlayer)
  }, [])

  return (
    <div>
      <h1 onClick={showPopup}>Game</h1>
      <canvas style={{border: "1px solid gold"}} ref={canvasRef} width={1280} height={720}></canvas>
    </div>
  )
}