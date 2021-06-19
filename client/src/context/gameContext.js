import React, { createContext, useContext, useReducer } from "react";

const GameContext = createContext();

const initialData = {
	players: {},
	adminID: "",
	gameStarted: false,
	chosenWordLength: 0,
	currentPlayer: "",
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case "players":
			return { ...state, players: payload };

		case "score":
			const sender = payload;
			const currentPlayer = state.currentPlayer;
			const players = state.players;
			return {
				...state,
				players: {
					...players,
					[sender]: {
						...players[sender],
						score: players[sender].score + 10,
					},
					[currentPlayer]: {
						...players[currentPlayer],
						score: players[currentPlayer].score + 2,
					},
				},
			};

		case "adminID":
			return { ...state, adminID: payload };

		case "gameStarted":
			return { ...state, gameStarted: payload };

		case "chosenWordLength":
			return { ...state, chosenWordLength: payload };

		case "currentPlayer":
			return { ...state, currentPlayer: payload };

		default:
			return state;
	}
};

const GameProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialData);

	return (
		<GameContext.Provider
			value={{
				...state,
				dispatch,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

const useGame = () => useContext(GameContext);
export { useGame, GameProvider };

// const [players, setPlayers] = useState({});
// const [adminID, setAdminID] = useState("");
// const [gameStarted, setGameStarted] = useState(false);
// const [chosenWordLength, setChosenWordLength] = useState(0);
// const [currentPlayer, setCurrentPlayer] = useState("");

// const updateData = useCallback(
// 	(option, data) => {
// 		switch (option) {
// 			case "players":
// 				setPlayers(data);
// 				break;
// 			case "score":
// 				console.log(data);
// 				const sender = data;
// 				setPlayers(prev => ({
// 					...prev,
// 					[sender]: { ...prev[sender], score: prev[sender] + 10 },
// 					[currentPlayer]: {
// 						...prev[currentPlayer],
// 						score: prev[currentPlayer] + 5,
// 					},
// 				}));
// 				break;
// 			case "adminID":
// 				setAdminID(data);
// 				break;
// 			case "gameStarted":
// 				setGameStarted(data);
// 				break;
// 			case "chosenWordLength":
// 				setChosenWordLength(data);
// 				break;
// 			case "currentPlayer":
// 				setCurrentPlayer(data);
// 				break;
// 			default:
// 				break;
// 		}
// 	},
// 	[
// 		setPlayers,
// 		setAdminID,
// 		setGameStarted,
// 		setChosenWordLength,
// 		setCurrentPlayer,
// 	]
// );
