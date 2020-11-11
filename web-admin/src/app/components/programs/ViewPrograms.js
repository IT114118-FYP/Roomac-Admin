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
import { labels, title, editTag, deleteTag, ignoreKeys } from "./config";
import { axiosInstance } from "../../api/config";
import download from "downloadjs";

export default function ViewPrograms(props) {
	const [programs, setPrograms] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [isExporting, setExporting] = useState(false);

	//TODO useContext to get data
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setLoading(true);
		axiosInstance.get("api/programs").then(({ data }) => {
			console.log(data);
			setPrograms(data);
			setLoading(false);
		});
	};

	const handleExport = () => {
		setExporting(true);
		axiosInstance
			.get("/api/programs/export", {
				headers: "Content-type: application/vnd.ms-excel",
				responseType: "blob",
			})
			.then((response) => {
				download(
					new Blob([response.data]),
					"programmes.xlsx",
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
				aria-controls="view-program"
				id="view-program"
			>
				<Typography>View Programmes</Typography>
			</AccordionSummary>
			{isLoading && <LinearProgress />}
			<AccordionDetails>
				{!isLoading && (
					<DataTable
						title={title}
						data={programs}
						labels={labels}
						ignoreKeys={ignoreKeys}
						editTag={editTag}
						deleteTag={deleteTag}
						onEdit={props.onEdit}
						onDelete={props.onDelete}
						onRefresh={fetchData}
					/>
				)}
			</AccordionDetails>

			<AccordionActions>
				{isExporting && <CircularProgress size={24} />}
				<Button size="small" color="primary" onClick={handleExport}>
					Export Programmes
				</Button>
			</AccordionActions>
		</Accordion>
	);
}
