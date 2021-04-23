import React, { useEffect } from "react";
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
import BusinessIcon from "@material-ui/icons/Business";
import PeopleIcon from "@material-ui/icons/People";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import categories_icon from "../resources/category.png";
import branches_icon from "../resources/branch.png";
import users_icon from "../resources/user.png";
import bookings_icon from "../resources/bookings.png";
import deshboard_icon from "../resources/deshboard.png";
import logout_icon from "../resources/logout.png";
import tos_icon from "../resources/tos.png";
import programs_icon from "../resources/programs.png";

import PersonIcon from '@material-ui/icons/Person';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import CategoryIcon from '@material-ui/icons/Category';

import routes, { TAG } from "../navigation/routes";
import usePermission from "../navigation/usePermission";
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function ResponsiveDrawer({ window, title, children }) {
  const history = useHistory();
  const classes = useStyles();
  const { permissionReady, permissions, getPermission } = usePermission(true);
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
      {permissionReady && (
        <>
          <List>
            <DrawerItem title="Dashboard" path={routes.HOME}>
              <HomeIcon />
              {/* <img src={deshboard_icon} alt="" style={{height:25,width:25 }} /> */}
            </DrawerItem>
          </List>
          <Divider />
          <List>
          {getPermission(TAG.CRUD.READ + TAG.routes.bookings) && (
              <DrawerItem title="View Bookings" path={routes.bookings.MANAGE}>
                <MenuBookIcon />
                {/* <img src={bookings_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
            {getPermission(TAG.CRUD.READ + TAG.routes.branches) && (
              <DrawerItem title="Branches" path={routes.branches.MANAGE}>
                <BusinessIcon />
                {/* <img src={branches_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
            {getPermission(TAG.CRUD.READ + TAG.routes.categories) && (
              <DrawerItem title="Categories" path={routes.categories.MANAGE}>
                <CategoryIcon />
                {/* <img src={categories_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
            {getPermission(TAG.CRUD.READ + TAG.routes.resources) && (
              <DrawerItem title="Resources" path={routes.resources.MANAGE}>
                <CategoryIcon />
                {/* <img src={categories_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
            {getPermission(TAG.CRUD.READ + TAG.routes.users) && (
              <DrawerItem title="Users" path={routes.users.MANAGE}>
                <PersonIcon />
                {/* <img src={users_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}

            {getPermission(TAG.CRUD.READ + TAG.routes.programs) && (
              <DrawerItem title="Programmes" path={routes.programs.MANAGE}>
                <ViewModuleIcon />
                {/* <img src={programs_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
            {getPermission(TAG.CRUD.READ + TAG.routes.tos) && (
              <DrawerItem title="Terms and Conditions" path={routes.tos.MANAGE}>
                <MenuBookIcon />
                {/* <img src={tos_icon} alt="" style={{height:25,width:25 }} /> */}
              </DrawerItem>
            )}
          </List>
          <Divider />
        </>
      )}
      <List>
        <ListItem
          button
          key="Log Out"
          onClick={() => setOpenLogoutConfirm(true)}
        >
          <ListItemIcon>
            <ExitToAppIcon />
            {/* <img src={logout_icon} alt="" style={{height:25,width:25 }} /> */}
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
            {isUsernameReady && <Typography>Welcome, {username}!</Typography>}
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
          localStorage.clear();
          history.push("/");
        }}
        onClose={() => setOpenLogoutConfirm(false)}
      >
        Are you sure you want to log out?
      </ConfirmDialog>
    </div>
  );
}

function DrawerItem({ title, children, path, className, refresh }) {
  const history = useHistory();
  return (
    <ListItem
      button
      key={title}
      onClick={() => {
        history.push(path);
        if (refresh) {
          window.location.reload();
        }
      }}
      className={className}
    >
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
}

export default ResponsiveDrawer;
