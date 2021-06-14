import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SocketProvider } from "./context/socketContext";
import { GameProvider } from "./context/gameContext";

import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import GameRoom from "./pages/GameRoom";

const App = () => {
	return (
		<Router>
			<SocketProvider>
				<GameProvider>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/lobby/:id" exact component={Lobby} />
						<Route path="/lobby/:id/game" component={GameRoom} />
					</Switch>
				</GameProvider>
			</SocketProvider>
		</Router>
	);
};

export default App;
