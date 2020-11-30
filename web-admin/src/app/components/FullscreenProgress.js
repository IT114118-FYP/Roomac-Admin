import { Backdrop, CircularProgress, LinearProgress } from "@material-ui/core";
import React from "react";

function FullscreenProgress({ open }) {
	return (
		<Backdrop
			open={open}
			style={{
				zIndex: 1,
			}}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
}

export default FullscreenProgress;
