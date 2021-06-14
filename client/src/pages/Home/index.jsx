import React from "react";
import { Link, useHistory } from "react-router-dom";
import JoinLobby from "./components/JoinLobby";

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
		<div>
			Home
			<div>
				<Link to={`/lobby/${makeRandomLobbyID(10)}`}>
					Create a Lobby
				</Link>
			</div>
			<div>
				<JoinLobby joinLobby={joinLobby} />
			</div>
		</div>
	);
};

export default Home;
