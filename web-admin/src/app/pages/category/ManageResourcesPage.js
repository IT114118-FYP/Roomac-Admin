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
  Avatar,
  Tab,
  Tabs,
  Grid,
} from "@material-ui/core";
import EditForm from "../../components/forms/edit/EditForm";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import EditField from "../../components/forms/edit/EditField";
import download from "downloadjs";
import { useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/resources";
import { Skeleton } from "@material-ui/lab";

import Badge from "@material-ui/core/Badge";
import editpen from "../../resources/edit.png";
import { withStyles } from "@material-ui/core/styles";
import ConfirmDialog from "../../components/ConfirmDialog";

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
    marginLeft: theme.spacing(2),
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
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    resizeMode: 'contain',
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box hidden={value !== index} {...other} marginTop={2}>
      {value === index && <div>{children}</div>}
    </Box>
  );
}

function ManageResourcesPage({ match }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const history = useHistory();
  const [imgMethod, setImgMethod] = useState("None");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { permissionReady, permissions, getPermission } = usePermission();
  const [searchTerms, setSearchTerms] = useState([]);

  useEffect(() => {
    fetchAllData();
    setImgMethod("Upload Image File");
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    updateCategories("image", e.target.files[0]);
  };

  const delteCategory = () => {
    axiosInstance
      .delete(`api/categories/${match.params.id}`)
      .then(() => history.push(`/categories`));
  };

  const fetchAllData = async (silence = true) => {
    if (!silence) setLoading(true);
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

  const updateCategories = (name, value) => {
    setLoading(true);

    if (name === "image") {
      let formData = new FormData();
      formData.set("image", value);
      formData.append("_method", "PATCH");

      axiosInstance
        .post(`api/categories/${match.params.id}`, formData)
        .then(() => {
          setPreview(undefined);
          fetchAllData();
        })
        .catch((error) => {
          console.log(error.response);
        });

      return;
    }

    axiosInstance
      .put(`api/categories/${match.params.id}`, {
        title_en: name === "title_en" ? value : category.title_en,
        title_hk: name === "title_hk" ? value : category.title_hk,
        title_cn: name === "title_cn" ? value : category.title_cn,
      })
      .then(() => {
        fetchAllData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 40,
      height: 40,
      border: `2px solid ${theme.palette.background.paper}`,
    },
  }))(Avatar);

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
    console.log(value);
    if (value !== ""){
      const newList = data.filter((contact)=>{

        var key = Object.keys(contact).map(function(key) {
          return contact[key];
      });
        return key.join(" ").toLowerCase().includes(value.toLowerCase());
      })

      // setSearchTerms(newList);

    }  else {
      // setSearchTerms(value);
    }
  };

  function GeneralTabPanel() {
    return (
      <>
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
          <div className={classes.exportWrapper}>
            <Button
              size="small"
              color="primary"
              onClick={handleExport}
              disabled={isExporting}
            >
              Export resources
            </Button>
            {isExporting && <CircularProgress size={24} />}
          </div>
        )}
      </>
    );
  }
  function ChangeNameTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        <Box flexGrow={1}>
          {isLoading ? (
            <Skeleton />
          ) : (
            <EditForm title="Category Info">
              <EditField
                value={category.title_en}
                name="English"
                onSave={(newValue) => updateCategories("title_en", newValue)}
                editable={
                  getPermission(TAG.CRUD.UPDATE + TAG.routes.categories)
                    ? true
                    : false
                }
              />
              <Divider />
              <EditField
                value={category.title_hk}
                name="Chinese (traditional)"
                onSave={(newValue) => updateCategories("title_hk", newValue)}
                editable={
                  getPermission(TAG.CRUD.UPDATE + TAG.routes.categories)
                    ? true
                    : false
                }
              />
              <Divider />
              <EditField
                value={category.title_cn}
                name="Chinese (simplified)"
                onSave={(newValue) => updateCategories("title_cn", newValue)}
                editable={
                  getPermission(TAG.CRUD.UPDATE + TAG.routes.categories)
                    ? true
                    : false
                }
              />
            </EditForm>
          )}
        </Box>
      </Box>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.categories) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete Category
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the category will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.categories) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Category
          </Button>
        )}
      </Box>
    );
  }

  return (
    <NavDrawer>
      {error ? (
        <Box
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
              {/* <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                marginTop={3}
              > */}
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  imgMethod === "Upload Image File" && (
                    <>
                      <div>
                        <input
                          accept="image/*"
                          id="image"
                          type="file"
                          style={{
                            display: "none",
                          }}
                          onChange={onSelectFile}
                        />
                        <label htmlFor="image">
                          {getPermission(
                            TAG.CRUD.UPDATE + TAG.routes.categories
                          ) && (
                            <Button
                              // variant="contained"
                              color="primary"
                              component="span"
                            >
                              <SmallAvatar alt="Edit image" src={editpen} />
                            </Button>
                          )}
                        </label>
                      </div>
                    </>
                  )
                }
              >
                <Avatar className={classes.avatar}>
                  ;
                  {isLoading ? (
                    <Skeleton />
                  ) : category.image_url == null ? (
                    category.title_en.charAt(0)
                  ) : (
                    <img src={category.image_url} className={classes.avatar} alt={category.title_en} />
                  )}
                </Avatar>
              </Badge>
              <Typography
                variant="h3"
                color="textPrimary"
                className={classes.title}
              >
                {isLoading ? <Skeleton /> : category.title_en}
              </Typography>

              {permissionReady &&
                getPermission(TAG.CRUD.CREATE + TAG.routes.resources) && (
                  <Button color="primary" size="medium" onClick={handleAddNew}>
                    Add new resources
                  </Button>
                )}
            </div>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              View and manage resources with customisations
            </Typography>
          </div>
          <Tabs
            value={tabIndex}
            onChange={(event, newValue) => {
              setTabIndex(newValue);
            }}
          >
            <Tab
              label="General"
              style={{
                outline: "none",
              }}
            />
            <Tab
              label="Change Name"
              style={{
                outline: "none",
              }}
            />
            <Tab
              label="Settings"
              style={{
                outline: "none",
              }}
            />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <GeneralTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ChangeNameTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <SettingsTabPanel />
          </TabPanel>

          <ConfirmDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={delteCategory}
            // title={`Delete Category ${category.id}?`}
          >
            <Typography>
              Upon deletion, the category will not be recoverable.
            </Typography>
          </ConfirmDialog>
        </>
      )}
    </NavDrawer>
  );
}

export default ManageResourcesPage;
