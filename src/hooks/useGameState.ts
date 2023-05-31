import { State } from "../gameLogic/state"

export const useGameState = () => {
  const state = new State()
  return {
    setCurrentPlayer: state.setCurrentPlayer,
    paused: state.paused,
    resumeGame: () => state.resumeGame(),
    pauseGame: () => state.pauseGame()
  }
}