import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Avatar,
  makeStyles,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Breadcrumbs,
  Divider,
  Button,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { Skeleton } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../../components/NavDrawer";
import { axiosInstance } from "../../api/config";
import usePermission from "../../navigation/usePermission";
import routes, { TAG } from "../../navigation/routes";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import EditPickerField, {
  createPickerValue,
} from "../../components/forms/edit/EditPickerField";
import NewPickerField, {
  createNewPickerValue,
} from "../../components/forms/new/NewPickerField";
import ConfirmDialog from "../../components/ConfirmDialog";

import Badge from "@material-ui/core/Badge";
import editpen from "../../resources/edit.png";

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box hidden={value !== index} {...other} marginTop={2}>
      {value === index && <div>{children}</div>}
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    resizeMode: 'contain',
  },
  select: {
    marginLeft: theme.spacing(3),
    height: theme.spacing(5),
    position: "center",
  },
  title_ban: {
    marginRight: theme.spacing(25),
  },
}));

function DetailedUserPage({ match }) {
  const classes = useStyles();
  const history = useHistory();

  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userBranch, setUserBranch] = useState({});
  const [branches, setBranches] = useState([]);
  const [userProgram, setUserProgram] = useState({});
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgMethod, setImgMethod] = useState("None");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [banTimeList, setBanTimeList] = useState([]);
  const [banTime, setBanTime] = useState([]);
  const [banTimeData, setBanTimeData] = useState([]);
  const { permissionReady, getPermission } = usePermission();
  const [success, setSuccess] = useState(true);
  const [banStatus, setBanStatus] = useState(false);

  useEffect(() => {
    creatBanTimeList();

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

  useEffect(() => {
    fetchAllData();
  }, [banStatus,banTime]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    updateUser("image", e.target.files[0]);
  };

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 40,
      height: 40,
      border: `2px solid ${theme.palette.background.paper}`,
    },
  }))(Avatar);

  const creatBanTimeList = () =>{
    const data = [{id:15,value:"15mins"},{id:60,value:"1hour"},{id:180,value:"3hours"},{id:1440,value:"1day"},{id:4320,value:"3days"}];
    const banPickerItem = data.map((item) => {
      return createNewPickerValue(item.id, item.value);
    });
    setBanTimeList(banPickerItem);
  }

  const fetchAllData = async (silence = true) => {
    if (!silence) setLoading(true);
    try {
      const [userData, userPermissions, branches, programs, ban] = await axios.all([
        fetchUser(),
        fetchPermissions(),
        fetchBranches(),
        fetchPrograms(),
        fetchBanTime(),
      ]);
      // console.log(ban.data.expire_time);
      setBanTimeData(ban.data.expire_time);
      setUser(userData.data);
      setPermissions(userPermissions.data);

      const branchesPickerItem = branches.data.map((item) => {
        return createPickerValue(item.id, item.title_en);
      });
      branchesPickerItem.unshift(createPickerValue("none", "none"));
      setBranches(branchesPickerItem);
      setUserBranch(
        userData.data.branch_id === null
          ? createPickerValue("none", "none")
          : branches.data.find(
              (branch) => branch.id === userData.data.branch_id
            )
      );

      const programsPickerItem = programs.data.map((item) => {
        return createPickerValue(item.id, item.title_en);
      });
      programsPickerItem.unshift(createPickerValue("none", "none"));
      setPrograms(programsPickerItem);
      setUserProgram(
        userData.data.program_id === null
          ? createPickerValue("none", "none")
          : programs.data.find(
              (program) => program.id === userData.data.program_id
            )
      );
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setError(true);
      setLoading(false);
    }
  };
  const updatePermission = (event, index) => {
    const temp = [...permissions];

    temp[index].granted = event.target.checked;
    setPermissions(temp);
    let data = [];
    data[0] = {
      name: event.target.name,
      granted: event.target.checked,
    };

    axiosInstance
      .put(`api/users/${match.params.id}/permissions`, data)
      .then(({ data }) => {
        console.log("done");
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => console.log(permissions));
  };

  const fetchUser = () => axiosInstance.get(`api/users/${match.params.id}`);
  const fetchBranches = () => axiosInstance.get(`api/branches`);
  const fetchPrograms = () => axiosInstance.get(`api/programs`);
  const fetchPermissions = () =>
    axiosInstance.get(`api/users/${match.params.id}/permissions`);

  const fetchBanTime = () => axiosInstance.get(`api/users/${match.params.id}/bans`);

  const updateUser = (name, value) => {
    setLoading(true);

    console.log(name+"/"+value)

    // Update image
    if (name === "image") {
      let formData = new FormData();
      formData.set("image", value);
      formData.append("_method", "PATCH");

      axiosInstance
        .post(`api/users/${match.params.id}`, formData)
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
      .put(`api/users/${match.params.id}`, {
        branch_id:
          name === "branch_id"
            ? value === "none"
              ? null
              : value
            : user.branch_id,
        chinese_name: name === "chinese_name" ? value : user.chinese_name,
        email: name === "email" ? value : user.email,
        first_name: name === "first_name" ? value : user.first_name,
        last_name: name === "last_name" ? value : user.last_name,
        name: name === "name" ? value : user.name,
        program_id:
          name === "program_id"
            ? value === "none"
              ? null
              : value
            : user.program_id,
        image_url: name === "image_url" ? value : user.image_url,
        password: name === "password" ? value : value,
      })
      .then(() => {
        fetchAllData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = () => {
    axiosInstance.delete(`api/users/${match.params.id}`).then(() => {
      history.push(routes.users.MANAGE);
    });
  };

  const banUser = () => {
    setLoading(true);
    axiosInstance
    .post(`api/userbans`, {
      user_id : match.params.id,
      ban_minutes : banTime,
    }).then((data)=>{console.log(data);
      setBanStatus(!banStatus);
    })
  }
  
  const unbanUser = () => {
    setLoading(true);
    axiosInstance
    .delete(`api/users/${match.params.id}/unban`).then((data)=>{console.log(data);
      setBanStatus(!banStatus);
    })
  }

  function GeneralTabPanel() {
    return (
      <>
        <EditForm title="Basic info">
          <EditField
            loading={isLoading}
            name="FIRST NAME"
            value={user.first_name}
            onSave={(newValue) => updateUser("first_name", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="LAST NAME"
            value={user.last_name}
            onSave={(newValue) => updateUser("last_name", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="CHINESE NAME"
            value={user.chinese_name}
            onSave={(newValue) => updateUser("chinese_name", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="CNA"
            value={user.name}
            onSave={(newValue) => updateUser("name", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
          <Divider />
          {getPermission(TAG.CRUD.UPDATE + TAG.routes.users) &&
          <EditField
            loading={isLoading}
            name="Change Password"
            onSave={(newValue) => updateUser("password", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
          }
        
        </EditForm>
        <EditForm title="Association Info">
          <EditPickerField
            loading={isLoading}
            name="BRANCH"
            value={userBranch.id}
            onSave={(newValue) => updateUser("branch_id", newValue)}
            picker
            pickerItem={branches}
          />
          <Divider />
          <EditPickerField
            loading={isLoading}
            name="Programme"
            value={userProgram.id}
            onSave={(newValue) => updateUser("program_id", newValue)}
            pickerItem={programs}
          />
        </EditForm>
        <EditForm title="Contact Info">
          <EditField
            loading={isLoading}
            name="EMAIL"
            value={user.email}
            onSave={(newValue) => updateUser("email", newValue)}
            editable={
              getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ? true : false
            }
          />
        </EditForm>
        {getPermission(TAG.CRUD.UPDATE + TAG.routes.users) ?
        isLoading ? <></> :
        banTimeData != null ? <EditForm title="Status" >
        <Grid container spacing={1}>     
        <Grid item xs={3}>
          <Typography variant="body1" color="textPrimary">
            Banning Time
            </Typography>
            </Grid>
            <Grid item xs={7}>
                {banTimeData}
            </Grid>
            <Grid item xs={2}>
          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => unbanUser()}
          >
            UnBan User
          </Button>
          </Grid>
          </Grid>
        </EditForm>:
        <EditForm title="Status" >
        <Grid container spacing={1}>     
        <Grid item xs={3}>
          <Typography variant="body1" color="textPrimary">
              Ban User
            </Typography>
            </Grid>
            <Grid item xs={7}>
        <Select
        disabled={isLoading}
							id={banTimeList.id}
							variant="outlined"
							fullWidth
							onChange={(event)=>setBanTime(event.target.value)
							}
							value={banTime}
              style={{height:35}}
						>
							{banTimeList.map((item) => (
								<MenuItem value={item.id} key={item.id}>
									{item.value}
								</MenuItem>
							))}
						</Select>
            </Grid>
            <Grid item xs={2}>
          <Button 
            disabled={banTime.length<1?true:false}
            variant="outlined"
            color="secondary"
            onClick={() => banUser()}
          >
            Ban User
          </Button>
          </Grid>
          </Grid>
        </EditForm>
  : <></>}
      </>
        
    );
  }

  function PermissionsTabPanel() {
    return (
      <>
        <Box marginBottom={2}>
          <Typography variant="body1" color="textSecondary">
            Permissions are assigned to users and admins for different purposes.
            Permissions enables users or admin to access or edit data
            information.
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Permissions</TableCell>
                <TableCell align="left">Granted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {permission.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      color: permission.granted ? "#4c4" : "#c11",
                    }}
                  >
                    <Switch
                      checked={permission.granted}
                      onChange={(event) => updatePermission(event, index)}
                      color="secondary"
                      name={permission.name}
                      inputProps={{ "aria-label": permission.name }}
                    />
                    {/* {permission.granted ? <DoneIcon /> : <ClearIcon />} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.users) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete User Account
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the account will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.users) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete User
          </Button>
        )}
      </Box>
    );
  }

  return (
    <NavDrawer>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.users.MANAGE}>users</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Something went wrong...</Typography>
          <Link to={routes.users.MANAGE}>go back</Link>
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
                        {getPermission(TAG.CRUD.UPDATE + TAG.routes.users) && (
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
                {isLoading ? (
                  <Skeleton />
                ) : user.image_url == null ? (
                    user.last_name.charAt(0)
                ) : (
                  <img src={user.image_url} className={classes.avatar} alt="new" />
                )}
              </Avatar>
            </Badge>
            <Box marginLeft={3} flexGrow={1}>
              <Typography variant="h5" component="div">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  `${user.first_name}, ${user.last_name}`
                )}
              </Typography>
            </Box>
          </Box>
          {permissionReady && (
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
              {(getPermission(TAG.CRUD.GRANT + TAG.routes.permissions) ||
                getPermission(TAG.CRUD.REVOKE + TAG.routes.permissions)) && (
                <Tab
                  label="Permissions"
                  style={{
                    outline: "none",
                  }}
                />
              )}
              <Tab
                label="Settings"
                style={{
                  outline: "none",
                }}
              />
            </Tabs>
          )}
          <TabPanel value={tabIndex} index={0}>
            <GeneralTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <PermissionsTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <SettingsTabPanel />
          </TabPanel>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteUser}
        title={`Delete User ${user.name}?`}
      >
        <Typography>
          Upon deletion, the account will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedUserPage;
