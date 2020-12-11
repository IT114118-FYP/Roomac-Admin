import React, { useEffect, useState } from "react";
import {
	Box,
	Breadcrumbs,
	Button,
	ButtonGroup,
	IconButton,
	LinearProgress,
	TextField,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import routes from "../navigation/routes";

function DetailedVenuePage({ match }) {
	const [isLoading, setLoading] = useState(true);
	const [isEditable, setEditable] = useState(false);
	const [data, setData] = useState({});
	const [branch_id, setBranch_id] = useState("");
	const [number, setNumber] = useState("");
	const [title_en, setTitle_en] = useState("");
	const [title_hk, setTitle_hk] = useState("");
	const [title_cn, setTitle_cn] = useState("");
	const [openingTime, setOpeningTime] = useState("");
	const [closingTime, setClosingTime] = useState("");

	useEffect(() => {
		fetchVenue();
	}, []);

	const fetchVenue = () => {
		setLoading(true);
		axiosInstance.get(`/api/venues/${match.params.id}`).then(({ data }) => {
			setData(data);
			resetData(data);
			setLoading(false);
		});
	};

	const toggleEdit = () => {
		setEditable(true);
	};

	const handleCancelEdit = () => {
		setEditable(false);
		resetData(data);
	};

	const handleUpdate = () => {
		setEditable(false);
		setLoading(true);
		axiosInstance
			.put(`/api/venues/${data.id}`, {
				branch_id: branch_id,
				number: number,
				title_en: title_en,
				title_hk: title_hk,
				title_cn: title_cn,
				opening_time: "09:00:00",
				closing_time: "21:00:00",
			})
			.then(() => setLoading(false));
	};

	const resetData = (d) => {
		setBranch_id(d.branch_id);
		setNumber(d.number);
		setTitle_en(d.title_en);
		setTitle_hk(d.title_hk);
		setTitle_cn(d.title_cn);
		setOpeningTime(d.openingTime);
		setClosingTime(d.closingTime);
	};

	return (
		<NavDrawer title="Edit Venues">
			<Breadcrumbs aria-label="breadcrumb">
				<Link to={routes.MANAGE_VENUES}>venues</Link>
				<Typography color="textPrimary">details</Typography>
			</Breadcrumbs>
			{isLoading ? (
				<LinearProgress />
			) : (
				<>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							marginTop: 20,
						}}
					>
						<Typography variant="h3">
							{data.number} - {data.title_en}
						</Typography>

						<Tooltip title="Edit details">
							<IconButton aria-label="edit" onClick={toggleEdit}>
								<EditIcon fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</div>
					<Typography component="div">
						<Box
							fontWeight="fontWeightLight"
							fontSize="caption.fontSize"
							m={1}
						>
							Last updated: {data.updated_at}
						</Box>
					</Typography>
					<TextField
						value={branch_id}
						onChange={(event) => setBranch_id(event.target.value)}
						autoFocus
						margin="dense"
						id="branch_id"
						label="Branch ID"
						fullWidth
						disabled={!isEditable}
					/>
					<TextField
						value={number}
						onChange={(event) => setNumber(event.target.value)}
						margin="dense"
						id="number"
						label="Room Number"
						fullWidth
						disabled={!isEditable}
					/>
					<TextField
						value={title_en}
						onChange={(event) => setTitle_en(event.target.value)}
						margin="dense"
						id="title_en"
						label="English Title"
						fullWidth
						disabled={!isEditable}
					/>
					<TextField
						value={title_hk}
						onChange={(event) => setTitle_hk(event.target.value)}
						margin="dense"
						id="title_hk"
						label="Chinese Title(traditinal)"
						fullWidth
						disabled={!isEditable}
					/>
					<TextField
						value={title_cn}
						onChange={(event) => setTitle_cn(event.target.value)}
						margin="dense"
						id="title_cn"
						label="Chinese Title(simplified)"
						fullWidth
						disabled={!isEditable}
					/>
					{isEditable && (
						<ButtonGroup
							color="primary"
							aria-label="outlined primary button group"
							style={{
								marginTop: 15,
							}}
						>
							<Button
								variant="outlined"
								color="primary"
								onClick={handleCancelEdit}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleUpdate}
							>
								Update
							</Button>
						</ButtonGroup>
					)}
				</>
			)}
		</NavDrawer>
	);
}

export default DetailedVenuePage;
