import React, { createContext, useCallback, useContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
	const [players, setPlayers] = useState({});
	const [adminID, setAdminID] = useState("");
	const [gameStarted, setGameStarted] = useState(false);
	const [chosenWordLength, setChosenWordLength] = useState(0);
	const [currentPlayer, setCurrentPlayer] = useState("");
	const updateData = useCallback((option, data) => {
		switch (option) {
			case "players":
				setPlayers(data);
				break;
			case "adminID":
				setAdminID(data);
				break;
			case "gameStarted":
				setGameStarted(data);
				break;
			case "chosenWordLength":
				setChosenWordLength(data);
				break;
			case "currentPlayer":
				setCurrentPlayer(data);
				break;
			default:
				break;
		}
	}, []);
	return (
		<GameContext.Provider
			value={{
				players,
				adminID,
				gameStarted,
				chosenWordLength,
				currentPlayer,
				updateData,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

const useGame = () => useContext(GameContext);
export { useGame, GameProvider };
