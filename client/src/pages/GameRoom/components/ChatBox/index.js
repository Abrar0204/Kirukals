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
		socket.on("message", (msg, sender, playerName) => {
			setChats(prev => [...prev, { msg, sender, playerName }]);
		});
	}, [socket]);

	const sendMessage = message => {
		setChats(prev => [
			...prev,
			{ msg: message, sender: socket.id, playerName: "You" },
		]);
		socket.emit("message", message, lobbyID);
	};
	return (
		<Flex height="80vh" flexDirection="column" width="20%">
			<ChatList chats={chats} />
			<SendMessage sendMessage={sendMessage} />
		</Flex>
	);
};

export default ChatBox;
