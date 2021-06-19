import { useState, useEffect } from "react";
import { useSocket } from "../../../context/socketContext";
import { useGame } from "../../../context/gameContext";

const useWaitForWord = (onOpen, onClose) => {
	const socket = useSocket();
	const [playerName, setPlayerName] = useState("");
	const { updateData } = useGame();

	useEffect(() => {
		// For the players who are waiting
		socket.on("word-chosen", chosenWordLength => {
			onClose();
			updateData("chosenWordLength", chosenWordLength);
		});
		socket.on("player-choosing-word", (currentPlayer, name) => {
			setPlayerName(name);
			onOpen();
			updateData("currentPlayer", currentPlayer);
		});
	}, [socket, setPlayerName, updateData]);

	return playerName;
};

export default useWaitForWord;
