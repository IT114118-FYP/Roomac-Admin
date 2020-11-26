import React from "react";
import { Link, Route } from "react-router-dom";
import NavDrawer from "../components/NavDrawer";
import ViewVenues from "../components/venues/ViewVenues";

function ManageVenuesScreen(props) {
	return (
		<NavDrawer title="Manage Venues">
			<ViewVenues />
		</NavDrawer>
	);
}

export default ManageVenuesScreen;
