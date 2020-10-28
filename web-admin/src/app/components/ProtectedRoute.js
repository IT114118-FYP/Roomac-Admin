import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Backdrop, CircularProgress } from "@material-ui/core";

import * as axios from "axios";

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

export class ProtectedRoute extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			valid: false,
			result: [],
			error: null,
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		if (localStorage.getItem("authToken") == null) {
			this.setState({
				valid: false,
				isLoading: false,
			});
			return;
		}

		instance
			.get("/api/users/me")
			.then((response) => {
				this.setState({
					valid: true,
					result: response.data,
					isLoading: false,
				});
			})
			.catch((error) => {
				this.setState({ error: error, isLoading: false });
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const { isLoading, error } = this.state;

		if (isLoading) {
			return (
				<Backdrop
					open={true}
					style={{
						zIndex: 1,
					}}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			);
		}

		if (error) {
			return <Redirect to="/" />;
		}

		return (
			<>
				{this.state.valid ? (
					<Route path={this.props.path} exact>
						{this.props.children}
					</Route>
				) : (
					<Redirect to="/" />
				)}
			</>
		);
	}
}
