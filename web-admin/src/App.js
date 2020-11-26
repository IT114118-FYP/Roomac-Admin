import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from "./app/navigation/routes";
import ActivityLogScreen from "./app/screens/ActivityLogScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import ManageUsersScreen from "./app/screens/ManageUsersScreen";
import RulesConfigScreen from "./app/screens/RulesConfigScreen";
import StatisticsScreen from "./app/screens/StatisticsScreen";
import TimetableScreen from "./app/screens/TimetableScreen";

import ProtectedRoute from "./app/navigation/ProtectedRoute";
import ManageProgramsScreen from "./app/screens/ManageProgramsScreen";
import ManageBranchesScreen from "./app/screens/ManageBranchesScreen";
import ManageVenuesScreen from "./app/screens/ManageVenuesScreen";
import EditVenueScreen from "./app/screens/EditVenueScreen";
import FullscreenProgress from "./app/components/FullscreenProgress";
import { axiosInstance } from "./app/api/config";
import DetailedVenueScreen from "./app/screens/DetailedVenueScreen";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<LoginScreen />
				</Route>
				<ProtectedRoute path={routes.HOME} component={HomeScreen} />

				<ProtectedRoute path={routes.TIMETABLE}>
					<TimetableScreen />
				</ProtectedRoute>

				<ProtectedRoute
					path={routes.STATISTICS}
					component={StatisticsScreen}
				/>

				<ProtectedRoute
					path={routes.ACTIVITY_LOG}
					component={ActivityLogScreen}
				/>

				<ProtectedRoute
					path={routes.MANAGE_BRANCHES}
					component={ManageBranchesScreen}
				/>

				<ProtectedRoute
					path={routes.MANAGE_VENUES}
					exact
					component={ManageVenuesScreen}
				/>

				<ProtectedRoute
					path="/venues/:id"
					component={DetailedVenueScreen}
				/>

				<ProtectedRoute
					path={routes.MANAGE_USERS}
					component={ManageUsersScreen}
				/>

				<ProtectedRoute
					path={routes.MANAGE_PROGRAMMES}
					component={ManageProgramsScreen}
				/>

				<ProtectedRoute
					path={routes.RULES_CONFIGURATION}
					component={RulesConfigScreen}
				/>
			</Switch>
		</Router>
	);
}

export default App;
