import { useState, useEffect } from "react";
import { useSocket } from "../../../context/socketContext";

const useChooseWord = (onOpen, onClose, lobbyID) => {
	const socket = useSocket();

	const [words, setWords] = useState([]);

	useEffect(() => {
		// For the player who is choosing a word
		socket.on("choose-word", words => {
			setWords(words);
			onOpen();
		});
	}, [socket, onOpen, setWords]);

	const chooseWord = word => {
		socket.emit("word-chosen", lobbyID, word);
		onClose();
		setWords([]);
	};

	return [words, chooseWord];
};

export default useChooseWord;
