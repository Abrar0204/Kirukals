import { useEffect, useState } from "react";
import { useGame } from "../../../context/gameContext";
import { useSocket } from "../../../context/socketContext";

const useTimer = (timeLimit, lobbyID) => {
	const [seconds, setSeconds] = useState(timeLimit);

	const socket = useSocket();
	const { adminID } = useGame();

	useEffect(() => {
		socket.on("timer", timeLeft => {
			//Update Timer
			setSeconds(timeLeft);
		});
		socket.on("end-timer", () => {
			//Reset Timer
			setSeconds(timeLimit);
			if (socket.id === adminID) socket.emit("end-round", lobbyID);
		});
	}, [socket, setSeconds, adminID, lobbyID, timeLimit]);

	return seconds;
};

export default useTimer;
