import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
	let socket = useMemo(() => io(), []);

	useEffect(() => {
		socket.on("connect", () => {
			console.log(socket.id);
		});
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

const useSocket = () => useContext(SocketContext);
export { useSocket, SocketProvider };
