import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routes from "./app/navigation/routes";
import ProtectedRoute from "./app/navigation/ProtectedRoute";
import { LinearProgress } from "@material-ui/core";

const ActivityLogPage = lazy(() => import("./app/pages/ActivityLogPage"));
const HomePage = lazy(() => import("./app/pages/HomePage"));
const LoginPage = lazy(() => import("./app/pages/LoginPage"));
const StatisticsPage = lazy(() => import("./app/pages/StatisticsPage"));
const TimetablePage = lazy(() => import("./app/pages/TimetablePage"));
const ManageUsersPage = lazy(() => import("./app/pages/users/ManageUsersPage"));
const NewUserPage = lazy(() => import("./app/pages/users/NewUserPage"));
const DetailedUserPage = lazy(() =>
  import("./app/pages/users/DetailedUserPage")
);
const NewProgramPage = lazy(() =>
  import("./app/pages/programs/NewProgramPage")
);
const ManageProgramsPage = lazy(() =>
  import("./app/pages/programs/ManageProgramsPage")
);
const DetailedProgramPage = lazy(() =>
  import("./app/pages/programs/DetailedProgramPage")
);
const ManageBranchesPage = lazy(() =>
  import("./app/pages/branches/ManageBranchesPage")
);
const DetailedBranchPage = lazy(() =>
  import("./app/pages/branches/DetailedBranchPage")
);
const NewBranchPage = lazy(() => import("./app/pages/branches/NewBranchPage"));
const ManageCategoriesPage = lazy(() =>
  import("./app/pages/category/ManageCategoriesPage")
);
const NewCategoryPage = lazy(() =>
  import("./app/pages/category/NewCategoryPage")
);
const DetailedCategoryPage = lazy(() =>
  import("./app/pages/category/DetailedCategoryPage")
);
const NewResourcesPage = lazy(() =>
  import("./app/pages/category/NewResourcesPage")
);
const NewTOSPage = lazy(() => import("./app/pages/tos/NewTOSPage"));
const DetailedTOSPage = lazy(() => import("./app/pages/tos/DetailedTOSPage"));
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
          <ProtectedRoute path={routes.TIMETABLE} component={TimetablePage} />
          <ProtectedRoute path={routes.STATISTICS} component={StatisticsPage} />
          <ProtectedRoute
            path={routes.ACTIVITY_LOG}
            component={ActivityLogPage}
          />
          <ProtectedRoute
            path={routes.branches.NEW}
            component={NewBranchPage}
          />
          <ProtectedRoute
            path={routes.branches.DETAILED}
            component={DetailedBranchPage}
          />
          <ProtectedRoute
            path={routes.branches.MANAGE}
            component={ManageBranchesPage}
          />
          <ProtectedRoute path={routes.users.NEW} component={NewUserPage} />
          <ProtectedRoute
            path={routes.users.DETAILED}
            component={DetailedUserPage}
          />
          <ProtectedRoute
            path={routes.users.MANAGE}
            component={ManageUsersPage}
          />
          <ProtectedRoute
            path={routes.programs.NEW}
            component={NewProgramPage}
          />
          <ProtectedRoute
            path={routes.programs.DETAILED}
            component={DetailedProgramPage}
          />
          <ProtectedRoute
            path={routes.programs.MANAGE}
            component={ManageProgramsPage}
          />
          <ProtectedRoute
            path={routes.categories.DETAILED}
            component={DetailedCategoryPage}
          />
          <ProtectedRoute
            path={routes.categories.NEW}
            component={NewCategoryPage}
          />
          <ProtectedRoute
            path={routes.categories.NEWR}
            component={NewResourcesPage}
          />
          <ProtectedRoute
            path={routes.categories.MANAGE}
            component={ManageCategoriesPage}
          />
          <ProtectedRoute path={routes.tos.NEW} component={NewTOSPage} />
          <ProtectedRoute
            path={routes.tos.DETAILED}
            component={DetailedTOSPage}
          />

          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
