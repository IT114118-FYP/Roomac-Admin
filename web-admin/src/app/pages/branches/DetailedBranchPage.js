import {
	Box,
	Breadcrumbs,
	Button,
	Divider,
	Tab,
	Tabs,
	Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import * as axios from "axios";

import { axiosInstance } from "../../api/config";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/rulesConfig";
import ConfirmDialog from "../../components/ConfirmDialog";

function TabPanel({ children, value, index, ...other }) {
	return (
		<Box hidden={value !== index} {...other} marginTop={2}>
			{value === index && <div>{children}</div>}
		</Box>
	);
}

function DetailedBranchPage({ match }) {
	const history = useHistory();
	const [isLoading, setLoading] = useState(true);
	const [branch, setBranch] = useState({});
	const [settings, setSettings] = useState({});
	const [error, setError] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [deleteOpen, setDeleteOpen] = useState(false);

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [branch, settings] = await axios.all([
				fetchBranch(),
				fetchSettings(),
			]);
			setBranch(branch.data);
			setSettings(settings.data.versions);
			setLoading(false);
		} catch (error) {
			console.log(error.message);
			setError(true);
			setLoading(false);
		}
	};

	const fetchBranch = () =>
		axiosInstance.get(`api/branches/${match.params.id}`);

	const fetchSettings = () =>
		axiosInstance.get(`api/branches/${match.params.id}/settings`);

	const updateBranch = (name, value) => {
		setLoading(true);
		axiosInstance
			.put(`api/branches/${match.params.id}`, {
				id: name === "id" ? value : branch.id,
				title_en: name === "title_en" ? value : branch.title_en,
				title_hk: name === "title_hk" ? value : branch.title_hk,
				title_cn: name === "title_cn" ? value : branch.title_cn,
			})
			.then(() => {
				fetchBranch();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSettingClick = () => {};

	const deleteBranch = () => {
		axiosInstance.delete(`api/branches/${match.params.id}`).then(() => {
			history.push(routes.branches.MANAGE);
		});
	};

	function GeneralTabPanel() {
		return (
			<>
				<EditForm title="Branch info">
					<EditField
						loading={isLoading}
						name="Branch ID"
						value={branch.id}
						onSave={(newValue) => updateBranch("id", newValue)}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="English"
						value={branch.title_en}
						onSave={(newValue) =>
							updateBranch("title_en", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="Chinese (traditional)"
						value={branch.title_hk}
						onSave={(newValue) =>
							updateBranch("title_hk", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="Chinese (simplified)"
						value={branch.title_cn}
						onSave={(newValue) =>
							updateBranch("title_cn", newValue)
						}
					/>
				</EditForm>

				<Box marginBottom={2} marginTop={3} display="flex">
					<Typography
						variant="h6"
						component="div"
						style={{
							flexGrow: 1,
						}}
					>
						Branch Settings / Rules Configuration
					</Typography>
					<Button
						color="primary"
						size="small"
						// onClick={handleAddNew}
					>
						Add new rules configurations
					</Button>
				</Box>
				<DataTable
					loading={isLoading}
					data={settings}
					labels={labels}
					onClick={handleSettingClick}
				/>
			</>
		);
	}

	function SettingsTabPanel() {
		return (
			<Box flexDirection="row" display="flex" marginTop={2}>
				<Box flexGrow={1}>
					<Typography variant="body1" color="textPrimary">
						Delete Branch
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Upon deletion, the branch will not be recoverable.
					</Typography>
				</Box>
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => setDeleteOpen(true)}
				>
					Delete Branch
				</Button>
			</Box>
		);
	}

	return (
		<NavDrawer>
			<Breadcrumbs aria-label="breadcrumb">
				<Link to={routes.branches.MANAGE}>branches</Link>
				<Typography color="textPrimary">details</Typography>
			</Breadcrumbs>
			{error ? (
				<Box
					alignItems="center"
					justifyContent="center"
					display="flex"
					flexDirection="column"
				>
					<Typography variant="h6">Branch Not Found...</Typography>
					<Link to={routes.branches.MANAGE}>go back</Link>
				</Box>
			) : (
				<div>
					<Box marginBottom={2} marginTop={3}>
						<Typography
							variant="h5"
							component="div"
							style={{
								fontWeight: "bold",
							}}
						>
							{isLoading ? <Skeleton /> : `${branch.title_en}`}
						</Typography>
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
							label="Settings"
							style={{
								outline: "none",
							}}
						/>
					</Tabs>
					<TabPanel value={tabIndex} index={0}>
						<GeneralTabPanel />
					</TabPanel>
					<TabPanel value={tabIndex} index={1}>
						<SettingsTabPanel
							onDeleteUser={() => setDeleteOpen(true)}
						/>
					</TabPanel>
				</div>
			)}
			<ConfirmDialog
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				onConfirm={deleteBranch}
				title={`Delete Branch ${branch.id}?`}
			>
				<Typography>
					Upon deletion, the branch will not be recoverable.
				</Typography>
			</ConfirmDialog>
		</NavDrawer>
	);
}

export default DetailedBranchPage;
