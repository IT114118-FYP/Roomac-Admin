import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	InputLabel,
	Backdrop,
	CircularProgress,
	Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import { submitLogin } from "../api/auth";
import LoginField from "../components/forms/LoginField";
import LoginButton from "../components/forms/LoginButton";

const validationSchema = Yup.object().shape({
	email: Yup.string().required().min(4).label("Email"),
	password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
	// history hook is for navigation purposes
	const history = useHistory();

	const [rememberAc, setRememberAc] = useState(false);

	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState("");
	const [loginFailed, setLoginFailed] = useState(false);

	const handleChangeRemember = () => {
		setRememberAc(!rememberAc);
	};

	const handleSubmit = async ({ email, password }) => {
		setLoading(true);
		const authToken = await submitLogin(email, password);
		if (!authToken) {
			setLoginFailed(true);
			setLoading(false);
			return;
		}
		setToken(authToken);
		setLoading(false);
		history.push("/temp");
	};

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
				initialValues={{ email: "", password: "" }}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<>
					<LoginField
						name="email"
						placeholder="Email"
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus={true}
						style={{
							width: 400,
						}}
					/>
					<LoginField
						name="password"
						placeholder="Password"
						type="password"
						autoCapitalize="none"
						autoCorrect={false}
						style={{
							width: 400,
						}}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rememberAc}
								onChange={handleChangeRemember}
								name="checkedB"
								color="primary"
							/>
						}
						label="Remember my account"
					/>
					<LoginButton
						title="Log In"
						variant="contained"
						color="primary"
						style={{
							width: 400,
						}}
					/>
				</>
			</Formik>
			{token}
			<Backdrop
				open={loading}
				style={{
					zIndex: 1,
				}}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Snackbar
				open={loginFailed}
				autoHideDuration={5000}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				onClose={() => setLoginFailed(false)}
			>
				<MuiAlert elevation={6} variant="filled" severity="error">
					Login Failed! Check if email or password is incorrect
				</MuiAlert>
			</Snackbar>
		</div>
	);
}

export default LoginScreen;
