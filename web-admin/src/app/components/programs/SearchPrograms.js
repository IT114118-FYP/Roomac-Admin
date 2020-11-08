import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { MenuItem, Select } from "@material-ui/core";

import { programHeadCells } from "./config";

export default function SearchPrograms(props) {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="search-program"
				id="search-program"
			>
				<Typography>Search</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Select
					value={props.searchValue}
					onChange={props.onSearchChange}
				>
					{programHeadCells.map(({ id, label }) => (
						<MenuItem key={id} value={id}>
							{label}
						</MenuItem>
					))}
				</Select>
				<TextField
					fullWidth
					id="searchField"
					label="Enter Search"
					type="search"
				/>
				{/* <SearchBar /> */}
			</AccordionDetails>
			<Divider />
			<AccordionActions>
				<Button size="small" onClick={props.onReset}>
					Clear
				</Button>
				<Button size="small" color="primary" onClick={props.onSearch}>
					Search
				</Button>
			</AccordionActions>
		</Accordion>
	);
}
