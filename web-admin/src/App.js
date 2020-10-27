import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import "./App.css";
import { fetchUser } from "./app/api/auth";
import routes from "./app/navigation/routes";
import ActivityLogScreen from "./app/screens/ActivityLogScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import ManageRoomsScreen from "./app/screens/ManageRoomsScreen";
import ManageUsersScreen from "./app/screens/ManageUsersScreen";
import RulesConfigScreen from "./app/screens/RulesConfigScreen";
import StatisticsScreen from "./app/screens/StatisticsScreen";
import TimetableScreen from "./app/screens/TimetableScreen";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<LoginScreen />
				</Route>

				<ProtectedRoute path={routes.HOME}>
					<HomeScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.TIMETABLE}>
					<TimetableScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.STATISTICS}>
					<StatisticsScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.ACTIVITY_LOG}>
					<ActivityLogScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.MANAGE_ROOMS}>
					<ManageRoomsScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.MANAGE_USERS}>
					<ManageUsersScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.RULES_CONFIGURATION}>
					<RulesConfigScreen />
				</ProtectedRoute>
			</Switch>
		</Router>
	);
}

function ProtectedRoute({ path, children }) {
	return (
		<>
			{fetchUser ? (
				<Route path={path} exact>
					{children}
				</Route>
			) : (
				<Redirect to="/" />
			)}
		</>
	);
}

export default App;
