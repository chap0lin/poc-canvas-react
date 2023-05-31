export type Observer = {
  name: string,
  observerFunction: any
}

export type EventObservers = {
  keyDown: Observer[];
  keyUp: Observer[];
  mouseMove: Observer[];
  mouseClick: Observer[];
}

export class InputHandler {
  private static instance: InputHandler;
  observers: EventObservers = {
    keyDown: [],
    keyUp: [],
    mouseMove: [],
    mouseClick: [],
  };

  constructor() {
    if (!!InputHandler.instance) {
      return InputHandler.instance;
    }
    InputHandler.instance = this;

    // Right now these listeners are set to get the whole document
    // Maybe we want to define listeners only on the canvas for something
    // It can make sense to have this listneners beeing set inside a function
    // And have that function being called from the Scene or GameLoop passing the ref
    // And then we can define the event listeners from there and use this same logic

    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
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
  handleKeydown(evt: KeyboardEvent) {
    this.notifyAll("keyDown", evt.key);
  }
  handleKeyUp(evt: KeyboardEvent) {
    this.notifyAll("keyUp", evt.key);
  }
  handleMouseMove(evt: MouseEvent) {
    this.notifyAll("mouseMove", evt);
  }
  handleMouseDown(evt: MouseEvent) {
    this.notifyAll("mouseClick", evt);
  }
}
