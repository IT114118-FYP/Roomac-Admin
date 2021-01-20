import React, { useEffect } from "react";
import { axiosInstance } from "../../api/config";
import NavDrawer from "../../components/NavDrawer";

function DetailedCategoryPage({ match }) {
	useEffect(() => {
		axiosInstance
			.get(`api/resources/${match.params.id}`)
			.then(({ data }) => {
				console.log(data);
			});
	});
	return <NavDrawer>{match.params.id}</NavDrawer>;
}

export default DetailedCategoryPage;
