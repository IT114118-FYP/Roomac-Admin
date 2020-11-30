import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from "./app/navigation/routes";
import ProtectedRoute from "./app/navigation/ProtectedRoute";
import { LinearProgress } from "@material-ui/core";

const ActivityLogScreen = lazy(() => import("./app/screens/ActivityLogScreen"));
const HomeScreen = lazy(() => import("./app/screens/HomeScreen"));
const LoginScreen = lazy(() => import("./app/screens/LoginScreen"));
const ManageUsersScreen = lazy(() => import("./app/screens/ManageUsersScreen"));
const RulesConfigScreen = lazy(() => import("./app/screens/RulesConfigScreen"));
const StatisticsScreen = lazy(() => import("./app/screens/StatisticsScreen"));
const TimetableScreen = lazy(() => import("./app/screens/TimetableScreen"));

const ManageProgramsScreen = lazy(() =>
	import("./app/screens/ManageProgramsScreen")
);
const ManageBranchesScreen = lazy(() =>
	import("./app/screens/ManageBranchesScreen")
);
const ManageVenuesScreen = lazy(() =>
	import("./app/screens/ManageVenuesScreen")
);
const DetailedVenueScreen = lazy(() =>
	import("./app/screens/DetailedVenueScreen")
);
const NewVenueScreen = lazy(() =>
	import("./app/screens/venues/NewVenueScreen")
);

function App() {
	return (
		<Router>
			<Suspense fallback={<LinearProgress />}>
				<Switch>
					<Route path="/" exact>
						<LoginScreen />
					</Route>

					<ProtectedRoute path={routes.HOME} component={HomeScreen} />
					<ProtectedRoute
						path={routes.TIMETABLE}
						component={TimetableScreen}
					/>
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
						path={routes.venues.new}
						exact
						component={NewVenueScreen}
					/>
					<ProtectedRoute
						path={routes.venues.detailed}
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
			</Suspense>
		</Router>
	);
}

export default App;
