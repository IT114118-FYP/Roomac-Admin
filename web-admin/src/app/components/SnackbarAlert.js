import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function SnackbarAlert({
	open,
	onClose,
	alertText,
	autoHideDuration = 5000,
	severity = "error",
	action,
}) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			onClose={onClose}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				severity={severity}
				action={action}
			>
				{alertText}
			</MuiAlert>
		</Snackbar>
	);
}

export default SnackbarAlert;
