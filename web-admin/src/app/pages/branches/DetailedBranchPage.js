import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";

import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import * as axios from "axios";

import { axiosInstance } from "../../api/config";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";
import DataTable from "../../components/DataTable";
import { labels } from "../../config/tables/rulesConfig";
import { toss } from "../../config/tables/tos";
import ConfirmDialog from "../../components/ConfirmDialog";
import editpen from "../../resources/edit.png";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  titleDiv: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box hidden={value !== index} {...other} marginTop={2}>
      {value === index && <div>{children}</div>}
    </Box>
  );
}

function DetailedBranchPage({ match }) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [branch, setBranch] = useState({});
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [imgMethod, setImgMethod] = useState("None");

  const classes = useStyles();

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

  const fetchAllData = async (silence = true) => {
    if (!silence) setLoading(true);
    try {
      const [branch, settings] = await axios.all([
        fetchBranch(),
        fetchSettings(),
      ]);
      setBranch(branch.data);
      setSettings(settings.data.versions);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError(true);
      setLoading(false);
    }
  };

  const fetchBranch = () =>
    axiosInstance.get(`api/branches/${match.params.id}`);

  const fetchSettings = () =>
    axiosInstance.get(`api/branches/${match.params.id}/settings`);

  const updateBranch = (name, value) => {
    setLoading(true);

    // Update image
    if (name === "image") {
      let formData = new FormData();
      formData.set("image", value);
      formData.append("_method", "PATCH");

      axiosInstance
        .post(`api/branches/${match.params.id}`, formData)
        .then(() => {
          setPreview(undefined);
          fetchAllData();
        })
        .catch((error) => {
          console.log(error.response);
        });

      return;
    }

    // Update normal fields
    let data = {};
    data[name] = value;

    axiosInstance
      .put(`api/branches/${match.params.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => fetchAllData())
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleSettingClick = () => {};

  const deleteBranch = () => {
    axiosInstance.delete(`api/branches/${match.params.id}`).then(() => {
      history.push(routes.branches.MANAGE);
    });
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    updateBranch("image", e.target.files[0]);
  };

  function GeneralTabPanel() {
    return (
      <>
        <EditForm title="Branch info">
          <EditField
            loading={isLoading}
            name="Branch ID"
            value={branch.id}
            onSave={(newValue) => updateBranch("id", newValue)}
            editable={false}
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="English"
            value={branch.title_en}
            onSave={(newValue) => updateBranch("title_en", newValue)}
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Chinese (traditional)"
            value={branch.title_hk}
            onSave={(newValue) => updateBranch("title_hk", newValue)}
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Chinese (simplified)"
            value={branch.title_cn}
            onSave={(newValue) => updateBranch("title_cn", newValue)}
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Lat"
            value={branch.lat}
            onSave={(newValue) => updateBranch("lat", newValue)}
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Lng"
            value={branch.lng}
            onSave={(newValue) => updateBranch("lng", newValue)}
          />
        </EditForm>

        <Box marginBottom={2} marginTop={3} display="flex">
          <Typography
            variant="h6"
            component="div"
            style={{
              flexGrow: 1,
            }}
          >
            Branch Settings / Rules Configuration
          </Typography>
          <Button
            color="primary"
            size="small"
            // onClick={handleAddNew}
          >
            Add new rules configurations
          </Button>
        </Box>
        <DataTable
          loading={isLoading}
          data={settings}
          labels={labels}
          onClick={handleSettingClick}
        />
      </>
    );
  }

  function TeamsAndConditions() {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = () => {
      setLoading(true);
      axiosInstance.get("api/tos").then(({ data }) => {
        setData(data);
        setLoading(false);
      });
    };

    const handleClick = (event, itemID) => {
      history.push(`/tos/${itemID}`);
    };

    const handleAddNew = () => {
      history.push(routes.tos.NEW);
    };

    return (
      <>
        <Box>
          <DataTable
            loading={isLoading}
            data={data}
            labels={toss}
            onClick={handleClick}
          />
        </Box>
        <div style={{ float: "right" }}>
          <Button color="primary" size="medium" onClick={handleAddNew}>
            Add new Terms And Conditions
          </Button>
        </div>
      </>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        <Box flexGrow={1}>
          <Typography variant="body1" color="textPrimary">
            Delete Branch
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Upon deletion, the branch will not be recoverable.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Branch
        </Button>
      </Box>
    );
  }

  return (
    <NavDrawer>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.branches.MANAGE}>branches</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Branch Not Found...</Typography>
          <Link to={routes.branches.MANAGE}>go back</Link>
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
                        <Button
                          // variant="contained"
                          color="primary"
                          component="span"
                        >
                          <SmallAvatar alt="Edit image" src={editpen} />
                        </Button>
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
                ) : branch.image_url == null ? (
                  branch.title_en.charAt(0)
                ) : (
                  <img src={branch.image_url} alt={branch.title_en} />
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
                {isLoading ? <Skeleton /> : `${branch.title_en}`}
              </Typography>
            </Box>
          </Box>
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
              label="Teams And Conditions"
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
            <TeamsAndConditions />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <SettingsTabPanel onDeleteUser={() => setDeleteOpen(true)} />
          </TabPanel>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteBranch}
        title={`Delete Branch ${branch.id}?`}
      >
        <Typography>
          Upon deletion, the branch will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedBranchPage;
