import React, { useEffect, useState } from "react";
import {
  Divider,
  makeStyles,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import download from "downloadjs";
import { useHistory } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/users";
import { axiosInstance } from "../../api/config";
import usePermission from "../../navigation/usePermission";
import routes, { TAG } from "../../navigation/routes";

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

function ManageUsersPage(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isExporting, setExporting] = useState(false);
  const [isImporting, setImporting] = useState(false);
  const history = useHistory();
  const { permissionReady, getPermission } = usePermission();
  const [searchTerms, setSearchTerms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axiosInstance.get("api/users").then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  };

  const handleClick = (event, itemID) => {
    history.push(`/users/${itemID}`);
  };
  const handleAddNew = () => {
    history.push(routes.users.NEW);
  };

  const handleExport = () => {
    setExporting(true);
    axiosInstance
      .get("/api/users/export", {
        headers: "Content-type: application/vnd.ms-excel",
        responseType: "blob",
      })
      .then((response) => {
        download(
          new Blob([response.data]),
          "users.xlsx",
          "application/vnd.ms-excel"
        );
        setExporting(false);
      });
  };

  useEffect(()=>{
		console.log(searchTerms);
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

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    handleImport("file", e.target.files[0]);
  };

  const handleImport = (name, value) => {
    setImporting(true);
      let formData = new FormData();
      formData.set(name, value);
    
      axiosInstance
        .post(`api/users/import`, formData)
        .then(() => {
          setImporting(false);
          alert("Data Imported!");
          window.location.reload();
        })
        .catch((error) => {
          setImporting(false);
          alert("Failed Import Data \nPlease provide correct format");
          console.log(error.response);
        });

      return;
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
            Users
          </Typography>
          {getPermission(TAG.CRUD.CREATE + TAG.routes.users) && (
            <Button color="primary" size="medium" onClick={handleAddNew}>
              Add new users
            </Button>
          )}
        </div>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          View and manage users with customisations
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={1}>
      <Grid item xs={9}>
      <Typography variant="h6" gutterBottom>
        View Users
      </Typography>
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
      <Grid container spacing={1}>
      <Grid item xs={9}>
      {!isLoading && (
        <div className={classes.exportWrapper}>
          <Button
            size="small"
            color="primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            Export users
          </Button>
          {isExporting && <CircularProgress size={24} />}
        </div>
      )}
      </Grid>
      <Grid item xs={3}>
      {!isLoading && (
        <div className={classes.exportWrapper}>
          <>
            <div>
              <input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                id="xlsx"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={onSelectFile}
              />
              <label htmlFor="xlsx">
                <Button
                color="primary"
                component="span"
                disabled={isImporting}
                >
                  Import USERS 
                  </Button>
                  </label>
                  </div>
                  </>
          {isImporting && <CircularProgress size={24} />}
        </div>
      )}
      </Grid>
      </Grid>
    </NavDrawer>
  );
}

export default ManageUsersPage;
