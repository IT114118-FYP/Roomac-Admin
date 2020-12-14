import React, { useEffect, useState } from "react";
import {
	ScheduleComponent,
	Day,
	Week,
	WorkWeek,
	Month,
	Agenda,
	MonthAgenda,
	TimelineViews,
	Inject,
	ViewsDirective,
	ViewDirective,
	TimelineMonth,
} from "@syncfusion/ej2-react-schedule";
import { LinearProgress } from "@material-ui/core";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import "../styles/Timetable.css";

const createData = (start, end) => ({
	Id: 2,
	Subject: "Event",
	StartTime: new Date(start),
	EndTime: new Date(end),
});

function TimetablePage(props) {
	const [isloading, setLoading] = useState(true);
	const [interval, setInterval] = useState(30);
	const [data, setData] = useState([]);
	const [startHour, setStartHour] = useState("8:00");
	const [endHour, setEndHour] = useState("18:00");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setLoading(true);
		axiosInstance.get("/api/venues/1/bookings").then(({ data }) => {
			console.log(data);
			setData(data);
			setInterval(data.interval);
			const processedData = data.bookings.reserved.map((booking) =>
				createData(booking.start_time, booking.end_time)
			);
			setData(processedData);
			setLoading(false);
		});
	};

	return (
		<NavDrawer title="Timetable">
			{isloading && <LinearProgress />}
			{!isloading && (
				<ScheduleComponent
					readonly
					height="750px"
					eventSettings={{ dataSource: data }}
					timeScale={{ enable: true, interval: interval }}
					workHours={{
						highlight: true,
						start: startHour,
						end: endHour,
					}}
				>
					<ViewsDirective>
						<ViewDirective option="Week" />
						<ViewDirective option="Month" />
						<ViewDirective option="WorkWeek" />
						<ViewDirective option="Month" />
						<ViewDirective option="Agenda" />
						<ViewDirective option="MonthAgenda" isSelected={true} />
						<ViewDirective option="TimelineDay" />
						<ViewDirective option="TimelineWeek" />
						<ViewDirective option="TimelineMonth" />
					</ViewsDirective>
					<Inject
						services={[
							Day,
							Week,
							WorkWeek,
							Month,
							Agenda,
							MonthAgenda,
							TimelineViews,
							TimelineMonth,
						]}
					/>
				</ScheduleComponent>
			)}
		</NavDrawer>
	);
}

export default TimetablePage;
