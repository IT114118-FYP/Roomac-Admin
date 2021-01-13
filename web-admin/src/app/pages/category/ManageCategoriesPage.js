import React, { useEffect } from "react";
import { axiosInstance } from "../../api/config";
import NavDrawer from "../../components/NavDrawer";

function ManageCategoriesPage(props) {
	useEffect(() => {
		fetchCategory();
	}, []);

	const fetchCategory = () => {
		axiosInstance.get("api/categories").then(({ data }) => {
			console.log(data);
		});
	};
	return <NavDrawer></NavDrawer>;
}

export default ManageCategoriesPage;
