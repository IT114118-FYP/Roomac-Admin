import {
	Breadcrumbs,
	LinearProgress,
	TextField,
	Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../api/config";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";

function EditVenuePage({ match }) {
	const [venue, setVenue] = useState({});
	const [isLoading, setLoading] = useState(true);
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
			setVenue(data);
			setBranch_id(data.branch_id);
			setNumber(data.number);
			setTitle_en(data.title_en);
			setTitle_hk(data.title_hk);
			setTitle_cn(data.title_cn);
			setOpeningTime(data.openingTime);
			setClosingTime(data.closingTime);
			setLoading(false);
		});
	};

	return (
		<NavDrawer title="Edit Venues">
			<Breadcrumbs aria-label="breadcrumb">
				<Link to={routes.MANAGE_VENUES}>veyvuynues</Link>
				<Typography color="textPrimary">details</Typography>
			</Breadcrumbs>
			{/* {isLoading ? (
				<LinearProgress />
			) : ( */}
			<>
				{/* <Typography variant="h4" gutterBottom>
						{venue.number}
					</Typography> */}
				{isLoading ? (
					<TextField
						value={branch_id}
						onChange={(event) => setBranch_id(event.target.value)}
						autoFocus
						margin="dense"
						id="branch_id"
						label="Branch ID"
						fullWidth
					/>
				) : (
					<Skeleton width="100%" />
				)}
				{/* <TextField
						value={number}
						onChange={(event) => setNumber(event.target.value)}
						autoFocus
						margin="dense"
						id="number"
						label="Room Number"
						fullWidth
					/>
					<TextField
						value={title_en}
						onChange={(event) => setTitle_en(event.target.value)}
						autoFocus
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
					/> */}
			</>
			{/* )} */}
		</NavDrawer>
	);
}

export default EditVenuePage;
