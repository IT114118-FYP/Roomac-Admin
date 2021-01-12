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
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
	ListItemIcon,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import routes from "../../navigation/routes";
import { Skeleton } from "@material-ui/lab";
import { Link } from "react-router-dom";
import EditField from "../../components/forms/EditField";
import EditForm from "../../components/forms/EditForm";

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
	const [user_firstName, setUser_firstName] = useState("");
	const [user_lastName, setUser_lastName] = useState("");
	const [error, setError] = useState(false);
	const [permissions, setPermissions] = useState([]);

	useEffect(() => {
		fetchUser();
		fetchPermissions();
	}, []);

	const fetchUser = () => {
		setLoading(true);
		axiosInstance
			.get(`api/users/${match.params.id}`)
			.then(({ data }) => {
				console.log(data);
				setUser(data);
				setUser_firstName(data.first_name);
				setUser_lastName(data.last_name);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setError(true);
			});
	};

	const fetchPermissions = () => {
		axiosInstance
			.get(`api/users/${match.params.id}/permissions`)
			.then(({ data }) => {
				console.log(data);
				setPermissions(data);
			});
	};

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
				fetchUser();
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
					<EditField
						loading={isLoading}
						name="Programme"
						value={user.program_id}
						onSave={(newValue) =>
							updateUser("program_id", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="BRANCH"
						value={user.branch_id}
						onSave={(newValue) => updateUser("branch_id", newValue)}
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
					<Typography variant="h6">User Not Found...</Typography>
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
