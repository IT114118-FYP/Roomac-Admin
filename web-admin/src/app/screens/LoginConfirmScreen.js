import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	Backdrop,
	Button,
	CircularProgress,
	Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";

import { submitLogin } from "../api/auth";
import { storeToken } from "../auth/storage";

function LoginConfirmScreen(props) {
	const history = useHistory();

	const [loading, setLoading] = useState(false);

	const [loginFailed, setLoginFailed] = useState(false);

	// const handleSubmit = async ({ Email, Password }) => {
	// 	setLoading(true);
	// 	const authToken = await submitLogin(Email, Password);
	// 	if (!authToken) {
	// 		setLoginFailed(true);
	// 		setLoading(false);
	// 		return;
	// 	}
	// 	storeToken(authToken);
	// 	localStorage.setItem("authToken", authToken);
	// 	setLoading(false);
	// 	history.push("/home");
	// };

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
			<Button>Log in as 190271174</Button>
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

export default LoginConfirmScreen;
