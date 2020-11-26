import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		width: 200,
	},
}));

export default function DateTimePicker({ title, value, onChange }) {
	const classes = useStyles();

	return (
		<form className={classes.container} noValidate>
			<TextField
				id={title}
				label={title}
				type="time"
				value={value}
				onChange={onChange}
				className={classes.textField}
				InputLabelProps={{
					shrink: true,
				}}
				inputProps={{
					step: 300, // 5 min
				}}
			/>
		</form>
	);
}
