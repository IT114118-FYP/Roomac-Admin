import React from "react";
import NavDrawer from "../../components/NavDrawer";
import ViewPrograms from "../../components/programs/ViewPrograms";

function ManageProgramsPage(props) {
	return (
		<NavDrawer title="Manage Programmes">
			<ViewPrograms />
		</NavDrawer>
	);
}

export default ManageProgramsPage;
