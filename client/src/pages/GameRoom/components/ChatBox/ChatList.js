import React, { useEffect, useRef } from "react";
//ChakraUI
import { Heading, Text, Box, Flex } from "@chakra-ui/layout";
const ChatList = ({ chats }) => {
	const chatListRef = useRef();

	useEffect(() => {
		chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
	}, [chats]);

	return (
		<Flex
			flexDirection="column"
			height="100%"
			overflow="auto"
			ref={chatListRef}
		>
			{chats.map(({ msg, sender, playerName, correct }, index) => (
				<Box
					key={index + sender}
					marginTop="3"
					color={correct ? "green.500" : "white"}
				>
					<Heading size="sm">{playerName}:</Heading>
					<Text>{correct ? "guessed the word" : msg}</Text>
				</Box>
			))}
		</Flex>
	);
};

export default ChatList;
