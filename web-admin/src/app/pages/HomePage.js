import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import NavDrawer from "../components/NavDrawer";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		justifyContent: "center",
		color: theme.palette.text.secondary,
		height: 300,
	},
}));

function HomePage(props) {
	const classes = useStyles();
	return (
		<NavDrawer title="Home">
			<div className={classes.root}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Paper className={classes.paper}>xs=6</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>xs=6</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=4</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
				</Grid>
			</div>
		</NavDrawer>
	);
}

export default HomePage;
