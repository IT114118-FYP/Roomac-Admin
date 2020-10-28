import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { Redirect, withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import { submitLogin } from "../api/auth";
import LoginField from "../components/forms/LoginField";
import LoginButton from "../components/forms/LoginButton";
import { storeToken } from "../auth/storage";

import * as axios from "axios";
import routes from "../navigation/routes";

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

const validationSchema = Yup.object().shape({
	Email: Yup.string().required().min(4).label("Email"),
	Password: Yup.string().required().min(4).label("Password"),
});

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			loginFailed: false,
			userName: "",
			canContinue: false,
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		if (localStorage.getItem("authToken") == null) {
			this.setState({
				loading: false,
				canContinue: false,
			});
			return;
		}

		instance
			.get("/api/users/me")
			.then((response) => {
				this.setState({
					userName: response.data.name,
					loading: false,
					canContinue: true,
				});
			})
			.catch(() => {
				this.setState({ canContinue: false, loading: false });
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleSubmit = async ({ Email, Password }) => {
		this.setState({ loading: true });
		const authToken = await submitLogin(Email, Password);
		if (!authToken) {
			this.setState({
				loginFailed: true,
				loading: false,
			});
			return;
		}
		storeToken(authToken);
		localStorage.setItem("authToken", authToken);
		this.setState({ loading: false });
		this.props.history.push("/home");
	};

	render() {
		if (this.state.canContinue) {
			return <Redirect to={routes.HOME} />;
		} else {
			return (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<Typography variant="h1">roomac</Typography>
					<Typography
						gutterBottom
						variant="h4"
						style={{
							fontWeight: "100",
						}}
					>
						Admin Panel
					</Typography>
					<Formik
						initialValues={{ Email: "", Password: "" }}
						onSubmit={this.handleSubmit}
						validationSchema={validationSchema}
					>
						<>
							<LoginField
								name="Email"
								placeholder="Email"
								autoCapitalize="none"
								autoFocus={true}
								disabled={this.state.loading ? true : false}
								style={{
									width: 400,
								}}
							/>
							<LoginField
								name="Password"
								placeholder="Password"
								type="password"
								autoCapitalize="none"
								disabled={this.state.loading ? true : false}
								style={{
									width: 400,
								}}
							/>
							<LoginButton
								title="Log In"
								disabled={this.state.loading ? true : false}
								variant="contained"
								color="primary"
								style={{
									width: 400,
								}}
							/>
						</>
					</Formik>
					<Backdrop
						open={this.state.loading}
						style={{
							zIndex: 1,
						}}
					>
						<CircularProgress color="inherit" />
					</Backdrop>

					<Snackbar
						open={this.state.loginFailed}
						autoHideDuration={5000}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						onClose={() => this.setState({ loginFailed: false })}
					>
						<MuiAlert
							elevation={6}
							variant="filled"
							severity="error"
						>
							Login Failed! Check if email or password is
							incorrect
						</MuiAlert>
					</Snackbar>
				</div>
			);
		}
	}
}

export default withRouter(LoginScreen);
