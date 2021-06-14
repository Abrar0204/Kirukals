import React, { useEffect } from "react";
import { useSocket } from "../../context/socketContext";
import { useHistory } from "react-router-dom";
import { useGame } from "../../context/gameContext";
import PlayerList from "./components/PlayerList";

const Lobby = ({ match }) => {
	const socket = useSocket();
	const { players, adminID, updateData } = useGame();
	const history = useHistory();
	const lobbyID = match.params.id;

	useEffect(() => {
		socket.emit("join-room", lobbyID);

		socket.on("player-joined", (userId, allPlayers, adminID) => {
			console.log(userId + " joined");

			updateData("players", allPlayers);
			updateData("adminID", adminID);
		});
		socket.on("player-left", (userId, allPlayers) => {
			console.log(userId + " left");
			updateData("players", allPlayers);
		});
		socket.on("start-game", () => {
			updateData("gameStarted", true);
			history.push(`/lobby/${lobbyID}/game`);
		});
	}, [lobbyID, updateData, socket, history]);

	const startGame = () => {
		socket.emit("start-game", socket.id, lobbyID);
		updateData("gameStarted", true);
		history.push(`/lobby/${lobbyID}/game`);
	};

	return (
		<div>
			<h1>{lobbyID}</h1>
			<PlayerList players={players} />
			<div hidden={socket.id !== adminID}>
				<button onClick={startGame}>Start Game</button>
			</div>
		</div>
	);
};

export default Lobby;
