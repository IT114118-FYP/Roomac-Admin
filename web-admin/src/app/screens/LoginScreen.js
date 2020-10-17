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

import { submitLogin } from "../api/auth";

function LoginScreen(props) {
	// history hook is for navigation purposes
	const history = useHistory();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

	const [isValidated, setValidate] = useState(false);

	const [rememberAc, setRememberAc] = useState(false);

	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState("");
	const [loginFailed, setLoginFailed] = useState(false);

	const handleEmailOnChange = (textInput) => {
		setEmail(textInput.target.value);
		if (emailError == true) {
			handleEmailValidation();
		}
	};

	const handlePasswordOnChange = (textInput) => {
		setPassword(textInput.target.value);
		if (passwordError == true) {
			handlePasswordValidation();
		}
	};

	const handleEmailValidation = () => {
		if (email == "") {
			setEmailError(true);
			setEmailErrorMessage("Required");
		} else if (email.length <= 4) {
			setEmailError(true);
			setEmailErrorMessage("Input is too short");
		} else setEmailError(false);
	};

	const handlePasswordValidation = () => {
		if (password == "") {
			setPasswordError(true);
			setPasswordErrorMessage("Required");
		} else if (password.length <= 4) {
			setPasswordError(true);
			setPasswordErrorMessage("Input is too short");
		} else setPasswordError(false);
	};

	const handleChangeRemember = () => {
		setRememberAc(!rememberAc);
	};

	const validate = () => {
		handleEmailValidation();
		handlePasswordValidation();

		if (emailError) {
			setValidate(false);
		} else if (passwordError) {
			setValidate(false);
		} else setValidate(true);
	};

	const handleLogin = async () => {
		validate();
		if (!isValidated) return;

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
			<InputLabel>
				<TextField
					id="Email"
					label="Email"
					variant="outlined"
					error={emailError}
					helperText={emailError ? emailErrorMessage : null}
					style={{
						width: 400,
					}}
					onChange={handleEmailOnChange}
					onBlur={handleEmailValidation}
				/>
			</InputLabel>
			<InputLabel>
				<TextField
					id="Passsword"
					label="Password"
					type="password"
					variant="outlined"
					autoComplete="current-password"
					error={passwordError}
					helperText={passwordError ? passwordErrorMessage : null}
					style={{
						width: 400,
					}}
					onChange={handlePasswordOnChange}
					onBlur={handlePasswordValidation}
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
					width: 400,
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
