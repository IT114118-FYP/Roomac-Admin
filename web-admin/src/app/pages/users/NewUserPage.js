import {
	Divider,
	Typography,
	Box,
	Button,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Radio,
	Grid,
	CircularProgress,
} from "@material-ui/core";
import { Formik } from "formik";

import * as Yup from "yup";
import * as axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import NewPickerField, {
	createNewPickerValue,
} from "../../components/forms/new/NewPickerField";
import SnackbarAlert from "../../components/SnackbarAlert";

const validationSchema = Yup.object().shape({
	branch_id: Yup.string().required().label("Branch"),
	email: Yup.string().required().email().label("Email"),
	name: Yup.string().required().min(5).label("CNA"),
	program_id: Yup.string().required().label("Programme"),
	password: Yup.string().required().min(8).label("Password"),
});

function NewUserPage(props) {
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const [branches, setBranches] = useState([]);
	const [programs, setPrograms] = useState([]);

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [branches, programs] = await axios.all([
				fetchBranches(),
				fetchPrograms(),
			]);
			const branchesPickerItem = branches.data.map((item) => {
				return createNewPickerValue(item.id, item.title_en);
			});
			branchesPickerItem.unshift(createNewPickerValue("none", "none"));
			setBranches(branchesPickerItem);

			const programsPickerItem = programs.data.map((item) => {
				return createNewPickerValue(item.id, item.title_en);
			});
			programsPickerItem.unshift(createNewPickerValue("none", "none"));
			setPrograms(programsPickerItem);

			setLoading(false);
		} catch (error) {
			console.log(error.message);
			setLoading(false);
		}
	};

	const fetchBranches = () => axiosInstance.get(`api/branches`);
	const fetchPrograms = () => axiosInstance.get(`api/programs`);

	const createUser = ({
		branch_id,
		chinese_name,
		email,
		first_name,
		last_name,
		name,
		program_id,
		password,
	}) => {
		setLoading(true);
		console.log(
			branch_id,
			chinese_name,
			email,
			first_name,
			last_name,
			name,
			program_id,
			password
		);
		axiosInstance
			.post(`api/users`, {
				branch_id: branch_id,
				chinese_name: chinese_name,
				email: email,
				first_name: first_name,
				last_name: last_name,
				name: name,
				program_id: program_id === "none" ? null : program_id,
				password: password,
			})
			.then(() => {
				setSuccess(true);
				setLoading(false);
			})
			.catch((error) => {
				setError(true);
				setLoading(false);
			});
	};

	return (
		<NavDrawer>
			<Formik
				initialValues={{
					branch_id: "none",
					chinese_name: "",
					email: "",
					first_name: "",
					last_name: "",
					name: "",
					program_id: "none",
					password: "",
				}}
				onSubmit={createUser}
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
							New User
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
							User Basic Info
						</Typography>
						<NewField
							title="First Name"
							name="first_name"
							autoFocus={true}
							disabled={isLoading}
						/>
						<NewField
							title="Last Name"
							name="last_name"
							disabled={isLoading}
						/>
						<NewField
							title="Chinese Name"
							name="chinese_name"
							disabled={isLoading}
						/>
						<NewField
							title="CNA"
							name="name"
							disabled={isLoading}
						/>
						<NewField
							title="Password"
							name="password"
							disabled={isLoading}
							type="password"
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
							Association Info
						</Typography>
						<NewPickerField
							title="Branch"
							name="branch_id"
							disabled={isLoading}
							pickerItem={branches}
						/>
						<NewPickerField
							title="Programme"
							name="program_id"
							disabled={isLoading}
							pickerItem={programs}
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
							Contact Info
						</Typography>
						<NewField
							title="Email"
							name="email"
							disabled={isLoading}
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
								title="Create Category"
								color="primary"
								variant="contained"
								disabled={isLoading}
							/>
						</Box>
						{isLoading && <CircularProgress size={30} />}
					</Box>
				</>
			</Formik>
			<SnackbarAlert
				open={success}
				onClose={() => setSuccess(false)}
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

export default NewUserPage;
