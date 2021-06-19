import { useState, useEffect } from "react";
import { useSocket } from "../../../context/socketContext";
import { useGame } from "../../../context/gameContext";

const useWaitForWord = (onOpen, onClose) => {
	const socket = useSocket();
	const [playerName, setPlayerName] = useState("");
	const { dispatch } = useGame();

	useEffect(() => {
		// For the players who are waiting
		socket.on("word-chosen", chosenWordLength => {
			onClose();
			dispatch({ type: "chosenWordLength", payload: chosenWordLength });
		});
		socket.on("player-choosing-word", (currentPlayer, name) => {
			setPlayerName(name);
			onOpen();
			dispatch({ type: "currentPlayer", payload: currentPlayer });
		});
	}, [socket, setPlayerName, onClose, onOpen, dispatch]);

	return playerName;
};

export default useWaitForWord;
