import { Breadcrumbs, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";

function NewVenueScreen(props) {
	const [isAdding, setAdding] = useState(false);
	const [branch_id, setBranch_id] = useState("");
	const [number, setNumber] = useState("");
	const [title_en, setTitle_en] = useState("");
	const [title_hk, setTitle_hk] = useState("");
	const [title_cn, setTitle_cn] = useState("");

	const HandleAddVenue = () => {
		setAdding(true);
		axiosInstance
			.post("/api/venues", {
				branch_id: branch_id,
				number: number,
				title_en: title_en,
				title_hk: title_hk,
				title_cn: title_cn,
				opening_time: "09:00:00",
				closing_time: "21:00:00",
			})
			.then((response) => {
				setAdding(false);
			});
	};

	return (
		<NavDrawer title="New Venue">
			<Breadcrumbs>
				<Link to={routes.MANAGE_VENUES}>venues</Link>
				<Typography color="textPrimary">new venue</Typography>
			</Breadcrumbs>

			<TextField
				value={branch_id}
				onChange={(event) => setBranch_id(event.target.value)}
				autoFocus
				margin="dense"
				id="branch_id"
				label="Branch ID"
				fullWidth
			/>
			<TextField
				value={number}
				onChange={(event) => setNumber(event.target.value)}
				margin="dense"
				id="number"
				label="Room Number"
				fullWidth
			/>
			<TextField
				value={title_en}
				onChange={(event) => setTitle_en(event.target.value)}
				margin="dense"
				id="title_en"
				label="English Title"
				fullWidth
			/>
			<TextField
				value={title_hk}
				onChange={(event) => setTitle_hk(event.target.value)}
				margin="dense"
				id="title_hk"
				label="Chinese Title(traditinal)"
				fullWidth
			/>
			<TextField
				value={title_cn}
				onChange={(event) => setTitle_cn(event.target.value)}
				margin="dense"
				id="title_cn"
				label="Chinese Title(simplified)"
				fullWidth
			/>
		</NavDrawer>
	);
}

export default NewVenueScreen;
