import React from "react";

const PlayerList = ({ players }) => {
	return (
		<div>
			<h1>Players</h1>
			<div>
				{Object.values(players).map(player => (
					<p key={player.id}>{player.playerName}</p>
				))}
			</div>
		</div>
	);
};

export default PlayerList;
