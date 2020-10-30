import React from "react";
import DataTable from "../components/DataTable";

import NavDrawer from "../components/NavDrawer";

const data = [
	{
		id: 1,
		name: "a",
		age: 12,
		position: "manager",
	},
	{
		id: 2,
		name: "b",
		age: 13,
		position: "staff",
	},
	{
		id: 3,
		name: "c",
		age: 15,
		position: "cleaner",
	},
	{
		id: 4,
		name: "d",
		age: 10,
		position: "staff",
	},
];

const headCells = [
	{
		id: "id",
		numeric: false,
		disablePadding: true,
		label: "Clerk ID",
	},
	{
		id: "name",
		numeric: false,
		disablePadding: false,
		label: "Name",
	},
	{
		id: "age",
		numeric: false,
		disablePadding: false,
		label: "Age",
	},
	{
		id: "position",
		numeric: false,
		disablePadding: false,
		label: "Job Position",
	},
];

function ManageRoomsScreen(props) {
	return (
		<NavDrawer title="Manage Rooms">
			<DataTable
				title="Clerks"
				data={data}
				headCells={headCells}
				editTag="editWorker"
				deleteTag="deleteWorker"
				onEdit={() => console.log("EDit")}
				onDelete={() => console.log("delete")}
			/>
		</NavDrawer>
	);
}

export default ManageRoomsScreen;
