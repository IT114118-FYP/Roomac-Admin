import React from "react";
import { ButtonBase, makeStyles, Paper, Typography } from "@material-ui/core";
// import "../styles/cursor.css";
const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(1.5),
		marginBottom: theme.spacing(1),
	},
}));

function BookingItem({ data }) {
	const classes = useStyles();

	return (
		<Paper elevation={1} className={classes.paper}>
			<Typography variant="h6">{data.resource.number}</Typography>
			<Typography variant="caption">
				booked by {data.user.name}
			</Typography>
		</Paper>
	);
}

export default BookingItem;
