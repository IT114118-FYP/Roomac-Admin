import React, { useState } from "react";
import {
	Divider,
	Typography,
	Box,
	Button,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Radio,
	CircularProgress,
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import SnackbarAlert from "../../components/SnackbarAlert";

const validationSchema = Yup.object().shape({
	title_en: Yup.string().required().min(1).label("English Title"),
	title_hk: Yup.string()
		.required()
		.min(1)
		.label("Chinese Title (Traditional)"),
	title_cn: Yup.string()
		.required()
		.min(1)
		.label("Chinese Title (Simplified)"),
});

function NewCategoryPage(props) {
	const [isLoading, setLoading] = useState(false);
	const [imgMethod, setImgMethod] = useState("None");
	const [success, setSuccess] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);

	const handleImgMethodChange = (event) => {
		setImgMethod(event.target.value);
	};

	const createCategory = ({ title_en, title_hk, title_cn }) => {
		setLoading(true);
		axiosInstance
			.post(`api/categories`, {
				title_en: title_en,
				title_hk: title_hk,
				title_cn: title_cn,
				image_url: null,
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
				initialValues={{ title_en: "", title_hk: "", title_cn: "" }}
				onSubmit={createCategory}
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
							New Category
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
							Category Details
						</Typography>
						<NewField
							title="English Title"
							name="title_en"
							autoFocus={true}
							disabled={success || isLoading}
						/>
						<NewField
							title="Chinese Title (Traditional)"
							name="title_hk"
							disabled={success || isLoading}
						/>
						<NewField
							title="Chinese Title (Simplified)"
							name="title_cn"
							disabled={success || isLoading}
						/>
					</Box>
					<Divider />
					<Box marginTop={3} marginBottom={3}>
						<Typography
							variant="h6"
							style={{
								fontWeight: "bold",
							}}
						>
							Category Attachments (Under Construction)
						</Typography>
						<Box marginTop={2}>
							<FormControl component="fieldset">
								<RadioGroup
									name="Image Method"
									value={imgMethod}
									onChange={handleImgMethodChange}
								>
									<FormControlLabel
										value="None"
										control={<Radio color="primary" />}
										label="None"
									/>
									<FormControlLabel
										value="Image Url"
										control={<Radio color="primary" />}
										label="Image Url"
									/>
									<FormControlLabel
										value="Upload Image File"
										control={<Radio color="primary" />}
										label="Upload Image File"
									/>
								</RadioGroup>
							</FormControl>
						</Box>
						{imgMethod === "Image Url" && (
							<NewField name="Image Url" />
						)}
						{imgMethod === "Upload Image File" && (
							<div>
								<input
									accept="image/*"
									id="contained-button-file"
									type="file"
									style={{
										display: "none",
									}}
								/>
								<label htmlFor="contained-button-file">
									<Button
										variant="contained"
										color="primary"
										component="span"
									>
										Upload Image File
									</Button>
								</label>
							</div>
						)}
					</Box>
					<Divider />
					<Box
						marginTop={3}
						display="flex"
						flexDirection="row-reverse"
						alignItems="center"
					>
						<Box marginLeft={2}>
							<NewButton
								title="Create Category"
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
			/>
			<SnackbarAlert
				open={error}
				onClose={() => setError(false)}
				alertText="There is an error."
			/>
		</NavDrawer>
	);
}

export default NewCategoryPage;
