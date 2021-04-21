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
  Select,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import NewPickerField, {
  createNewPickerValue,
} from "../../components/forms/new/NewPickerField";
import download from "downloadjs";
import { useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/dashboard";
import { axiosInstance } from "../../api/config";
import usePermission from "../../navigation/usePermission";
import routes, { TAG } from "../../navigation/routes";
import moment from "moment";

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

function ManageBookingPage(props) {
  const classes = useStyles();
  const [isExporting, setExporting] = useState(false);
  const [resourceData, setResourceData] = useState([]);
  const [userData, setUser] = useState([]);
  const [data, setBookings] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();
  const { permissionReady, permissions, getPermission } = usePermission();
  const [isAdmin, setAdmin] = useState(false);
  const [searchTerms, setSearchTerms] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [fetchBookingsDays, setFetchBookingsDays] = useState(0);
  

  useEffect(() => {
    creatTimeData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchBookingsDays]);

  const startDate = moment().subtract(fetchBookingsDays, "days").format("YYYY-MM-DD");
  const endDate = moment().add(fetchBookingsDays+1, "days").format("YYYY-MM-DD");

  const creatTimeData = () =>{
    const data = [{id:0,value:"Today"},{id:7,value:"Recent 7 days"},{id:30,value:"Recent 30 days"},{id:90,value:"Recent 90days"},{id:4320,value:"All bookings"}];
    const list = data.map((item) => {
      return createNewPickerValue(item.id, item.value);
    });
    setTimeData(list);
  };

  const changeDay = (value) => {
    setLoading(true);
    setFetchBookingsDays(value);
  };

  const fetchbookings = () => axiosInstance.get(`api/resourcebookings?start=${startDate}&end=${endDate}`);
  
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

  const fetchAllData = async (silence = true) => {
    if (!silence) setLoading(true);
    try {
      const [user_data, resource_data , dashboard_data] = await axios.all([
        fetchUser(),
        fetchResources(),
        fetchbookings(),
      ]);
      setBookings([]);

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

      dashboard_data.data.forEach((data) => {
        setBookings((booking) => [
          ...booking,
          {
            id: data.id,
            branch_id:(temp2.find((resource)=> resource.id === data.resource_id).branch_id),
            resource_id: (temp2.find((resource)=> resource.id === data.resource_id).resource_title),
            user_id: (temp.find((user)=> user.id === data.user_id).user_id),
            number: data.number,
            date: moment(data.start_time).format("YYYY-MM-DD"),
            start_time: moment(data.start_time).format("HH:mm"),
            end_time: moment(data.end_time).format("HH:mm"),
            checkin_time: (data.checkin_time ? moment(data.checkin_time).format("HH:mm") : "-"), 
           },
         ]);
      });

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchFunction = (value) =>{
    if (value !== ""){
      const newList = data.filter((contact)=>{
        var key = Object.keys(contact).map(function(key) {
          return contact[key];
      });
        return key.join(" ").toLowerCase().includes(value.toLowerCase());
      })
      setSearchTerms(newList);
    }  else {
      setSearchTerms(value);
    }
  };

  const handleClick = (event, itemID) => {
    history.push(`/bookings/${itemID}`);
  };

  const handleAddNew = () => {
    // alert("add new bookings");
    // history.push(routes.bookings.NEW);
  };

  const handleExport = () => {
    setExporting(true);
    axiosInstance
      .get("/api/branches/export", {
        headers: "Content-type: application/vnd.ms-excel",
        responseType: "blob",
      })
      .then((response) => {
        download(
          new Blob([response.data]),
          "branches.xlsx",
          "application/vnd.ms-excel"
        );
        setExporting(false);
      });
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
            Bookings
          </Typography>
          {permissionReady && (
            <>
              {getPermission(TAG.CRUD.CREATE + TAG.routes.bookings) && (
                <Button color="primary" size="medium" onClick={handleAddNew}>
                  Add new bookings
                </Button>
              )}
            </>
          )}
        </div>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          View and manage bookings with customisations
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={1}>
      <Grid item xs={2}>
      <Typography variant="h6" gutterBottom>
        View Bookings
      </Typography>
      </Grid>
      <Grid item xs={7}>
        <Select
        disabled={isLoading}
							id={timeData.id}
							variant="outlined"
							fullWidth
							onChange={(event)=>{
                changeDay(event.target.value);
							}}
							value={timeData.id}
              style={{height:30, width:200}}
						>
							{timeData.map((item) => (
								<MenuItem value={item.id} key={item.id}>
									{item.value}
								</MenuItem>
							))}
						</Select>
            </Grid>
      <Grid item xs={3}>
      <div className={classes.viewHeaderBar}>
        <TextField
          className={classes.viewHeaderBarItems}
          id="search-bar"
          placeholder="Search..."
          onChange={(event)=>searchFunction(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      </Grid>
      </Grid>
      <DataTable
        loading={isLoading}
        data= {searchTerms.length < 1 ? data : searchTerms}
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
            Export branches
          </Button>
          {isExporting && <CircularProgress size={24} />}
        </div>
      )}
    </NavDrawer>
  );
}

export default ManageBookingPage;
