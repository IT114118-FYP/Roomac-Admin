import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	InputLabel,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function LoginScreen(props) {
	const [rememberAc, setRememberAc] = useState(false);

	const handleChangeRemember = () => {
		setRememberAc(!rememberAc);
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
			>
				Log In
			</Button>
		</div>
	);
}

export default LoginScreen;
