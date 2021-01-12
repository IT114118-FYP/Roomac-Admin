import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from "./app/navigation/routes";
import ProtectedRoute from "./app/navigation/ProtectedRoute";
import { LinearProgress } from "@material-ui/core";

const ActivityLogPage = lazy(() => import("./app/pages/ActivityLogPage"));
const HomePage = lazy(() => import("./app/pages/HomePage"));
const LoginPage = lazy(() => import("./app/pages/LoginPage"));
const ManageUsersPage = lazy(() => import("./app/pages/users/ManageUsersPage"));
const DetailedUserPage = lazy(() =>
	import("./app/pages/users/DetailedUserPage")
);
const RulesConfigPage = lazy(() =>
	import("./app/pages/rules config/ManageRulesPage")
);
const StatisticsPage = lazy(() => import("./app/pages/StatisticsPage"));
const TimetablePage = lazy(() => import("./app/pages/TimetablePage"));
const ManageProgramsPage = lazy(() =>
	import("./app/pages/programs/ManageProgramsPage")
);
const ManageBranchesPage = lazy(() =>
	import("./app/pages/branches/ManageBranchesPage")
);
const ManageVenuesPage = lazy(() =>
	import("./app/pages/venues/ManageVenuesPage")
);
const DetailedVenuePage = lazy(() =>
	import("./app/pages/venues/DetailedVenuePage")
);
const NewVenuePage = lazy(() => import("./app/pages/venues/NewVenuePage"));
const NotFoundPage = lazy(() => import("./app/pages/NotFoundPage"));

function App() {
	return (
		<Router>
			<Suspense fallback={<LinearProgress />}>
				<Switch>
					<Route path="/" exact>
						<LoginPage />
					</Route>

					<ProtectedRoute path={routes.HOME} component={HomePage} />
					<ProtectedRoute
						path={routes.TIMETABLE}
						component={TimetablePage}
					/>
					<ProtectedRoute
						path={routes.STATISTICS}
						component={StatisticsPage}
					/>
					<ProtectedRoute
						path={routes.ACTIVITY_LOG}
						component={ActivityLogPage}
					/>
					<ProtectedRoute
						path={routes.branches.MANAGE}
						component={ManageBranchesPage}
					/>
					<ProtectedRoute
						path={routes.venues.MANAGE}
						exact
						component={ManageVenuesPage}
					/>
					<ProtectedRoute
						path={routes.venues.NEW}
						exact
						component={NewVenuePage}
					/>
					<ProtectedRoute
						path={routes.venues.DETAILED}
						component={DetailedVenuePage}
					/>
					<ProtectedRoute
						path={routes.users.DETAILED}
						component={DetailedUserPage}
					/>
					<ProtectedRoute
						path={routes.users.MANAGE}
						component={ManageUsersPage}
					/>
					<ProtectedRoute
						path={routes.programs.MANAGE}
						component={ManageProgramsPage}
					/>
					<ProtectedRoute
						path={routes.rules.MANAGE}
						component={RulesConfigPage}
					/>
					<Route path="*" component={NotFoundPage} />
				</Switch>
			</Suspense>
		</Router>
	);
}

export default App;
