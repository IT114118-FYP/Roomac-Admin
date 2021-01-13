import {
	Box,
	Breadcrumbs,
	Button,
	Divider,
	Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";
import DataTable from "../../components/DataTable";
import { ignoreKeys, labels } from "../../config/tables/rulesConfig";

function DetailedBranchPage({ match }) {
	const [isLoading, setLoading] = useState(true);
	const [branch, setBranch] = useState({});
	const [settings, setSettings] = useState({});
	const [error, setError] = useState(false);

	useEffect(() => {
		fetchBranch();
		fetchSettings();
	}, []);

	const fetchBranch = () => {
		setLoading(true);
		axiosInstance
			.get(`api/branches/${match.params.id}`)
			.then(({ data }) => {
				setBranch(data);
			})
			.catch((error) => {
				console.log(error);
				setError(true);
			});
	};

	const fetchSettings = () => {
		axiosInstance
			.get(`api/branches/${match.params.id}/settings`)
			.then(({ data }) => {
				setSettings(data.versions);
				setLoading(false);
			});
	};

	const updateBranch = (name, value) => {
		setLoading(true);
		axiosInstance
			.put(`api/branches/${match.params.id}`, {
				id: name == "id" ? value : branch.id,
				title_en: name == "title_en" ? value : branch.title_en,
				title_hk: name == "title_hk" ? value : branch.title_hk,
				title_cn: name == "title_cn" ? value : branch.title_cn,
			})
			.then(() => {
				fetchBranch();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSettingClick = () => {};

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
						ignoreKeys={ignoreKeys}
						onClick={handleSettingClick}
					/>
				</div>
			)}
		</NavDrawer>
	);
}

export default DetailedBranchPage;
