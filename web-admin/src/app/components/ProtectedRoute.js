import React from "react";
import { Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../api/config";
import FullscreenProgress from "./FullscreenProgress";

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

		axiosInstance
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
			return <FullscreenProgress open={true} />;
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
