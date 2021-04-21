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
  Grid,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import download from "downloadjs";
import { useHistory } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/categories";
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
    marginRight: theme.spacing(5),
  },
  filterChip: {
    margin: theme.spacing(0.5),
  },
  exportWrapper: {
    display: "flex",
    margin: theme.spacing(1),
  },
}));

function ManageCategoriesPage(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchFilters, setSeacrhFilters] = React.useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isExporting, setExporting] = useState(false);
  const history = useHistory();
  const { permissionReady, permissions, getPermission } = usePermission();
  const [searchTerms, setSearchTerms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axiosInstance.get("api/categories").then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  };

  const handleClick = (event, itemID) => {
    getPermission(TAG.CRUD.READ + TAG.routes.resources)
      ? history.push(`/categories/${itemID}`)
      : alert("Insufficient permissions to read the resources.");
  };

  const handleAddNew = () => {
    history.push(routes.categories.NEW);
  };

  const handleExport = () => {
    setExporting(true);
    axiosInstance
      .get("/api/categories/export", {
        headers: "Content-type: application/vnd.ms-excel",
        responseType: "blob",
      })
      .then((response) => {
        download(
          new Blob([response.data]),
          "programs.xlsx",
          "application/vnd.ms-excel"
        );
        setExporting(false);
      });
  };
  
  const searchFunction = (value) =>{
    // console.log(value);
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
            Categories
          </Typography>
          {permissionReady &&
            getPermission(TAG.CRUD.CREATE + TAG.routes.categories) && (
              <Button color="primary" size="medium" onClick={handleAddNew}>
                Add new categories
              </Button>
            )}
        </div>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          View and manage categories with customisations
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={1}>
      <Grid item xs={9}>
      <Typography variant="h6" gutterBottom>
        View Categories
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
      {permissionReady &&
        <DataTable
          loading={isLoading}
          data= {searchTerms.length < 1 ? data : searchTerms}
          labels={labels}
          onClick={handleClick}
        />
      }

      {permissionReady && (
        <div className={classes.exportWrapper}>
          <Button
            size="small"
            color="primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            Export Categories
          </Button>
          {isExporting && <CircularProgress size={24} />}
        </div>
      )}
    </NavDrawer>
  );
}

export default ManageCategoriesPage;
