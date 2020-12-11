import React from "react";
import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
// import "./TimetableScreen.css";

function TimetablePage(props) {
	const handleClick = () => {
		axiosInstance
			.get("api/venues")
			.then((response) => console.log(response.data));
	};

	return (
		<NavDrawer title="Timetable">
			<button onClick={handleClick}>fetch timetable</button>
		</NavDrawer>
	);
}

export default TimetablePage;
