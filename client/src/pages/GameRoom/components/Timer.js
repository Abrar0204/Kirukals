import React from "react";
import useTimer from "../hooks/useTimer";

const Timer = ({ lobbyID }) => {
	const seconds = useTimer(60, lobbyID);

	return <div>{seconds}</div>;
};

export default Timer;
