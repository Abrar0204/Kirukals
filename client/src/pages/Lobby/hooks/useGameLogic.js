import { useEffect } from "react";
import { useSocket } from "../../../context/socketContext";
import { useHistory } from "react-router-dom";
import { useGame } from "../../../context/gameContext";
const useGameLogic = lobbyID => {
	const socket = useSocket();
	const { players, adminID, dispatch } = useGame();
	const history = useHistory();
	// const [isAdmin, setIsAdmin] = useState(socket.id === adminID);
	const isAdmin = socket.id === adminID;

	useEffect(() => {
		socket.emit("join-room", lobbyID);

		socket.on("player-joined", (allPlayers, adminID) => {
			dispatch({ type: "players", payload: allPlayers });
			// setIsAdmin(socket.id === adminID);
			dispatch({ type: "adminID", payload: adminID });
		});

		socket.on("player-left", allPlayers => {
			dispatch({ type: "players", payload: allPlayers });
		});

		socket.on("start-game", () => {
			dispatch({ type: "gameStarted", payload: true });
			history.push(`/lobby/${lobbyID}/game`);
		});
	}, [lobbyID, socket, history, dispatch]);

	const startGame = () => {
		// Dont start game until there are atleast two player
		if (Object.keys(players).length < 2) return;
		socket.emit("start-game", socket.id, lobbyID);
		dispatch({ type: "gameStarted", payload: true });
		history.push(`/lobby/${lobbyID}/game`);
	};

	return [players, isAdmin, startGame];
};

export default useGameLogic;
