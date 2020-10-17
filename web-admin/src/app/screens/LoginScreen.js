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

import { submitLogin } from "../api/auth";

function LoginScreen(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberAc, setRememberAc] = useState(false);

	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState("");
	const [loginFailed, setLoginFailed] = useState(false);

	const handleChangeRemember = () => {
		setRememberAc(!rememberAc);
	};

	const handleLogin = async () => {
		setLoading(true);
		const authToken = await submitLogin(email, password);
		if (!authToken) {
			setLoginFailed(true);
			setLoading(false);
			return;
		}
		setToken(authToken);
		setLoading(false);
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
				variant="h4"
				style={{
					fontWeight: "100",
				}}
				gutterBottom
			>
				Admin Panel
			</Typography>
			<InputLabel
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TextField
					id="Email"
					label="Email"
					variant="outlined"
					style={{
						width: "75%",
					}}
					onChange={(text) => setEmail(text.target.value)}
				/>
			</InputLabel>
			<InputLabel
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TextField
					id="Passsword"
					label="Password"
					type="password"
					variant="outlined"
					autoComplete="current-password"
					style={{
						width: "75%",
					}}
					onChange={(text) => setPassword(text.target.value)}
				/>
			</InputLabel>
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
			<Button
				onClick={handleLogin}
				variant="contained"
				color="primary"
				style={{
					width: "75%",
				}}
			>
				Log In
			</Button>
			<Backdrop
				open={loading}
				style={{
					zIndex: 1,
				}}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			{token}

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
					Login Failed!
				</MuiAlert>
			</Snackbar>
		</div>
	);
}

export default LoginScreen;
