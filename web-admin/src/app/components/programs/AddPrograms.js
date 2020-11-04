import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import AddingFormList from "./AddingFormList";

export default function AddPrograms(props) {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="new-program"
				id="new-program"
			>
				<Typography>Add New Programmes</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<AddingFormList
					onAdd={(code, eng, chi) => {
						props.onAdd(code, eng, chi);
					}}
				/>
			</AccordionDetails>
			<Divider />
			<AccordionActions>
				<label>
					<input
						style={{ display: "none" }}
						id="upload-file"
						name="upload-file"
						type="file"
						onChange={props.onUpload}
					/>
					<Button
						color="primary"
						variant="contained"
						size="small"
						component="span"
					>
						Import Excel File
					</Button>
				</label>
				<Button size="small" onClick={props.onRest}>
					Clear
				</Button>
				<Button size="small" color="primary" onClick={props.onAdd}>
					Add
				</Button>
			</AccordionActions>
		</Accordion>
	);
}
