const e = require("express");
const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const UsernameGenerator = require("username-generator");
let lobbies = {};

io.on("connection", socket => {
	const id = socket.id.slice(0, 3);
	console.log(id + " just connected");
	//For Messaging to room
	socket.on("message", (msg, lobbyID) => {
		// console.log(lobbies[lobbyID].players);
		let playerName = lobbies[lobbyID].players[socket.id].playerName;
		socket.to(lobbyID).emit("message", msg, socket.id, playerName);
	});
	//When Players join a room
	socket.on("join-room", lobbyID => {
		socket.join(lobbyID);
		let lobby = lobbies[lobbyID];
		let playerName = UsernameGenerator.generateUsername("-");
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
					[socket.id]: { id: socket.id, admin: false, playerName },
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
		socket.to(lobbyID).emit("start-game");
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

if (process.env.NODE_ENV === "production") {
	//Express serves up static files
	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, "client", "build")));

	//Express return index.html
	app.get("*", (req, res) =>
		res.sendFile(path.join(__dirname, "client", "build", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("Kirukkals");
	});
}

http.listen(process.env.PORT || 5000, () => console.log("Server Started"));
