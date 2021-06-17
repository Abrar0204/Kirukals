import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useGame } from "../../context/gameContext";

import ChatBox from "./components/ChatBox";
import Canvas from "./components/Canvas";
import LeaderBoard from "./components/LeaderBoard";
//ChakraUI
import { Flex } from "@chakra-ui/react";

const GameRoom = ({ match }) => {
	const { gameStarted, players } = useGame();
	const history = useHistory();
	const lobbyID = match.params.id;
	useEffect(() => {
		if (!gameStarted) history.push(`/lobby/${lobbyID}`);
	}, [gameStarted, history, lobbyID]);
	return (
		<Flex height="100vh" alignItems="center" justifyContent="space-evenly">
			<LeaderBoard players={players} />
			<Canvas />
			<ChatBox lobbyID={match.params.id} />
		</Flex>
	);
};

export default GameRoom;
