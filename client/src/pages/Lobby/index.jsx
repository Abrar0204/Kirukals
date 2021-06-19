import React from "react";
import PlayerList from "./components/PlayerList";
//Chakra UI
import { Button, Container, Heading, Box } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import useGameLogic from "./hooks/useGameLogic";

const Lobby = ({ match }) => {
	const lobbyID = match.params.id;
	const [players, isAdmin, startGame] = useGameLogic(lobbyID);

	const copyUrl = async () => {
		try {
			await navigator.clipboard.writeText(lobbyID);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Container marginTop="20">
			<Heading as="h1" size="xl" marginBottom="8">
				Lobby ID: {lobbyID}{" "}
				<Button onClick={copyUrl}>
					<CopyIcon />
				</Button>
			</Heading>
			<Box
				padding="8"
				bg="gray.900"
				borderRadius="5"
				d="flex"
				flexDirection="column"
				justifyContent="space-evenly"
			>
				<PlayerList players={players} />

				<Button
					onClick={startGame}
					colorScheme="blue"
					disabled={!isAdmin}
				>
					Start Game
				</Button>
			</Box>
		</Container>
	);
};

export default Lobby;
