import React, { useEffect, useState } from "react";
import {
	Tabs,
	Tab,
	Typography,
	Avatar,
	makeStyles,
	Box,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Breadcrumbs,
	Divider,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import routes from "../../navigation/routes";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import EditPickerField, {
	createPickerValue,
} from "../../components/forms/edit/EditPickerField";

function TabPanel({ children, value, index, ...other }) {
	return (
		<Box hidden={value !== index} {...other} marginTop={2}>
			{value === index && <div>{children}</div>}
		</Box>
	);
}

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
	},
}));

function DetailedUserPage({ match }) {
	const classes = useStyles();

	const [tabIndex, setTabIndex] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [userBranch, setUserBranch] = useState({});
	const [branches, setBranches] = useState([]);
	const [userProgram, setUserProgram] = useState({});
	const [programs, setPrograms] = useState([]);
	const [error, setError] = useState(false);
	const [permissions, setPermissions] = useState([]);

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [
				userData,
				userPermissions,
				branches,
				programs,
			] = await axios.all([
				fetchUser(),
				fetchPermissions(),
				fetchBranches(),
				fetchPrograms(),
			]);
			setUser(userData.data);
			setPermissions(userPermissions.data);

			const branchesPickerItem = branches.data.map((item) => {
				return createPickerValue(item.id, item.title_en);
			});
			setBranches(branchesPickerItem);
			setUserBranch(
				branches.data.find(
					(branch) => branch.id === userData.data.branch_id
				)
			);

			const programsPickerItem = programs.data.map((item) => {
				return createPickerValue(item.id, item.title_en);
			});
			setPrograms(programsPickerItem);
			setUserProgram(
				programs.data.find(
					(program) => program.id === userData.data.program_id
				)
			);
			setLoading(false);
		} catch (error) {
			console.log(error.message);
			setError(true);
			setLoading(false);
		}
	};

	const fetchUser = () => axiosInstance.get(`api/users/${match.params.id}`);
	const fetchBranches = () => axiosInstance.get(`api/branches`);
	const fetchPrograms = () => axiosInstance.get(`api/programs`);
	const fetchPermissions = () =>
		axiosInstance.get(`api/users/${match.params.id}/permissions`);

	const updateUser = (name, value) => {
		setLoading(true);
		axiosInstance
			.put(`api/users/${match.params.id}`, {
				branch_id: name == "branch_id" ? value : user.branch_id,
				chinese_name:
					name == "chinese_name" ? value : user.chinese_name,
				email: name == "email" ? value : user.email,
				first_name: name == "first_name" ? value : user.first_name,
				last_name: name == "last_name" ? value : user.last_name,
				name: name == "name" ? value : user.name,
				program_id: name == "program_id" ? value : user.program_id,
			})
			.then(() => {
				fetchAllData();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	function GeneralTabPanel() {
		return (
			<>
				<EditForm title="Basic info">
					<EditField
						loading={isLoading}
						name="FIRST NAME"
						value={user.first_name}
						onSave={(newValue) =>
							updateUser("first_name", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="LAST NAME"
						value={user.last_name}
						onSave={(newValue) => updateUser("last_name", newValue)}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="CHINESE NAME"
						value={user.chinese_name}
						onSave={(newValue) =>
							updateUser("chinese_name", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="CNA"
						value={user.name}
						onSave={(newValue) => updateUser("name", newValue)}
					/>
					<Divider />
					<EditPickerField
						loading={isLoading}
						name="Programme"
						value={userProgram.id}
						onSave={(newValue) =>
							updateUser("program_id", newValue)
						}
						pickerItem={programs}
					/>
					<Divider />
					<EditPickerField
						loading={isLoading}
						name="BRANCH"
						value={userBranch.id}
						onSave={(newValue) => updateUser("branch_id", newValue)}
						picker
						pickerItem={branches}
					/>
				</EditForm>
				<EditForm title="Contact Info">
					<EditField
						loading={isLoading}
						name="EMAIL"
						value={user.email}
						onSave={(newValue) => updateUser("email", newValue)}
					/>
				</EditForm>
			</>
		);
	}

	function PermissionsTabPanel() {
		return (
			<>
				<Box marginBottom={2}>
					<Typography variant="body1" color="textSecondary">
						Permissions are assigned to users and admins for
						different purposes. Permissions enables users or admin
						to access or edit data information.
					</Typography>
				</Box>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Permissions</TableCell>
								<TableCell align="left">Granted</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{permissions.map((permission) => (
								<TableRow key={permission.name}>
									<TableCell component="th" scope="row">
										{permission.name}
									</TableCell>
									<TableCell
										align="left"
										style={{
											color: permission.granted
												? "#4c4"
												: "#c11",
										}}
									>
										{permission.granted ? (
											<DoneIcon />
										) : (
											<ClearIcon />
										)}
										{/* {String(permission.granted)} */}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</>
		);
	}

	return (
		<NavDrawer>
			<Breadcrumbs aria-label="breadcrumb">
				<Link to={routes.users.MANAGE}>users</Link>
				<Typography color="textPrimary">details</Typography>
			</Breadcrumbs>
			{error ? (
				<Box
					alignItems="center"
					justifyContent="center"
					display="flex"
					flexDirection="column"
				>
					<Typography variant="h6">
						Something went wrong...
					</Typography>
					<Link to={routes.users.MANAGE}>go back</Link>
				</Box>
			) : (
				<div>
					<Box
						display="flex"
						alignItems="center"
						marginBottom={2}
						marginTop={3}
					>
						<Avatar className={classes.avatar}>
							{isLoading ? (
								<Skeleton />
							) : user.first_name == null ? (
								"U"
							) : (
								user.first_name.charAt(0)
							)}
						</Avatar>
						<Box marginLeft={3} flexGrow={1}>
							<Typography variant="h5" component="div">
								{isLoading ? (
									<Skeleton />
								) : (
									`${user.first_name}, ${user.last_name}`
								)}
							</Typography>
						</Box>
					</Box>
					<Tabs
						value={tabIndex}
						onChange={(event, newValue) => {
							setTabIndex(newValue);
						}}
					>
						<Tab
							label="General"
							style={{
								outline: "none",
							}}
						/>
						<Tab
							label="Permissions"
							style={{
								outline: "none",
							}}
						/>
					</Tabs>
					<TabPanel value={tabIndex} index={0}>
						<GeneralTabPanel />
					</TabPanel>

					<TabPanel value={tabIndex} index={1}>
						<PermissionsTabPanel />
					</TabPanel>
				</div>
			)}
		</NavDrawer>
	);
}

export default DetailedUserPage;
