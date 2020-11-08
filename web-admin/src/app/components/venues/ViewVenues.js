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

function ViewVenues(props) {
	const [venues, setVenues] = useState([]);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		axiosInstance.get("api/venues").then(({ data }) => {
			console.log(data);
			setVenues(data);
			setLoading(false);
		});
	};

	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="view-venue"
				id="view-venue"
			>
				<Typography>View Venues</Typography>
			</AccordionSummary>
			{props.isTableLoading && <LinearProgress />}
			<AccordionDetails>
				{!isLoading && (
					<DataTable
						title={title}
						data={venues}
						labels={labels}
						ignoreKeys={ignoreKeys}
						editTag={editTag}
						deleteTag={deleteTag}
						onEdit={props.onEdit}
						onDelete={props.onDelete}
						onRefresh={props.onRefresh}
					/>
				)}
			</AccordionDetails>

			<AccordionActions>
				{props.isExportLoading && <CircularProgress size={24} />}
				<Button size="small" color="primary" onClick={props.onExport}>
					Export Venues
				</Button>
			</AccordionActions>
		</Accordion>
	);
}

export default ViewVenues;
