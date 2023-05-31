import { RefObject } from "react"
import { GameCallbacks } from "../scenes/Game"
import { InputHandler } from "../events/InputHandler"
import { State } from "../gameLogic/state"
import { SocketConnection } from "../events/Socket"

export const useGameLoop = (gameCallbacks: GameCallbacks) => {
  let ctx: CanvasRenderingContext2D
  let x = 0
  let basePlayerY = 200
  let baseEnemyY = 400
  let currentY = 200
  let enemyY = 400

  const gameLoop = (ts: number) => {
    const state = new State();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1280, 720);

    console.log(state.currentPlayer)

    if (state.currentPlayer === "One") {
      ctx.fillStyle = "green"
      ctx.fillRect(x, currentY, 20, 20);
      ctx.fillStyle = "red"
      ctx.fillRect(x, enemyY, 20, 20);
    } else if (state.currentPlayer === "Two"){
      ctx.fillStyle = "red"
      ctx.fillRect(x, currentY, 20, 20);
      ctx.fillStyle = "green"
      ctx.fillRect(x, enemyY, 20, 20);
    }

    currentY = currentY !== basePlayerY ? currentY + 1 : basePlayerY
    enemyY = enemyY !==baseEnemyY ? enemyY + 1 : baseEnemyY

    if (x > 1260) {
      x = 0
      gameCallbacks.showPopup()
      state.pauseGame()
    } else {
      x++
    }

    requestAnimationFrame(gameLoop)
  }


  const handleJump = () => {
    const state = new State()
    if (!state.paused) {
      currentY = basePlayerY - 50
      const socket = new SocketConnection()
      socket.movePlayer(basePlayerY - 50)
    }
  }

  const handleEnemyMove = (positions: any) => {
    const state = new State();
    console.log(positions)
    if (state.currentPlayer === "One") {
      enemyY = positions.two.y
    } else if (state.currentPlayer === "Two"){
      enemyY = positions.one.y
    }
  }
  
  const startGame = (ref: RefObject<HTMLCanvasElement>, playerType: string) => {
    if (!ref.current) return null
    const gameCtx = ref.current.getContext("2d")
    if (!gameCtx) return null
    ctx = gameCtx
    const inputHandler = new InputHandler();
    const state = new State();
    const socket = new SocketConnection()
    state.setCurrentPlayer(playerType)
    if (playerType === "One"){
      basePlayerY = 200
      currentY = basePlayerY
      baseEnemyY = 400
      enemyY = baseEnemyY
    } else if (playerType === "Two") {
      basePlayerY = 400
      currentY = basePlayerY
      baseEnemyY = 200
      enemyY = baseEnemyY
    }
    inputHandler.subscribe("keyDown", "jump", handleJump.bind(this))
    socket.subscribe("PlayerPositionChange", "enemyMove", handleEnemyMove)
    requestAnimationFrame(gameLoop)
  }

  return {
    startGame
  }
}