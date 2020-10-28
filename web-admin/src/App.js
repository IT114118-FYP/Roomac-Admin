import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

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

import * as axios from "axios";
import { ProtectedRoute } from "./app/components/ProtectedRoute";
import LoginConfirmScreen from "./app/screens/LoginConfirmScreen";

const baseURL = "http://it114118-fyp.herokuapp.com";

const instance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
});

instance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: "Bearer " + localStorage.getItem("authToken"),
		};
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

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

// class ProtectedRoute extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			isLoading: false,
// 			valid: false,
// 			result: [],
// 			error: null,
// 		};
// 	}

// 	componentDidMount() {
// 		instance
// 			.get("/api/users/me")
// 			.then((response) => {
// 				this.setState({
// 					valid: true,
// 					result: response.data,
// 					isLoading: false,
// 				});
// 			})
// 			.catch((error) => {
// 				this.setState({ error: error, isLoading: false });
// 			});
// 	}

// 	render() {
// 		const { isLoading, result, error } = this.state;

// 		if (isLoading) {
// 			return <div>Loading Admin Panel...</div>;
// 		}

// 		if (error) {
// 			return <div>{error}</div>;
// 		}

// 		return (
// 			<>
// 				{this.state.valid ? (
// 					<Route path={this.props.path} exact>
// 						{this.props.children}
// 					</Route>
// 				) : (
// 					<Redirect to="/" />
// 				)}
// 			</>
// 		);
// 	}
// }

export default App;
