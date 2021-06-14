import React, { createContext, useCallback, useContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
	const [players, setPlayers] = useState({});
	const [adminID, setAdminID] = useState("");
	const [gameStarted, setGameStarted] = useState(false);

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
			default:
				break;
		}
	}, []);
	return (
		<GameContext.Provider
			value={{ players, adminID, gameStarted, updateData }}
		>
			{children}
		</GameContext.Provider>
	);
};

const useGame = () => useContext(GameContext);
export { useGame, GameProvider };
