import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Divider,
  makeStyles,
  Typography,
  Button,
  Link,
  Box,
  Avatar,
  Tab,
  Tabs,
} from "@material-ui/core";
import EditForm from "../../components/forms/edit/EditForm";
import EditField from "../../components/forms/edit/EditField";
import { useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
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

function DetailedCategoryPage({ match }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const history = useHistory();
  const [imgMethod, setImgMethod] = useState("None");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { permissionReady, getPermission } = usePermission();

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

  const deleteCategory = () => {
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


  function GeneralTabPanel() {
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
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.categories.MANAGE}>categories</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Category Not Found...</Typography>
          <Link to={routes.categories.MANAGE}>go back</Link>
        </Box>
      ) : (
        <div>
          <Box
            display="flex"
            alignItems="center"
            marginBottom={2}
            marginTop={3}
          >
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

            <Box marginLeft={3} flexGrow={1}>
              <Typography
                variant="h5"
                component="div"
                style={{
                  fontWeight: "bold",
                }}
              >
                {isLoading ? <Skeleton /> : `${category.title_en}`}
              </Typography>
            </Box>
          </Box>
          {permissionReady && (
            <>
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
                  label="Settings"
                  style={{
                    outline: "none",
                  }}
                />
              </Tabs>
            </>
          )}
          <TabPanel value={tabIndex} index={0}>
            <GeneralTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <SettingsTabPanel onDeleteUser={() => setDeleteOpen(true)} />
          </TabPanel>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteCategory}
        title={`Delete Category?`}
      >
        <Typography>
          Upon deletion, the category will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedCategoryPage;
