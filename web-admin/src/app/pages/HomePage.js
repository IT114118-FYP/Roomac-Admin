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
import * as axios from "axios";

import NavDrawer from "../components/NavDrawer";
import DataTable from "../components/DataTable";
import { labels } from "../config/tables/dashboard";
import { axiosInstance } from "../api/config";
import routes from "../navigation/routes";
import usePermission from "../navigation/usePermission";
import CardView from "../components/CardView";

import moment from "moment";

const filterData = ["filter 1", "filter 2", "filter 3", "filter 4", "filter 5"];

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  titleDiv: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    flex: 1,
  },
  viewHeaderBar: {
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(3),
  },
  viewCount: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(3),
  },
  right: {
    marginRight: theme.spacing(3),
    width: theme.spacing(20),
  },
  viewHeaderBarItems: {
    marginRight: theme.spacing(5),
  },
  filterChip: {
    margin: theme.spacing(0.5),
  },
  exportWrapper: {
    display: "flex",
    margin: theme.spacing(1),
    alignItems: "center",
  },
}));

function HomePage(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchFilters, setSeacrhFilters] = React.useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [userData, setUser] = useState([]);
  const [data, setBookings] = useState([]);
  const [count, setCount] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isExporting, setExporting] = useState(false);
  const history = useHistory();
  const { permissionReady, permissions, getPermission } = usePermission();
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!permissionReady) return;
    if (!getPermission("login:admin")) {
      alert("No Permission");
      localStorage.removeItem("authToken");
      history.push("/");
    }
    setAdmin(true);
  }, [permissionReady]);

  const fetchUser = () => axiosInstance.get(`api/users`);

  const fetchResources = () => axiosInstance.get(`api/resources`);

  const fetchDashboard = () => axiosInstance.get("api/dashboard");

  const fetchAllData = async (silence = true) => {
    if (!silence) setLoading(true);
    try {
      const [user_data, resource_data , dashboard_data] = await axios.all([
        fetchUser(),
        fetchResources(),
        fetchDashboard(),
      ]);

      var temp = [];
      user_data.data.forEach((data) => {
        temp.push({
          id: data.id,
          user_id: data.name,
        });
      });
      setUser(temp);

      var temp2 = [];
      resource_data.data.forEach((data) => {
        temp2.push({
          id: data.id,
          branch_id: data.branch_id,
          resource_title: data.number == "" ? "null" : data.number,
        });
      });
      setResourceData(temp2);

      setCount(dashboard_data.data.count);

      console.log(dashboard_data.data.active_bookings);
      dashboard_data.data.active_bookings.forEach((data) => {
        setBookings((booking) => [
          ...booking,
          {
            id: data.id,
            branch_id:(temp2.find((resource)=> resource.id === data.resource_id).branch_id),
            resource_id: (temp2.find((resource)=> resource.id === data.resource_id).resource_title),
            user_id: (temp.find((user)=> user.id === data.user_id).user_id),
            number: data.number,
            date: moment(data.start_time).format("MM-DD-YYYY"),
            start_time: moment(data.start_time).format("HH:mm"),
            end_time: moment(data.end_time).format("HH:mm"),
           },
         ]);
      });

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClick = (event, itemID) => {
    history.push(`/bookings/${itemID}`);
  };

  const handleExport = () => {
    console.log(userData);
    console.log(data);
    // console.log(userData.find((data)=> data.id == 1).user_id);
    // setExporting(true);
    // axiosInstance
    //   .get("/api/users/export", {
    //     headers: "Content-type: application/vnd.ms-excel",
    //     responseType: "blob",
    //   })
    //   .then((response) => {
    //     download(
    //       new Blob([response.data]),
    //       "users.xlsx",
    //       "application/vnd.ms-excel"
    //     );
    //     setExporting(false);
    //   });
  };

  const toggleAddFilters = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const addfilter = (event, index) => {
    if (!searchFilters.includes(filterData[index])) {
      setSeacrhFilters([...searchFilters, filterData[index]]);
    }
    handleCloseFilter();
  };

  const handlefilterDelete = (filterToDelete) => {
    setSeacrhFilters((filters) =>
      filters.filter((filter) => filter !== filterToDelete)
    );
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  return (
    <NavDrawer>
      <div>
        <div className={classes.titleDiv}>
          <Typography
            variant="h3"
            color="textPrimary"
            className={classes.title}
          >
            Dashboard
          </Typography>
        </div>
        {!isLoading &&
        <div className={classes.viewCount}>
          <div className={classes.right}>
            <CardView
              title="Total Bookings"
              count={count.total_bookings}
            ></CardView>
          </div>
          <div className={classes.right}>
            <CardView title="Total Branch" count={count.branch} />
          </div>
          <div className={classes.right}>
            <CardView title="Total Category" count={count.category} />
          </div>
          <div className={classes.right}>
            <CardView title="Total Resource" count={count.resource} />
          </div>
          <div className={classes.right}>
            <CardView title="Totol User" count={count.user} />
          </div>
        </div>
        }
      </div>
      {!isLoading &&
      <Typography variant="h6" gutterBottom>
        View Bookings
      </Typography>
      }
      {!isLoading &&
      <div className={classes.viewHeaderBar}>
        <TextField
          className={classes.viewHeaderBarItems}
          id="search-bar"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      
        <div className={classes.viewHeaderBarItems}>
          <Button
            onClick={toggleAddFilters}
            color="primary"
            startIcon={<FilterListIcon />}
          >
            Add filters
          </Button>
          {userData.length == 0 && (
            <Menu
              id="fliters"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseFilter}
            >
              {filterData.map((data, index) => (
                <MenuItem
                  key={data}
                  onClick={(event) => addfilter(event, index)}
                >
                  {data}
                </MenuItem>
              ))}
            </Menu>
          )}
        </div>
      
        {searchFilters.map((filter) => (
          <Chip
            color="default"
            onDelete={() => handlefilterDelete(filter)}
            label={filter}
            className={classes.filterChip}
          />
        ))}
      </div>
}
      <DataTable
        loading={isLoading}
        data={data}
        labels={labels}
        onClick={handleClick}
      />

      {!isLoading && (
        <div className={classes.exportWrapper}>
          <Button
            size="small"
            color="primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            Export Bookings
          </Button>
          {isExporting && <CircularProgress size={24} />}
        </div>
      )}
    </NavDrawer>
  );
}

export default HomePage;
