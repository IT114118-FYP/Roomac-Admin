import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import { CircularProgress, LinearProgress } from "@material-ui/core";

import DataTable from "../DataTable";
import { programHeadCells } from "./config";

export default function ViewPrograms(props) {
	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="view-program"
				id="view-program"
			>
				<Typography>View Programmes</Typography>
			</AccordionSummary>
			{props.isTableLoading && <LinearProgress />}
			<AccordionDetails>
				<DataTable
					title="Programes"
					editTag="editCode"
					deleteTag="deleteCode"
					headCells={programHeadCells}
					data={props.data}
					onEdit={props.onEdit}
					onDelete={props.onDelete}
					onRefresh={props.onRefresh}
				/>
			</AccordionDetails>

			<AccordionActions>
				{props.isExportLoading && <CircularProgress size={24} />}
				<Button size="small" color="primary" onClick={props.onExport}>
					Export Programmes
				</Button>
			</AccordionActions>
		</Accordion>
	);
}
