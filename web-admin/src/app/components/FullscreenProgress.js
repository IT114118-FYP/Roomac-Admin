import React from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
	},
}));

function FullscreenProgress({ open }) {
	const classes = useStyles();

	return (
		<Backdrop open={open} className={classes.backdrop}>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}

export default FullscreenProgress;
