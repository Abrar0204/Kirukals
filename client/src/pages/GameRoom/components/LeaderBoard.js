import React from "react";
import Timer from "./Timer";
import { Box, Heading, Avatar, Text } from "@chakra-ui/react";
const LeaderBoard = ({ players, lobbyID }) => {
	return (
		<Box height="80vh" width="20%">
			<Box>
				<Timer lobbyID={lobbyID} />
			</Box>
			<Heading as="h2" size="lg">
				LeaderBoard
			</Heading>
			<Box marginTop="2">
				{Object.values(players).map(player => (
					<Box
						key={player.id}
						display="flex"
						alignItems="center"
						margin="2"
						padding="2"
						border="ActiveBorder"
					>
						<Avatar name={player.playerName} marginRight="4" />
						<Text as="h3" size="lg">
							{player.playerName}
						</Text>
						<Text as="h3" size="md">
							score: {player.score}
						</Text>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default LeaderBoard;
