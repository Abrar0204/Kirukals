import { useState, useEffect } from "react";
import { useSocket } from "../../../context/socketContext";
import { useGame } from "../../../context/gameContext";

const useChooseWord = onOpen => {
	const socket = useSocket();

	const [words, setWords] = useState([]);

	const { updateData } = useGame();

	useEffect(() => {
		// For the player who is choosing a word
		socket.on("choose-word", words => {
			setWords(words);
			onOpen();
		});
	}, [socket, onOpen, updateData, setWords]);

	const resetWords = () => setWords([]);

	return [words, resetWords];
};

export default useChooseWord;
