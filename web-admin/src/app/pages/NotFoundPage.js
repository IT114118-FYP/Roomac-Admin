import React from "react";
import Typography from "@material-ui/core/Typography";

import "../styles/NotFound.css";
import { ReactComponent as NotFoundLogo } from "../resources/not-found.svg";

function NotFoundPage(props) {
	return (
		<div className="container">
			<div>
				<Typography variant="h1" className="title">
					404
				</Typography>
				<Typography variant="h4" className="description">
					Oops! Page not found...
				</Typography>
			</div>
			<NotFoundLogo className="logo" />
		</div>
	);
}

export default NotFoundPage;
