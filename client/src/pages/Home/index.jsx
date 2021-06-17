import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import JoinLobby from "./components/JoinLobby";
//Chakra UI;
import { Heading, Button, Box, Container } from "@chakra-ui/react";

const Home = () => {
	const history = useHistory();

	const joinLobby = lobbyID => {
		history.push(`/lobby/${lobbyID}`);
	};

	function makeRandomLobbyID(length) {
		var result = "";
		var characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	}

	return (
		<Container marginTop="20">
			<Heading textAlign="center" as="h1" size="3xl" margin="8">
				Kirukkals
			</Heading>
			<Box
				padding="8"
				bg="gray.900"
				borderRadius="5"
				d="flex"
				flexDirection="column"
				justifyContent="space-evenly"
			>
				<Box>
					<Button
						as={RouterLink}
						to={`/lobby/${makeRandomLobbyID(10)}`}
						width="100%"
						colorScheme="blue"
					>
						Create a Lobby
					</Button>

					<JoinLobby joinLobby={joinLobby} />
				</Box>
			</Box>
		</Container>
	);
};

export default Home;
