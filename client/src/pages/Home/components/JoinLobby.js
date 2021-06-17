import React, { useState } from "react";
//Chakra UI;
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Flex } from "@chakra-ui/react";
const JoinLobby = ({ joinLobby }) => {
	const [lobbyID, setLobbyID] = useState("");

	const handleInput = e => {
		const { value } = e.target;
		setLobbyID(value);
	};
	const joinLobbyHandler = e => {
		e.preventDefault();
		joinLobby(lobbyID);
	};
	return (
		<Flex
			as="form"
			alignItems="flex-end"
			marginTop="5"
			onSubmit={joinLobbyHandler}
		>
			<FormControl paddingRight="3">
				<FormLabel htmlFor="lobbyID" hidden>
					Lobby ID
				</FormLabel>
				<Input
					placeholder="Lobby ID"
					name="lobbyID"
					type="text"
					value={lobbyID}
					onChange={handleInput}
				/>
			</FormControl>
			<Button type="submit">Join Lobby</Button>
		</Flex>
	);
};

export default JoinLobby;
