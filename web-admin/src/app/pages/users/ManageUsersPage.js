import React from "react";
import NavDrawer from "../../components/NavDrawer";
import ViewUsers from "../../components/users/ViewUsers";

function ManageUsersPage(props) {
	return (
		<NavDrawer title="Manage User">
			<ViewUsers />
		</NavDrawer>
	);
}

export default ManageUsersPage;
