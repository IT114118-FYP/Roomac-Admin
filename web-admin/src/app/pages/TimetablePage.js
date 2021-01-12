import React, { useEffect, useState } from "react";
import {
	ScheduleComponent,
	Week,
	Agenda,
	MonthAgenda,
	Inject,
	ViewsDirective,
	ViewDirective,
} from "@syncfusion/ej2-react-schedule";
import { Box, CircularProgress } from "@material-ui/core";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import "../styles/Timetable.css";
import moment from "moment";

const createData = (id, start, end) => ({
	Id: 2,
	Subject: "Event",
	StartTime: new Date(start),
	EndTime: new Date(end),
});

function TimetablePage(props) {
	const [isloading, setLoading] = useState(true);
	const [data, setData] = useState({});
	const [startHour, setStartHour] = useState("8:00");
	const [endHour, setEndHour] = useState("18:00");
	const [interval, setInterval] = useState("10");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setLoading(true);
		axiosInstance.get("/api/venues/1/bookings").then(({ data }) => {
			console.log(data);
			setData(data);
			setInterval(data.interval);
			setStartHour(moment(data.opening_time, "hh:mm:ss").format("H:mm"));
			setEndHour(moment(data.closing_time, "hh:mm:ss").format("H:mm"));
			const processedData = data.bookings.unavailable.booked.map(
				(booking) =>
					createData(booking.id, booking.start_time, booking.end_time)
			);
			setData(processedData);
			setLoading(false);
		});
	};

	return (
		<NavDrawer title="Timetable">
			{isloading ? (
				<Box
					width="100%"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<CircularProgress />
				</Box>
			) : (
				<ScheduleComponent
					readonly
					height="750px"
					eventSettings={{
						dataSource: data,
						enableIndicator: true,
						enableTooltip: true,
						// enableMaxHeight: true,
						// ignoreWhitespace: true,
					}}
					timeScale={{ enable: true, interval: interval }}
					timezone={data.timezone}
				>
					<ViewsDirective>
						<ViewDirective
							option="Week"
							startHour={startHour}
							endHour={endHour}
						/>
						<ViewDirective option="Agenda" />
						<ViewDirective option="MonthAgenda" isSelected={true} />
					</ViewsDirective>
					<Inject services={[Week, Agenda, MonthAgenda]} />
				</ScheduleComponent>
			)}
		</NavDrawer>
	);
}

export default TimetablePage;
