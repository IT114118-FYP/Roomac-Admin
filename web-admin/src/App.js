import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import routes from "./app/navigation/routes";
import ActivityLogScreen from "./app/screens/ActivityLogScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import ManageRoomsScreen from "./app/screens/ManageRoomsScreen";
import ManageUsersScreen from "./app/screens/ManageUsersScreen";
import RulesConfigScreen from "./app/screens/RulesConfigScreen";
import StatisticsScreen from "./app/screens/StatisticsScreen";
import TimetableScreen from "./app/screens/TimetableScreen";

import { ProtectedRoute } from "./app/components/ProtectedRoute";
import ManageProgramsScreen from "./app/screens/ManageProgramsScreen";

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

				<ProtectedRoute path={routes.MANAGE_PROGRAMMES}>
					<ManageProgramsScreen />
				</ProtectedRoute>

				<ProtectedRoute path={routes.RULES_CONFIGURATION}>
					<RulesConfigScreen />
				</ProtectedRoute>
			</Switch>
		</Router>
	);
}

export default App;
