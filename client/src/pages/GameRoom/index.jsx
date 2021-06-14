import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useGame } from "../../context/gameContext";

import ChatBox from "./components/ChatBox";
const GameRoom = ({ match }) => {
	const { gameStarted } = useGame();
	const history = useHistory();
	const lobbyID = match.params.id;
	useEffect(() => {
		if (!gameStarted) history.push(`/lobby/${lobbyID}`);
	}, [gameStarted, history, lobbyID]);
	return (
		<div>
			<ChatBox lobbyID={match.params.id} />
		</div>
	);
};

export default GameRoom;
