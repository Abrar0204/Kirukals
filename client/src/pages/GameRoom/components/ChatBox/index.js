import React from "react";
import SendMessage from "./SendMessage";
import ChatList from "./ChatList";
import useChat from "../../hooks/useChat";
//ChakraUI
import { Flex } from "@chakra-ui/layout";

const ChatBox = ({ lobbyID }) => {
	const [chats, sendMessage] = useChat(lobbyID);

	return (
		<Flex height="80vh" flexDirection="column" width="20%">
			<ChatList chats={chats} />
			<SendMessage sendMessage={sendMessage} />
		</Flex>
	);
};

export default ChatBox;
