import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import LoginScreen from "./app/screens/LoginScreen";
import TempScreen from "./app/screens/TempScreen";

function App() {
	return <Navigation />;
}

function Navigation() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<LoginScreen />
				</Route>
				<Route path="/temp">
					<TempScreen />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
