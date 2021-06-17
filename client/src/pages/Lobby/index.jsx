import React, { useEffect } from "react";
import { useSocket } from "../../context/socketContext";
import { useHistory } from "react-router-dom";
import { useGame } from "../../context/gameContext";
import PlayerList from "./components/PlayerList";
//Chakra UI
import { Button, Container, Heading, Box } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
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

	const copyUrl = async () => {
		try {
			await navigator.clipboard.writeText(lobbyID);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Container marginTop="20">
			<Heading as="h1" size="xl" marginBottom="8">
				Lobby ID: {lobbyID}{" "}
				<Button onClick={copyUrl}>
					<CopyIcon />
				</Button>
			</Heading>
			<Box
				padding="8"
				bg="gray.900"
				borderRadius="5"
				d="flex"
				flexDirection="column"
				justifyContent="space-evenly"
			>
				<PlayerList players={players} />

				<Button
					onClick={startGame}
					colorScheme="blue"
					disabled={socket.id !== adminID}
				>
					Start Game
				</Button>
			</Box>
		</Container>
	);
};

export default Lobby;
