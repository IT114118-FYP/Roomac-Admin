import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import EventIcon from "@material-ui/icons/Event";
import BarChartIcon from "@material-ui/icons/BarChart";
import HistoryIcon from "@material-ui/icons/History";
import BusinessIcon from "@material-ui/icons/Business";
import PeopleIcon from "@material-ui/icons/People";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import GavelIcon from "@material-ui/icons/Gavel";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import routes from "../navigation/routes";
import ConfirmDialog from "./ConfirmDialog";
import Logo from "./Logo";
import { axiosInstance } from "../api/config";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up("sm")]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

function ResponsiveDrawer({ window, title, children }) {
	const history = useHistory();
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [isUsernameReady, setUsernameReady] = React.useState(false);

	const [openLogoutConfirm, setOpenLogoutConfirm] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = () => {
		axiosInstance
			.get("/api/users/me")
			.then(({ data }) => {
				// setUsername(data)
				setUsername(data.last_name);
				setUsernameReady(true);
			})
			.catch((error) => {
				setUsernameReady(false);
			});
	};

	const drawer = (
		<div>
			<div className={classes.toolbar}>
				<Logo title="roomac admin" />
			</div>
			<Divider />
			<List>
				<DrawerItem title="Home" path={routes.HOME}>
					<HomeIcon />
				</DrawerItem>
				<DrawerItem title="Timetable" path={routes.TIMETABLE}>
					<EventIcon />
				</DrawerItem>
				<DrawerItem title="Statistics" path={routes.STATISTICS}>
					<BarChartIcon />
				</DrawerItem>
				<DrawerItem title="Activity Log" path={routes.ACTIVITY_LOG}>
					<HistoryIcon />
				</DrawerItem>
			</List>
			<Divider />
			<List>
				<DrawerItem title="Branches" path={routes.branches.MANAGE}>
					<BusinessIcon />
				</DrawerItem>
				<DrawerItem title="Venues" path={routes.venues.MANAGE}>
					<MeetingRoomIcon />
				</DrawerItem>
				<DrawerItem title="Users" path={routes.users.MANAGE}>
					<PeopleIcon />
				</DrawerItem>
				<DrawerItem title="Programmes" path={routes.programs.MANAGE}>
					<MenuBookIcon />
				</DrawerItem>
				<DrawerItem
					title="Rules Configuration"
					path={routes.RULES_CONFIGURATION}
				>
					<GavelIcon />
				</DrawerItem>
			</List>
			<Divider />
			<List>
				<ListItem
					button
					key="Log Out"
					onClick={() => setOpenLogoutConfirm(true)}
				>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Log out" />
				</ListItem>
			</List>
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar} color="inherit">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						style={{
							flexGrow: 1,
						}}
					>
						{title}
					</Typography>
					<div>
						{isUsernameReady && (
							<Typography>Welcome, {username}!</Typography>
						)}
					</div>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						anchor="left"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{children}
			</main>
			<ConfirmDialog
				title="Log out"
				open={openLogoutConfirm}
				onConfirm={() => {
					localStorage.removeItem("authToken");
					history.push("/");
				}}
				onClose={() => setOpenLogoutConfirm(false)}
			>
				Are you sure you want to log out?
			</ConfirmDialog>
		</div>
	);
}

function DrawerItem({ title, children, path }) {
	const history = useHistory();
	return (
		<ListItem
			button
			key={title}
			onClick={() => {
				history.push(path);
			}}
		>
			<ListItemIcon>{children}</ListItemIcon>
			<ListItemText primary={title} />
		</ListItem>
	);
}

ResponsiveDrawer.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default ResponsiveDrawer;
