import React, { useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import { CircularProgress, LinearProgress } from "@material-ui/core";

import DataTable from "../DataTable";
import { title, ignoreKeys, labels } from "./config";
import { axiosInstance } from "../../api/config";
import download from "downloadjs";
import { useHistory } from "react-router-dom";

function ViewUsers(props) {
	const [users, setUsers] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [isExporting, setExporting] = useState(false);
	const history = useHistory();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setLoading(true);
		axiosInstance.get("api/users").then(({ data }) => {
			setUsers(data);
			setLoading(false);
		});
	};

	const handleClick = (event, itemID) => {
		history.push(`/venues/${itemID}`);
	};

	const handleAdd = () => {
		history.push(`/venues/new`);
	};

	const handleExport = () => {
		setExporting(true);
		axiosInstance
			.get("/api/users/export", {
				headers: "Content-type: application/vnd.ms-excel",
				responseType: "blob",
			})
			.then((response) => {
				download(
					new Blob([response.data]),
					"users.xlsx",
					"application/vnd.ms-excel"
				);
				setExporting(false);
			})
			.catch(() => {
				setExporting(false);
			});
	};

	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="view-user"
				id="view-user"
			>
				<Typography>View User</Typography>
			</AccordionSummary>
			{isLoading && <LinearProgress />}
			<AccordionDetails>
				{!isLoading && (
					<DataTable
						title={title}
						data={users}
						labels={labels}
						ignoreKeys={ignoreKeys}
						onClick={handleClick}
						onAdd={handleAdd}
						onRefresh={fetchData}
					/>
				)}
			</AccordionDetails>

			<AccordionActions>
				{isExporting && <CircularProgress size={24} />}
				<Button size="small" color="primary" onClick={handleExport}>
					Export Users
				</Button>
			</AccordionActions>
		</Accordion>
	);
}

export default ViewUsers;
