import React, { useState } from "react";
//ChakraUI
import { FormControl, FormLabel, Input, Button, Flex } from "@chakra-ui/react";
const SendMessage = ({ sendMessage }) => {
	const [message, setMessage] = useState("");
	const handleInput = e => {
		const { value } = e.target;
		setMessage(value);
	};

	const sendMessageHandler = e => {
		e.preventDefault();
		sendMessage(message);
		setMessage("");
	};

	return (
		<Flex
			as="form"
			alignItems="flex-end"
			marginTop="5"
			onSubmit={sendMessageHandler}
		>
			<FormControl paddingRight="2">
				<FormLabel htmlFor="message" hidden>
					Message
				</FormLabel>
				<Input
					placeholder="Enter Message"
					name="message"
					type="text"
					value={message}
					onChange={handleInput}
				/>
			</FormControl>
			<Button type="submit">Send</Button>
		</Flex>
	);
};

export default SendMessage;
