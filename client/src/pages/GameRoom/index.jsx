import React, { useEffect } from "react";
import { useHistory } from "react-router";

import { useGame } from "../../context/gameContext";
import { useSocket } from "../../context/socketContext";

import ChatBox from "./components/ChatBox";
import Canvas from "./components/Canvas";
import LeaderBoard from "./components/LeaderBoard";
import InfoModal from "./components/InfoModal";
//ChakraUI
import { Flex } from "@chakra-ui/react";

const GameRoom = ({ match }) => {
	const socket = useSocket();
	const { gameStarted, players, updateData } = useGame();

	const history = useHistory();
	const lobbyID = match.params.id;

	useEffect(() => {
		socket.emit("begin-round", lobbyID);
	}, [socket, lobbyID, updateData]);

	useEffect(() => {
		if (!gameStarted) history.push(`/lobby/${lobbyID}`);
	}, [gameStarted, history, lobbyID]);

	return (
		<Flex height="100vh" alignItems="center" justifyContent="space-evenly">
			<InfoModal lobbyID={lobbyID} />
			<LeaderBoard players={players} lobbyID={lobbyID} />
			<Canvas />
			<ChatBox lobbyID={match.params.id} />
		</Flex>
	);
};

export default GameRoom;
