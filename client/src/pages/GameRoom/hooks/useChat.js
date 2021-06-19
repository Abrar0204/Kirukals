import { useEffect, useState } from "react";
import { useGame } from "../../../context/gameContext";
import { useSocket } from "../../../context/socketContext";

const useChat = lobbyID => {
	const socket = useSocket();
	const { dispatch } = useGame();
	const [chats, setChats] = useState([]);

	useEffect(() => {
		socket.on("correct-guess", (msg, sender, playerName, currentPlayer) => {
			dispatch({ type: "score", payload: sender });
			setChats(prev => [
				...prev,
				{ msg, sender, playerName, correct: true },
			]);
		});
		socket.on("wrong-guess", (msg, sender, playerName) => {
			setChats(prev => [
				...prev,
				{ msg, sender, playerName, correct: false },
			]);
		});
	}, [socket, dispatch]);

	const sendMessage = message => {
		socket.emit("guess-word", message, lobbyID);
	};
	return [chats, sendMessage];
};

export default useChat;
