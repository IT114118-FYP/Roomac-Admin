import React from "react";
import ViewBranches from "../../components/branches/ViewBranches";
import NavDrawer from "../../components/NavDrawer";

function ManageBranchesPage(props) {
	return (
		<NavDrawer title="Manage Branches">
			<ViewBranches />
		</NavDrawer>
	);
}

export default ManageBranchesPage;
