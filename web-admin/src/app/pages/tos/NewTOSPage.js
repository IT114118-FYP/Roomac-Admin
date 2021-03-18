import {
	Divider,
	Typography,
	Box,
	CircularProgress,
	Button,
} from "@material-ui/core";
import { Formik } from "formik";

import * as Yup from "yup";
import React, { useState } from "react";
import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import SnackbarAlert from "../../components/SnackbarAlert";
import routes from "../../navigation/routes";
import { useHistory } from "react-router-dom";

const validationSchema = Yup.object().shape({
	id: Yup.string().required().min(1).label("Programme code"),
	title_en: Yup.string().required().min(4).label("English title"),
	title_hk: Yup.string()
		.required()
		.min(4)
		.label("Chinese title (traditional)"),
	title_cn: Yup.string()
		.required()
		.min(4)
		.label("Chinese title (simplified)"),
});

function NewProgramPage(props) {
	const history = useHistory();
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);

	const createProgram = ({ id, title_en, title_hk, title_cn }) => {
		setLoading(true);
		axiosInstance
			.post(`api/programs`, {
				id,
				title_en,
				title_hk,
				title_cn,
			})
			.then(() => {
				setSuccess(true);
				setSuccessAlert(true);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	};

	return (
		<NavDrawer>
			<Formik
				initialValues={{
					id: "",
					title_en: "",
					title_hk: "",
					title_cn: "",
				}}
				onSubmit={createProgram}
				validationSchema={validationSchema}
			>
				<>
					<Box marginBottom={2}>
						<Typography
							variant="h4"
							style={{
								fontWeight: "bold",
							}}
						>
							New Programme
						</Typography>
					</Box>
					<Divider />
					<Box marginTop={3} marginBottom={3}>
						<Typography
							variant="h6"
							style={{
								fontWeight: "bold",
							}}
						>
							Programme Details
						</Typography>
						<NewField
							title="Programme Code"
							name="id"
							autoFocus={true}
							disabled={success || isLoading}
						/>
						<NewField
							title="English"
							name="title_en"
							disabled={success || isLoading}
						/>
						<NewField
							title="Chinese (Traditional)"
							name="title_hk"
							disabled={success || isLoading}
						/>
						<NewField
							title="Chinese (Simplified)"
							name="title_cn"
							disabled={success || isLoading}
						/>
					</Box>
					<Box
						marginTop={3}
						display="flex"
						flexDirection="row-reverse"
						alignItems="center"
					>
						<Box marginLeft={2}>
							<NewButton
								title="Create Programme"
								color="primary"
								variant="contained"
								disabled={success || isLoading}
							/>
						</Box>
						{isLoading && <CircularProgress size={30} />}
					</Box>
				</>
			</Formik>
			<SnackbarAlert
				open={successAlert}
				onClose={() => setSuccessAlert(false)}
				severity="success"
				alertText="Successful"
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => history.push(routes.programs.MANAGE)}
					>
						Go Back
					</Button>
				}
			/>
			<SnackbarAlert
				open={error}
				onClose={() => setError(false)}
				alertText="There is an error."
			/>
		</NavDrawer>
	);
}

export default NewProgramPage;
