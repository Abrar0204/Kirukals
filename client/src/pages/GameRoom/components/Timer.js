import React, { useCallback, useEffect, useState, useRef } from "react";
import { useGame } from "../../../context/gameContext";
import { useSocket } from "../../../context/socketContext";

const Timer = ({ lobbyID }) => {
	const [seconds, setSeconds] = useState(10);
	const timerInterval = useRef(0);

	const socket = useSocket();
	const { adminID } = useGame();

	const startTimer = useCallback(() => {
		const countDown = () => {
			let updatedSeconds;
			setSeconds(prev => {
				updatedSeconds = prev - 1;
				return updatedSeconds;
			});

			if (updatedSeconds === 0) {
				if (adminID === socket.id) socket.emit("time-up", lobbyID);
				clearInterval(timerInterval.current);
			}
		};
		timerInterval.current = setInterval(countDown, 1000);
	}, [socket, lobbyID, adminID]);

	useEffect(() => {
		socket.on("start-timer", () => {
			startTimer();
		});
		socket.on("reset-timer", () => {
			timerInterval.current = 0;
			setSeconds(10);
		});
	}, [socket, startTimer, setSeconds]);

	return <div>{seconds}</div>;
};

export default Timer;
