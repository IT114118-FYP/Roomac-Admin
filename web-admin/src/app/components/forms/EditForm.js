import React from "react";
import { Paper, Typography } from "@material-ui/core";

function EditForm({ title, children }) {
	return (
		<Paper
			variant="outlined"
			style={{
				padding: 15,
				marginBottom: 15,
			}}
		>
			<Typography variant="h6">{title}</Typography>
			{children}
		</Paper>
	);
}

export default EditForm;
