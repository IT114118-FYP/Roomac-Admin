import React from "react";
import { Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../api/config";
import FullscreenProgress from "../components/FullscreenProgress";

class ProtectedRoute extends React.Component {
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
		this.fetchUser();
	}

	fetchUser = () => {
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
	};

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		if (this.state.isLoading) {
			return <FullscreenProgress open={true} />;
		}

		if (this.state.error) {
			return <Redirect to="/" />;
		}

		return (
			<>
				{this.state.valid ? (
					<Route
						path={this.props.path}
						exact
						component={() => this.props.children}
						{...this.props}
					/>
				) : (
					<Redirect to="/" />
				)}
			</>
		);
	}
}

// function ProtectedRoute({ authenticated, path, component }) {
// 	if (!authenticated) {
// 		return <Redirect to="/" />;
// 	}

// 	return <Route path={path} exact component={component} />;
// }

export default ProtectedRoute;
