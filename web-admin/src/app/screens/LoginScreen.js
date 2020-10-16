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
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { submitLogin } from "../api/auth";

function LoginScreen(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberAc, setRememberAc] = useState(false);
	const [loading, setLoading] = React.useState(false);
	const [token, setToken] = React.useState("");

	const handleChangeRemember = () => {
		setRememberAc(!rememberAc);
	};
	const handleLogin = async () => {
		const authToken = await submitLogin(email, password);
		if (!authToken) return;
		setToken(authToken);
	};
	const handleClose = () => {
		setLoading(false);
	};
	const handleToggle = () => {
		setLoading(!loading);
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
			<Typography variant="h4" gutterBottom>
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
				variant="contained"
				color="primary"
				style={{
					width: "75%",
				}}
				onClick={handleLogin}
			>
				Log In
			</Button>
			<Backdrop
				open={loading}
				onClick={handleClose}
				style={{
					zIndex: 1,
				}}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			{token}
		</div>
	);
}

export default LoginScreen;
