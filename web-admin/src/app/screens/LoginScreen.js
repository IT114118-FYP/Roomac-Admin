import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	FormControlLabel,
	Checkbox,
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
import { storeToken } from "../auth/storage";

const validationSchema = Yup.object().shape({
	Email: Yup.string().required().min(4).label("Email"),
	Password: Yup.string().required().min(4).label("Password"),
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

	const handleSubmit = async ({ Email, Password }) => {
		setLoading(true);
		const authToken = await submitLogin(Email, Password);
		if (!authToken) {
			setLoginFailed(true);
			setLoading(false);
			return;
		}
		storeToken(authToken);
		setToken(authToken);
		setLoading(false);
		history.push("/home");
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
				initialValues={{ Email: "", Password: "" }}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<>
					<LoginField
						name="Email"
						placeholder="Email"
						autoCapitalize="none"
						// autoCorrect={false}
						autoFocus={true}
						style={{
							width: 400,
						}}
					/>
					<LoginField
						name="Password"
						placeholder="Password"
						type="password"
						autoCapitalize="none"
						// autoCorrect={false}
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
