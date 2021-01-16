import React, { useEffect, useState } from "react";
import {
	Divider,
	makeStyles,
	Typography,
	Button,
	TextField,
	InputAdornment,
	Menu,
	MenuItem,
	Chip,
	CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import download from "downloadjs";
import { useHistory } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/categories";

function ManageCategoriesPage({ match }) {
	const [data, setData] = useState([]);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetchCategory();
	}, []);

	const fetchCategory = () => {
		axiosInstance
			.get(`api/categories/${match.params.id}`)
			.then(({ data }) => {
				console.log(data);
				setData(data);
				setLoading(false);
			});
	};

	const handleClick = () => {};

	return (
		<NavDrawer>
			<DataTable
				loading={isLoading}
				data={data}
				labels={labels}
				onClick={handleClick}
			/>
		</NavDrawer>
	);
}

export default ManageCategoriesPage;
