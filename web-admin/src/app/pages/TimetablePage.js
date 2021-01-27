import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	ButtonBase,
	CircularProgress,
	Divider,
	Menu,
	MenuItem,
	Paper,
	Typography,
} from "@material-ui/core";

import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import "../styles/Timetable.css";
import moment from "moment";
import BookingItem from "../components/BookingItem";
import { TimelineOppositeContent } from "@material-ui/lab";

const createData = (id, start, end) => ({
	Id: 2,
	StartTime: new Date(start),
	EndTime: new Date(end),
});

const durationOptions = [-14, -7, 7, 30, 90];

function TimetablePage(props) {
	const [isloading, setLoading] = useState(true);
	const [duration, setDuration] = useState(durationOptions[1]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [bookings, setBookings] = useState([]);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		fetchData();
	}, [duration]);

	const fetchData = () => {
		setLoading(true);
		axiosInstance
			.get(
				`api/branches/ST/bookings?start=${
					duration > 0
						? `${moment()
								.subtract(duration, "days")
								.format("YYYY-MM-DD")}`
						: `${moment().format("YYYY-MM-DD")}`
				}&end=${
					duration > 0
						? `${moment().format("YYYY-MM-DD")}`
						: `${moment()
								.subtract(duration, "days")
								.format("YYYY-MM-DD")}`
				}`
			)
			.then(({ data }) => {
				console.log(data);
				setBookings(data);
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
				<div>
					<Typography variant="h4">Bookings</Typography>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						marginBottom={2}
					>
						<Typography>
							{duration > 0
								? `${moment()
										.subtract(duration, "days")
										.format("DD/MM/YYYY")}
                                    - ${moment().format("DD/MM/YYYY")}`
								: `${moment().format("DD/MM/YYYY")}
                                    - ${moment()
										.subtract(duration, "days")
										.format("DD/MM/YYYY")}`}
						</Typography>
						<div>
							<Button
								style={{
									marginLeft: 15,
									backgroundColor: "#f0f0f0",
								}}
								aria-controls="date-menu"
								aria-haspopup="true"
								size="small"
								onClick={handleMenuClick}
							>
								{duration > 0
									? `past ${duration} days`
									: `coming ${Math.abs(duration)} days`}
							</Button>
							<Menu
								id="date-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
							>
								{durationOptions.map((option) => (
									<MenuItem
										onClick={handleMenuClose}
										key={option}
										selected={option === duration}
										onClick={() => {
											setDuration(option);
											setAnchorEl(null);
										}}
									>
										{option > 0
											? `past ${option} days`
											: `coming ${Math.abs(option)} days`}
									</MenuItem>
								))}
							</Menu>
						</div>
					</Box>
					<Divider />
					<Timeline align="alternate">
						{bookings.map((booking) => (
							<TimelineItem key={booking.id}>
								<TimelineOppositeContent>
									<Typography
										variant="body2"
										color="textSecondary"
									>
										{moment(booking.start_time).format(
											"h:mm a, DD/MM"
										)}
									</Typography>
								</TimelineOppositeContent>
								<TimelineSeparator>
									<TimelineDot />
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<BookingItem data={booking} />
								</TimelineContent>
							</TimelineItem>
						))}
					</Timeline>
				</div>
			)}
		</NavDrawer>
	);
}

export default TimetablePage;
