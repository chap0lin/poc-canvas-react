import { io, Socket } from 'socket.io-client';

export type Observer = {
  name: string,
  observerFunction: any
}

export type EventObservers = {
  PlayerPositionChange: Observer[];
  StateUpdate: Observer[];
  PlayerType: Observer[];
}

export class SocketConnection {
  private static instance: SocketConnection;
  socket!: Socket;
  observers: EventObservers = {
    PlayerPositionChange: [],
    StateUpdate: [],
    PlayerType: []
  };

  constructor() {
    if (!!SocketConnection.instance) {
      return SocketConnection.instance;
    }
    SocketConnection.instance = this;
    this.socket = io("http://localhost:5000");
    this.addListeners()
  }

  addListeners() {
    this.socket.on("player-position-change", this.handlePositionChange.bind(this))
    this.socket.on("state-update", this.handleStateUpdate.bind(this))
    this.socket.on("player-type", this.handlePlayerType.bind(this))
  }

  movePlayer(newY: number) {
    this.socket.emit("player-move", newY)
  }

  isTopic(topic: keyof EventObservers) {
    return !!this.observers[topic];
  }
  subscribe(topic: keyof EventObservers, name: string, observerFunction: any) {
    if (this.isTopic(topic)) {
      this.observers[topic].push({ name, observerFunction });
    } else {
      console.log(`The topic ${topic} does not exist!`);
    }
  }
  unsubscribe = (topic: keyof EventObservers, functionToRemove: string) => {
    if (this.isTopic(topic)) {
      this.observers[topic] = this.observers[topic].filter(
        (funct) => funct.name !== functionToRemove
      );
    } else {
      console.log(`The topic ${topic} does not exist!`);
    }
  };
  notifyAll(topic: keyof EventObservers, command: any) {
    const functionList = this.observers[topic];
    functionList.forEach((observer: any) => observer.observerFunction(command));
  }
  handlePositionChange(payload: any) {
    this.notifyAll("PlayerPositionChange", payload)
  }
  handleStateUpdate(payload: any) {
    this.notifyAll("StateUpdate", payload)
  }
  handlePlayerType(payload: any) {
    console.log("PlayerType", payload)
    this.notifyAll("PlayerType", payload)
  }
}
