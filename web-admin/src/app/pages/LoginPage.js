import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@material-ui/core/Typography";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import { submitLogin } from "../api/auth";
import { axiosInstance } from "../api/config";
import { storeToken } from "../auth/storage";
import routes from "../navigation/routes";
import LoginField from "../components/forms/login/LoginField";
import LoginButton from "../components/forms/login/LoginButton";
import SnackbarAlert from "../components/SnackbarAlert";
import Logo from "../components/Logo";
import { CircularProgress, Fade } from "@material-ui/core";

const validationSchema = Yup.object().shape({
	Email: Yup.string().required().min(4).label("Email"),
	Password: Yup.string().required().min(4).label("Password"),
});

function LoginPage() {
	const history = useHistory();

	const [isLoading, setLoading] = useState(true);
	const [loginFailed, setLoginFailed] = useState(false);
	const [canContinue, setContinue] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("authToken") == null) {
			setLoading(false);
			setContinue(false);
			return;
		}

		axiosInstance
			.get("/api/users/me")
			.then((response) => {
				setLoading(false);
				setContinue(true);
			})
			.catch(() => {
				setLoading(false);
				setContinue(false);
			});
	}, []);

	const handleSubmit = async ({ Email, Password }) => {
		setLoading(true);
		const authToken = await submitLogin(Email, Password);
		if (!authToken) {
			setLoading(false);
			setLoginFailed(true);
			return;
		}
		storeToken(authToken);
		localStorage.setItem("authToken", authToken);
		setLoading(false);
		history.push("/home");
	};

	if (canContinue) {
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
				<Logo large title="roomac" />
				{/* <Typography variant="h1">roomac</Typography> */}
				<Typography
					gutterBottom
					variant="h4"
					style={{
						fontWeight: "100",
					}}
				>
					Admin Panel
				</Typography>
				<Fade in={isLoading}>
					<CircularProgress />
				</Fade>
				<Fade in={!isLoading}>
					<div>
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
									autoFocus={true}
									disabled={isLoading ? true : false}
									style={{
										width: 400,
									}}
								/>
								<LoginField
									name="Password"
									placeholder="Password"
									type="password"
									autoCapitalize="none"
									disabled={isLoading ? true : false}
									style={{
										width: 400,
									}}
								/>
								<LoginButton
									title="Log In"
									disabled={isLoading ? true : false}
									variant="contained"
									color="primary"
									style={{
										width: 400,
									}}
								/>
							</>
						</Formik>
					</div>
				</Fade>

				{/* <FullscreenProgress open={isLoading} /> */}

				<SnackbarAlert
					open={loginFailed}
					onClose={() => setLoginFailed(false)}
					alertText="Login Failed! Check if email or password is incorrect"
				/>
			</div>
		);
	}
}

export default withRouter(LoginPage);
