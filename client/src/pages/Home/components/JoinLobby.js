import React, { useState } from "react";

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
		<div>
			<form onSubmit={joinLobbyHandler}>
				<div>
					<label htmlFor="lobbyID">Lobby ID</label>
					<input
						name="lobbyID"
						type="text"
						value={lobbyID}
						onChange={handleInput}
					/>
				</div>
				<button type="submit">Join Lobby</button>
			</form>
		</div>
	);
};

export default JoinLobby;
