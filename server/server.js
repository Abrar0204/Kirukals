const e = require("express");
const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const UsernameGenerator = require("username-generator");
const wordgen = require("pic-word-gen");

const lobbies = {};
const timePerRound = 10;

io.on("connection", socket => {
	const id = socket.id.slice(0, 3);
	// console.log(id + " just connected");

	//When Players join a room
	socket.on("join-room", lobbyID => {
		socket.join(lobbyID);
		let lobby = lobbies[lobbyID];
		let playerName = UsernameGenerator.generateUsername(" ", 14);

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
							score: 0,
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
					[socket.id]: {
						id: socket.id,
						admin: true,
						playerName,
						score: 0,
					},
				},
			};
		}
		console.log(lobbies[lobbyID].players);
		io.in(lobbyID).emit(
			"player-joined",
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

		lobbies[lobbyID].currentPlayerIndex = 0;

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
		io.to(lobbyID).emit(
			"player-choosing-word",
			currentPlayer,
			lobby.players[currentPlayer].playerName
		);
	});

	//Player Chose Word
	socket.on("word-chosen", (lobbyID, word) => {
		let lobby = lobbies[lobbyID];
		lobby.correctWord = word;

		//Timer
		lobby.timeLimit = timePerRound;
		//Send timeleft to every player with a interval of one second
		lobby.interval = setInterval(() => {
			lobby.timeLimit--;
			io.to(lobbyID).emit("timer", lobby.timeLimit);

			if (lobby.timeLimit === 0) {
				lobby.timeLimit = timePerRound;
				clearInterval(lobby.interval);
				io.to(lobbyID).emit("end-timer");
			}
		}, 1000);

		socket.to(lobbyID).emit("word-chosen", word.length);
	});

	//Guess Word
	socket.on("guess-word", (word, lobbyID) => {
		let lobby = lobbies[lobbyID];
		let playerName = lobby.players[socket.id].playerName;

		//If player send message before choosing word
		if (lobby.correctWord === undefined) {
			io.to(lobbyID).emit("wrong-guess", word, socket.id, playerName);
			return;
		}
		//Checking for correct word
		if (
			word.toLowerCase() === lobby.correctWord.toLowerCase() &&
			socket.id !== lobby.turns[lobby.currentPlayerIndex]
		) {
			// Add points to guesser and drawer
			lobby.players[socket.id].score += 10;
			lobby.players[lobby.turns[lobby.currentPlayerIndex]].score += 2;

			//To keep track of no of correct guesses
			lobby.correctGuesses = lobby.correctGuesses
				? lobby.correctGuesses + 1
				: 1;

			//If everyone guessed end round
			if (lobby.correctGuesses === lobby.turns.length - 1) {
				// Rest correct guesses and end timer
				lobby.correctGuesses = 0;
				io.to(lobbyID).emit(
					"correct-guess",
					word,
					socket.id,
					playerName
				);
				lobby.timeLimit = timePerRound;
				clearInterval(lobby.interval);
				io.to(lobbyID).emit("end-timer");
				return;
			}

			io.to(lobbyID).emit("correct-guess", word, socket.id, playerName);
		} else {
			io.to(lobbyID).emit("wrong-guess", word, socket.id, playerName);
		}
	});

	//End Round
	socket.on("end-round", lobbyID => {
		//Change current player
		let currentPlayerIndex = lobbies[lobbyID].currentPlayerIndex + 1;

		//Reset Round - !TODO
		if (currentPlayerIndex === lobbies[lobbyID].turns.length) {
			currentPlayerIndex = 0;
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
		io.to(lobbyID).emit(
			"player-choosing-word",
			currentPlayer,
			lobby.players[currentPlayer].playerName
		);
	});

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
				io.in(item).emit("player-left", lobbies[item].players);
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
