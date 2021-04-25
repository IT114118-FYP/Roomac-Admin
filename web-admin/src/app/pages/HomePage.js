import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Typography,
  TextField,
  InputAdornment,
  Grid,
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
import routes,{ TAG }  from "../navigation/routes";
import usePermission from "../navigation/usePermission";
import CardView from "../components/CardView";
import { Skeleton } from "@material-ui/lab";

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
  viewCount: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(3),
  },
  right: {
    marginRight: theme.spacing(3),
    width: theme.spacing(20),
    cursor: 'pointer',
  },
  viewHeaderBarItems: {
    marginLeft: `auto`,
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
  const [resourceData, setResourceData] = useState([]);
  const [userData, setUser] = useState([]);
  const [data, setBookings] = useState([]);
  const [count, setCount] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const { permissionReady, getPermission } = usePermission();
  const [searchTerms, setSearchTerms] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

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

      dashboard_data.data.active_bookings.forEach((data) => {
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

  const handleClick = (event, itemID) => {
    history.push(`/bookings/${itemID}`);
  };

  useEffect(()=>{
		// console.log(searchTerms);
	},[searchTerms]);

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
        {!isLoading &&  data.length > 0 &&
          <Grid container spacing={1}>
            <Grid item xs={2} style={{marginRight:10}}>
            <CardView
              title="Total Bookings"
              count={count.total_bookings}
              click={()=>getPermission(TAG.CRUD.READ + TAG.routes.bookings) && history.push(`/bookings`)}
            ></CardView>
            </Grid>
            <Grid item xs={2} style={{marginRight:10}}>
            <CardView title="Total Branch" count={count.branch} click={()=>getPermission(TAG.CRUD.READ + TAG.routes.branches) && history.push(`/branches`)} />
            </Grid>
            <Grid item xs={2} style={{marginRight:10}}>
            <CardView  title="Total Category" count={count.category} click={()=> getPermission(TAG.CRUD.READ + TAG.routes.categories) && history.push(`/categories`)} />
            </Grid><Grid item xs={2} style={{marginRight:10}}>
            <CardView title="Total Resource" count={count.resource} click={()=> getPermission(TAG.CRUD.READ + TAG.routes.resources) && history.push(`/resources`)} />
            </Grid><Grid item xs={2} >
            <CardView title="Total User" count={count.user} click={()=>getPermission(TAG.CRUD.READ + TAG.routes.users) && history.push(`/users`)} />
            </Grid>
            </Grid>
        }
      </div>
      <Grid container spacing={1} style={{marginTop:20}}>
      <Grid item xs={9}>
      {!isLoading && data.length > 0 &&
      <Typography variant="h6" gutterBottom>
        Check-in
      </Typography>
      }
      </Grid>
      <Grid item xs={3}>
      {!isLoading && data.length > 0 &&
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
      }
      </Grid></Grid>
      {!isLoading && data.length > 0 ?
      <DataTable
        loading={isLoading}
        data= {searchTerms.length < 1 ? data : searchTerms}
        labels={labels}
        onClick={handleClick}
      /> : <Skeleton />
      }
    </NavDrawer>
  );
}

export default HomePage;
