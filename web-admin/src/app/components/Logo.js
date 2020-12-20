import React from "react";
import { Box, Typography } from "@material-ui/core";

function Logo({ title = "admin", large }) {
	return (
		<Box
			display="flex"
			height={large ? 100 : 64}
			marginBottom={large ? 2 : 0}
			alignItems="center"
			justifyContent="center"
		>
			<img
				src={require("../resources/icon.png")}
				alt="admin"
				height={large ? 100 : 30}
				style={{
					marginRight: large ? 15 : 5,
				}}
			/>
			<Typography
				style={{
					marginLeft: large ? 15 : 5,
					fontSize: large ? 75 : 24,
					fontWeight: "500",
					fontStyle: "italic",
					fontFamily: "sans-serif",
				}}
			>
				{title}
			</Typography>
		</Box>
	);
}

export default Logo;
