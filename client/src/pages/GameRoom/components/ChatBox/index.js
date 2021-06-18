import React, { useState, useEffect } from "react";
import { useSocket } from "../../../../context/socketContext";
import SendMessage from "./SendMessage";
import ChatList from "./ChatList";
//ChakraUI
import { Flex } from "@chakra-ui/layout";
const ChatBox = ({ lobbyID }) => {
	const socket = useSocket();

	const [chats, setChats] = useState([]);

	useEffect(() => {
		socket.on("correct-guess", (msg, sender, playerName) => {
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
	}, [socket]);

	const sendMessage = message => {
		socket.emit("guess-word", message, lobbyID);
	};
	return (
		<Flex height="80vh" flexDirection="column" width="20%">
			<ChatList chats={chats} />
			<SendMessage sendMessage={sendMessage} />
		</Flex>
	);
};

export default ChatBox;
