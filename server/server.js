const e = require("express");
const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const UsernameGenerator = require("username-generator");
const wordgen = require("pic-word-gen");

let lobbies = {};

io.on("connection", socket => {
	const id = socket.id.slice(0, 3);
	// console.log(id + " just connected");

	//When Players join a room
	socket.on("join-room", lobbyID => {
		socket.join(lobbyID);
		let lobby = lobbies[lobbyID];
		let playerName = UsernameGenerator.generateUsername(" ", 10);

		if (lobby) {
			let player = lobby.players[socket.id];
			if (player === undefined) {
				//Add player to lobby
				lobbies[lobbyID] = {
					adminID: lobby.adminID,
					players: {
						...lobby.players,
						[socket.id]: {
							id: socket.id,
							admin: false,
							playerName,
						},
					},
				};
			} else {
				console.log("Player Already Joined");
				return;
			}
		} else {
			//create a new lobby with first player
			lobbies[lobbyID] = {
				adminID: socket.id,
				players: {
					[socket.id]: { id: socket.id, admin: true, playerName },
				},
			};
		}

		io.in(lobbyID).emit(
			"player-joined",
			socket.id,
			lobbies[lobbyID].players,
			lobbies[lobbyID].adminID
		);
		console.log(id + " joined " + lobbyID);
	});

	//Start Game
	socket.on("start-game", (adminID, lobbyID) => {
		if (socket.id !== adminID) return;
		let lobbyPlayers = lobbies[lobbyID].players;
		if (Object.keys(lobbyPlayers).length < 2) return;

		lobbies[lobbyID].turns = [];

		Object.keys(lobbyPlayers).forEach(playerKey =>
			lobbies[lobbyID].turns.push(playerKey)
		);

		lobbies[lobbyID].currentPlayerIndex = lobbies[lobbyID].turns.length - 1;

		socket.to(lobbyID).emit("start-game");
	});

	//Begin Round
	socket.on("begin-round", lobbyID => {
		let lobby = lobbies[lobbyID];
		let currentPlayer = lobby.turns[lobby.currentPlayerIndex];
		if (socket.id !== currentPlayer) return;

		let words = [
			wordgen.generateWord(),
			wordgen.generateWord(),
			wordgen.generateWord(),
		];
		// console.log(socket.id);
		io.to(currentPlayer).emit("choose-word", words);
		io.to(lobbyID).emit("player-choosing-word", currentPlayer);
	});

	//Player Chose Word
	socket.on("word-chosen", (lobbyID, word) => {
		let lobby = lobbies[lobbyID];
		lobby.correctWord = word;
		lobby.timeLimit = 60;
		lobby.interval = setInterval(() => {
			lobby.timeLimit--;
			if (lobby.timeLimit < 0) {
				lobby.timeLimit = 60;
				clearInterval(lobby.interval);
				io.to(lobbyID).emit("end-timer");
			}
			io.to(lobbyID).emit("timer");
		}, 1000);
		io.to(lobbyID).emit("start-timer");
		socket.to(lobbyID).emit("word-chosen", word.length);
	});

	//Guess Word
	socket.on("guess-word", (word, lobbyID) => {
		// console.log(lobbies[lobbyID].players);

		let lobby = lobbies[lobbyID];
		// console.log(socket.id, lobby.turns[lobby.currentPlayerIndex]);
		let playerName = lobby.players[socket.id].playerName;
		//If player send message before choosing word
		if (lobby.correctWord === undefined) {
			return io
				.to(lobbyID)
				.emit("wrong-guess", word, socket.id, playerName);
		}
		//Checking for correct word
		if (
			word.toLowerCase() === lobby.correctWord.toLowerCase() &&
			socket.id !== lobby.turns[lobby.currentPlayerIndex]
		) {
			io.to(lobbyID).emit("correct-guess", word, socket.id, playerName);
		} else {
			io.to(lobbyID).emit("wrong-guess", word, socket.id, playerName);
		}
	});

	socket.on("time-up", lobbyID => {
		console.log("time up by " + socket.id);
		//Reset the timer
		io.to(lobbyID).emit("reset-timer");
		// let prevPlayerIndex = lobbies[lobbyID].currentPlayerIndex;
		// // Only execute once (for current player)
		// if (lobbies[lobbyID].turns[prevPlayerIndex] !== socket.id) return;

		//Change current player
		let currentPlayerIndex = lobbies[lobbyID].currentPlayerIndex - 1;

		//Reset Round - !TODO
		if (currentPlayerIndex < 0) {
			currentPlayerIndex = lobbies[lobbyID].turns.length - 1;
		}

		//Update lobby to next player
		lobbies[lobbyID].currentPlayerIndex = currentPlayerIndex;

		let lobby = lobbies[lobbyID];
		let currentPlayer = lobby.turns[currentPlayerIndex];

		let words = [
			wordgen.generateWord(),
			wordgen.generateWord(),
			wordgen.generateWord(),
		];

		io.to(currentPlayer).emit("choose-word", words);
		io.to(lobbyID).emit("player-choosing-word", currentPlayer);
	});

	//End Round
	socket.on("end-round", () => {});

	//Disoconnectiong players
	socket.on("disconnecting", () => {
		// Rooms where the player is a member

		let rooms = Array.from(socket.rooms); // [userId, roomId1, roomId2,..]

		// First Room is the user themself so loop through the rest
		if (rooms.length > 1) {
			for (let i = 1; i < rooms.length; i++) {
				let item = rooms[i];
				let lobby = lobbies[item].players;
				delete lobby[socket.id];
				io.in(item).emit(
					"player-left",
					socket.id,
					lobbies[item].players
				);
			}
		}
		console.log(socket.id.slice(0, 3) + " disconnected");
	});
});

// if (process.env.NODE_ENV === "production") {
//Express serves up static files

__dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client", "build")));

//Express return index.html
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "client", "build", "index.html"))
);
// } else {
// 	app.get("/", (req, res) => {
// 		res.send("Kirukkals");
// 	});
// }

http.listen(process.env.PORT || 5000, () => console.log("Server Started"));
