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
import { deleteTag, editTag, title, ignoreKeys, labels } from "./config";
import { axiosInstance } from "../../api/config";
import download from "downloadjs";

function ViewBranches(props) {
	const [branches, setBranches] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [isExporting, setExporting] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setLoading(true);
		axiosInstance.get("api/branches").then(({ data }) => {
			setBranches(data);
			setLoading(false);
		});
	};

	const handleDelete = () => {
		setLoading(true);
		let branch = JSON.parse(localStorage.getItem(deleteTag));
		localStorage.removeItem(deleteTag);
		axiosInstance
			.delete("/api/branches", { data: { ids: branch } })
			.then(() => {
				// this.setState({ deleteSuccess: true, isLoading: false });
				// this.fetchPrograms();
				setLoading(false);
				fetchData();
			})
			.catch(() => {
				// this.setState({ deleteFailed: true, isLoading: false });
			});
	};

	const handleExport = () => {
		setExporting(true);
		axiosInstance
			.get("/api/branches/export", {
				headers: "Content-type: application/vnd.ms-excel",
				responseType: "blob",
			})
			.then((response) => {
				download(
					new Blob([response.data]),
					"branches.xlsx",
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
				aria-controls="view-branch"
				id="view-branch"
			>
				<Typography>View Branches</Typography>
			</AccordionSummary>
			{isLoading && <LinearProgress />}
			<AccordionDetails>
				{!isLoading && (
					<DataTable
						title={title}
						data={branches}
						labels={labels}
						ignoreKeys={ignoreKeys}
						editTag={editTag}
						deleteTag={deleteTag}
						onEdit={props.onEdit}
						onDelete={handleDelete}
						onRefresh={props.onRefresh}
					/>
				)}
			</AccordionDetails>

			<AccordionActions>
				{isExporting && <CircularProgress size={24} />}
				<Button size="small" color="primary" onClick={handleExport}>
					Export Venues
				</Button>
			</AccordionActions>
		</Accordion>
	);
}

export default ViewBranches;
