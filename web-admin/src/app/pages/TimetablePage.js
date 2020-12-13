import React from "react";
import {
	ScheduleComponent,
	Day,
	Week,
	WorkWeek,
	Month,
	Agenda,
	Inject,
} from "@syncfusion/ej2-react-schedule";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import "../styles/Timetable.css";

function TimetablePage(props) {
	const [data, setData] = React.useState([
		{
			Id: 2,
			Subject: "Paris",
			StartTime: new Date(2020, 12, 14, 10, 0),
			EndTime: new Date(2020, 12, 14, 12, 30),
		},
	]);
	return (
		<NavDrawer title="Timetable">
			<ScheduleComponent
				selectedDate={new Date(2020, 12, 14)}
				eventSettings={{ dataSource: data }}
			>
				<Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
			</ScheduleComponent>
		</NavDrawer>
	);
}

export default TimetablePage;
