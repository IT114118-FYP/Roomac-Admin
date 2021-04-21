import React, { useEffect, useState } from "react";
import {
  Divider,
  makeStyles,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import download from "downloadjs";
import { useHistory } from "react-router-dom";

import NavDrawer from "../../components/NavDrawer";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/resources";
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
    alignItems: "center",
  },
}));

function ManageResourcesPage(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isExporting, setExporting] = useState(false);
  const history = useHistory();
  const { permissionReady, permissions, getPermission } = usePermission();
  const [searchTerms, setSearchTerms] = useState([]);
  const [isImporting, setImporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axiosInstance.get("api/resources").then(({ data }) => {
      console.log(data)

      var temp3 = [];

      data.forEach((data) => {
        temp3.push({
          id:data.id!=null ? data.id : "1",
          branch_id: data.branch.title_en!=null ? data.branch.title_en:"-" ,
          category_id: data.category!=null ? data.category.title_en:"-",
          number: data.number!=null ? data.number:"-",
          title_en: data.title_en!=null ? data.title_en: "-",
          title_hk: data.title_hk!=null ? data.title_hk: "-",
          title_cn: data.title_cn!=null ? data.title_cn: "-",
        });
      });

      setData(temp3);
      setLoading(false);
    });
  };

  const handleClick = (event, itemID) => {
    history.push(`/resources/${itemID}`);
  };

  const handleAddNew = () => {
    history.push(routes.resources.NEW);
  };

  const handleExport = () => {
    setExporting(true);
    axiosInstance
      .get("/api/resources/export", {
        headers: "Content-type: application/vnd.ms-excel",
        responseType: "blob",
      })
      .then((response) => {
        download(
          new Blob([response.data]),
          "resources.xlsx",
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
            Resources
          </Typography>
          {getPermission(TAG.CRUD.CREATE + TAG.routes.resources) && (
            <Button color="primary" size="medium" onClick={handleAddNew}>
              Add new resources
            </Button>
          )}
        </div>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          View and manage resources with customisations
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <Grid container spacing={1}>
      <Grid item xs={9}>
      <Typography variant="h6" gutterBottom>
        View Resources
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

      {!isLoading && (
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
              Export Resources 
            </Button>
            {isExporting && <CircularProgress size={24} />}
          </div>
        )}
        </Grid>
        </Grid>
      )}
    </NavDrawer>
  );
}

export default ManageResourcesPage;
