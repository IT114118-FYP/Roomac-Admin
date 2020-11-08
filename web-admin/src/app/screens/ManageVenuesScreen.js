import React from "react";
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
