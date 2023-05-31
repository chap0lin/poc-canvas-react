import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

class State {
  static instance;
  playerOne;
	playerTwo;
	positions = {
		one: {
			y: 200
		},
		two: {
			y: 400
		}
	}

  constructor() {
    if (!!State.instance) {
      return State.instance;
    }
    State.instance = this;
  }
}

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	const state = new State()
	if (!state.playerOne){
    state.playerOne = socket
    console.log("Player One Ready!")
    socket.emit("player-type", "One")
  }else if (!state.playerTwo){
    state.playerTwo = socket
    console.log("Player Two Ready")
    socket.emit("player-type", "Two")
  }else{
    console.log("Extra player")
    socket.emit("player-type", "Extra")
  }
	socket.on("player-move", (newY) => {
		if (socket === state.playerOne){
			state.positions.one.y = newY
		} else if (socket === state.playerTwo) {
			state.positions.two.y = newY
		}

		socket.broadcast.emit("player-position-change", state.positions)
	});

	// socket.on("callUser", ({ userToCall, signalData, from, name }) => {
	// 	io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	// });

	// socket.on("answerCall", (data) => {
	// 	io.to(data.to).emit("callAccepted", data.signal)
	// });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
