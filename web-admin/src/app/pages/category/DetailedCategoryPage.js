import { Box, Divider, Tab, Tabs, Typography, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import EditSliderField from "../../components/forms/edit/EditSliderField";
import * as axios from "axios";
import NavDrawer from "../../components/NavDrawer";
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
function DetailedCategoryPage({ match }) {
	const history = useHistory();
	const [isLoading, setLoading] = useState(true);
	const [resource, setResource] = useState({});
	const [branches, setBranches] = useState([]);
	const [resourceBranch, setResourceBranch] = useState({});
	const [error, setError] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const updateResource = (name, value) => {
		setLoading(true);
		axiosInstance
			.put(`api/resources/${match.params.id}`, {
				number: name === "number" ? value : resource.number,
				title_en: name === "title_en" ? value : resource.title_en,
				title_hk: name === "title_hk" ? value : resource.title_hk,
				title_cn: name === "title_cn" ? value : resource.title_cn,
				branch_id: name === "branch_id" ? value : resource.branch_id,
				opening_time:
					name === "opening_time" ? value : resource.opening_time,
				closing_time:
					name === "closing_time" ? value : resource.closing_time,
				min_user: name === "opacity" ? value[0] : resource.min_user,
				max_user: name === "opacity" ? value[1] : resource.max_user,
			})
			.then(() => {
				fetchResource();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [resourceData, branches] = await axios.all([
				fetchResource(),
				fetchBranches(),
			]);
			setResource(resourceData.data);
			setBranches(branches.data);

			const branchesPickerItem = branches.data.map((item) => {
				return createPickerValue(item.id, item.title_en);
			});
			branchesPickerItem.unshift(createPickerValue("none", "none"));
			setBranches(branchesPickerItem);
			setResourceBranch(
				resourceData.data.branch_id === null
					? createPickerValue("none", "none")
					: branches.data.find(
							(branch) =>
								branch.id === resourceData.data.branch_id
					  )
			);
			setLoading(false);
		} catch (error) {
			console.log(error.message);
			setError(true);
			setLoading(false);
		}
	};

	const fetchResource = () =>
		axiosInstance.get(`api/resources/${match.params.id}`);

	const fetchBranches = () => axiosInstance.get(`api/branches`);

	const delteResource = () => {
		axiosInstance.delete(`api/resources/${match.params.id}`);
	};

	function GeneralTabPanel() {
		return (
			<>
				<EditForm title="Resource Basic info">
					<EditField
						loading={isLoading}
						name="Number"
						value={resource.number}
						onSave={(newValue) =>
							updateResource("number", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="English"
						value={resource.title_en}
						onSave={(newValue) =>
							updateResource("title_en", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="Chinese (traditional)"
						value={resource.title_hk}
						onSave={(newValue) =>
							updateResource("title_hk", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						name="Chinese (simplified)"
						value={resource.title_cn}
						onSave={(newValue) =>
							updateResource("title_cn", newValue)
						}
					/>
					<Divider />
					<EditPickerField
						editable={false}
						loading={isLoading}
						name="Branch"
						value={resourceBranch.id}
						onSave={(newValue) =>
							updateResource("branch_id", newValue)
						}
						picker
						pickerItem={branches}
					/>
				</EditForm>
				<EditForm title="Resource Details">
					<EditField
						loading={isLoading}
						type="time"
						name="Opening Time"
						value={resource.opening_time}
						onSave={(newValue) =>
							updateResource("opening_time", newValue)
						}
					/>
					<Divider />
					<EditField
						loading={isLoading}
						type="time"
						name="Closing Time"
						value={resource.closing_time}
						onSave={(newValue) =>
							updateResource("closing_time", newValue)
						}
					/>
					<Divider />
					<EditSliderField
						loading={isLoading}
						name="Opacity"
						value={[resource.min_user, resource.max_user]}
						onSave={(newValue) =>
							updateResource("opacity", newValue)
						}
					/>
				</EditForm>
			</>
		);
	}

	function SettingsTabPanel() {
		return (
			<Box flexDirection="row" display="flex" marginTop={2}>
				<Box flexGrow={1}>
					<Typography variant="body1" color="textPrimary">
						Delete resource
					</Typography>
					<Typography variant="caption" color="textSecondary">
						Upon deletion, the resource will not be recoverable.
					</Typography>
				</Box>
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => setDeleteOpen(true)}
				>
					Delete Resource
				</Button>
			</Box>
		);
	}

	return (
		<NavDrawer>
			{error ? (
				<Box
					alignItems="center"
					justifyContent="center"
					display="flex"
					flexDirection="column"
				>
					<Typography variant="h6">Resource Not Found...</Typography>
				</Box>
			) : (
				<div>
					<Box
						marginBottom={2}
						marginTop={3}
						display="flex"
						flexDirection="row"
					>
						{isLoading ? (
							<Skeleton variant="rect" width={200} height={150} />
						) : (
							<img
								src={resource.image_url}
								alt="room"
								style={{
									maxHeight: 150,
								}}
							/>
						)}
						<Box flexGrow={1} marginLeft={2}>
							<Typography
								variant="h5"
								component="div"
								style={{
									fontWeight: "bold",
								}}
							>
								{isLoading ? (
									<Skeleton />
								) : (
									`${resource.number}`
								)}
							</Typography>
							<Typography
								variant="h6"
								component="div"
								color="textSecondary"
							>
								{isLoading ? (
									<Skeleton />
								) : (
									`${resource.title_en}`
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
						<SettingsTabPanel />
					</TabPanel>
				</div>
			)}
			<ConfirmDialog
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				onConfirm={delteResource}
				title={`Delete Resource ${resource.id}?`}
			>
				<Typography>
					Upon deletion, the resource will not be recoverable.
				</Typography>
			</ConfirmDialog>
		</NavDrawer>
	);
}

export default DetailedCategoryPage;
