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
  Box,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import download from "downloadjs";
import { useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/categories";
import { Skeleton } from "@material-ui/lab";
import routes from "../../navigation/routes";

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

function ManageCategoriesPage({ match }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchFilters, setSeacrhFilters] = React.useState([]);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [categoryData, cat] = await axios.all([
        fetchCategoryData(),
        fetchCategory(),
      ]);
      setData(categoryData.data);
      setCategory(cat.data.find((category) => category.id == match.params.id));
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError(true);
      setLoading(false);
    }
  };

  const fetchCategoryData = () =>
    axiosInstance.get(`api/categories/${match.params.id}`);

  const fetchCategory = () => axiosInstance.get(`api/categories`);

  const handleClick = (event, id) => {
    history.push(`/categories/resource/${id}`);
  };

  const handleAddNew = (event, id) => {
    history.push(`/categories/${match.params.id}/new`);
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
          "categories.xlsx",
          "application/vnd.ms-excel"
        );
        setExporting(false);
      });
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
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Something went wrong...</Typography>
        </Box>
      ) : (
        <>
          <div>
            <div className={classes.titleDiv}>
              <Typography
                variant="h3"
                color="textPrimary"
                className={classes.title}
              >
                {isLoading ? <Skeleton /> : category.title_en}
              </Typography>
              <Button color="primary" size="medium" onClick={handleAddNew}>
                Add new resources
              </Button>
            </div>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              View and manage resources with customisations
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <Typography variant="h6" gutterBottom>
            View Resources
          </Typography>
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
                Export categories
              </Button>
              {isExporting && <CircularProgress size={24} />}
            </div>
          )}
        </>
      )}
    </NavDrawer>
  );
}

export default ManageCategoriesPage;
