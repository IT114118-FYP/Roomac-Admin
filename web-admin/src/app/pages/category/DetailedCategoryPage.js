import {
  Box,
  Divider,
  Tab,
  Tabs,
  Typography,
  Button,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import EditSliderField from "../../components/forms/edit/EditSliderField";
import * as axios from "axios";
import NavDrawer from "../../components/NavDrawer";
import EditPickerField, {
  createPickerValue,
} from "../../components/forms/edit/EditPickerField";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import usePermission from "../../navigation/usePermission";
import routes, { TAG } from "../../navigation/routes";

import moment from "moment";

import Badge from "@material-ui/core/Badge";
import editpen from "../../resources/edit.png";
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
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
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [resource, setResource] = useState({});
  const [branches, setBranches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [resourceBranch, setResourceBranch] = useState({});
  const [error, setError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgMethod, setImgMethod] = useState("None");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const { permissionReady, permissions, getPermission } = usePermission();

  const classes = useStyles();

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    updateResource("image", e.target.files[0]);
  };

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 40,
      height: 40,
      border: `2px solid ${theme.palette.background.paper}`,
    },
  }))(Avatar);

  const updateResource = (name, value) => {
    setLoading(true);

    if (name === "image") {
      let formData = new FormData();
      formData.set("image", value);
      formData.append("_method", "PATCH");

      axiosInstance
        .post(`api/resources/${match.params.id}`, formData)
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
      .put(`api/resources/${match.params.id}`, {
        number: name === "number" ? value : resource.number,
        title_en: name === "title_en" ? value : resource.title_en,
        title_hk: name === "title_hk" ? value : resource.title_hk,
        title_cn: name === "title_cn" ? value : resource.title_cn,
        branch_id: name === "branch_id" ? value : resource.branch_id,
        opening_time: name === "opening_time" ? value : resource.opening_time,
        closing_time: name === "closing_time" ? value : resource.closing_time,
        min_user: name === "opacity" ? value[0] : resource.min_user,
        max_user: name === "opacity" ? value[1] : resource.max_user,
        interval: name === "interval" ? value : resource.interval,
      })
      .then(() => {
        fetchAllData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      const [resourceData, branches] = await axios.all([
        fetchResource(),
        fetchBranches(),
      ]);
      // console.log(resourceData.data);
      setResource(resourceData.data);
      setBranches(branches.data);

      const branchesPickerItem = branches.data.map((item) => {
        return createPickerValue(item.id, item.title_en);
      });
      branchesPickerItem.unshift(createPickerValue("none", "none"));
      setBranches(branchesPickerItem);
      setResourceBranch(
        resourceData.data.branch_id === null
          ? createPickerValue("none", "none")
          : branches.data.find(
              (branch) => branch.id === resourceData.data.branch_id
            )
      );

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError(true);
      setLoading(false);
    }
  };

  const fetchResource = () =>
    axiosInstance.get(`api/resources/${match.params.id}`);

  const fetchBranches = () => axiosInstance.get(`api/branches`);

  const fetchBookings = () => {
    setLoading(true);
    const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
    const endDate = moment().add(7, "days").format("YYYY-MM-DD");
    axiosInstance
      .get(
        `/api/resources/${match.params.id}/bookings?start=${startDate}&end=${endDate}`
      )
      .then(({ data }) => {
        console.log(data);
        let events = [];
        for (let i in data.allow_times) {
          let allow_time = data.allow_times[i];
          for (let date in allow_time) {
            let times = allow_time[date];
            for (let j in times) {
              if (times[j].available) {
                continue;
              }
              events.push({
                id: times[j].id,
                title: `Unavailable`,
                start: date + "T" + times[j].start_time,
                end: date + "T" + times[j].end_time,
                color: `red`,
              });
            }
          }
        }

        setBookings(events);
      })
      .finally(() => setLoading(false));
  };

  const delteResource = () => {
    axiosInstance.delete(`api/resources/${match.params.id}`).then(() => {
      history.push(`/categories`);
    });
  };

  function GeneralTabPanel() {
    return (
      <>
        <EditForm title="Resource Basic info">
          <EditField
            loading={isLoading}
            name="Number"
            value={resource.number}
            onSave={(newValue) => updateResource("number", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="English"
            value={resource.title_en}
            onSave={(newValue) => updateResource("title_en", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Chinese (traditional)"
            value={resource.title_hk}
            onSave={(newValue) => updateResource("title_hk", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Chinese (simplified)"
            value={resource.title_cn}
            onSave={(newValue) => updateResource("title_cn", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditPickerField
            editable={false}
            loading={isLoading}
            name="Branch"
            value={resourceBranch.id}
            onSave={(newValue) => updateResource("branch_id", newValue)}
            picker
            pickerItem={branches}
          />
        </EditForm>
        <EditForm title="Resource Details">
          <EditField
            loading={isLoading}
            type="time"
            name="Opening Time"
            value={resource.opening_time}
            onSave={(newValue) => updateResource("opening_time", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            type="time"
            name="Closing Time"
            value={resource.closing_time}
            onSave={(newValue) => updateResource("closing_time", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditSliderField
            loading={isLoading}
            name="Opacity"
            value={[resource.min_user, resource.max_user]}
            onSave={(newValue) => updateResource("opacity", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Interval"
            value={resource.interval}
            onSave={(newValue) => updateResource("interval", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.resources)
                ? true
                : false
            }
          />
        </EditForm>
      </>
    );
  }

  function ViewCalendar() {
    return (
      <Box>
        {isLoading ? (
          <Skeleton />
        ) : (
          <FullCalendar
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            selectable={true}
            allDaySlot={false}
            nowIndicator={true}
            contentHeight="auto"
            slotMinTime={resource.opening_time}
            slotMaxTime={resource.closing_time}
            events={bookings}
          />
        )}
      </Box>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.resources) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete resource
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the resource will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.resources) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Resource
          </Button>
        )}
      </Box>
    );
  }

  return (
    <NavDrawer>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Resource Not Found...</Typography>
        </Box>
      ) : (
        <div>
          <Box
            marginBottom={2}
            marginTop={3}
            display="flex"
            flexDirection="row"
          >
            {/* {isLoading ? (
              <Skeleton variant="rect" width={200} height={150} />
            ) : (
              <img
                src={resource.image_url}
                alt="room"
                style={{
                  maxHeight: 150,
                }}
              />
            )} */}

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
                          TAG.CRUD.UPDATE + TAG.routes.resources
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
                ) : resource.image_url == null ? (
                  resource.title_en.charAt(0)
                ) : (
                  <img src={resource.image_url} alt={resource.title_en} />
                )}
              </Avatar>
            </Badge>

            <Box flexGrow={1} marginLeft={2}>
              <Typography
                variant="h5"
                component="div"
                style={{
                  fontWeight: "bold",
                }}
              >
                {isLoading ? <Skeleton /> : `${resource.number}`}
              </Typography>
              <Typography variant="h6" component="div" color="textSecondary">
                {isLoading ? <Skeleton /> : `${resource.title_en}`}
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
              label="Timetable"
              style={{
                outline: "none",
              }}
              onClick={fetchBookings}
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
            <ViewCalendar />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <SettingsTabPanel />
          </TabPanel>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={delteResource}
        title={`Delete Resource ${resource.id}?`}
      >
        <Typography>
          Upon deletion, the resource will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedCategoryPage;
