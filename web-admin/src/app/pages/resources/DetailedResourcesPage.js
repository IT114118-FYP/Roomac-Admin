import {
    Box,
    Divider,
    Tab,
    Tabs,
    Typography,
    Button,
    makeStyles,
    Avatar,
    Grid,
    Select,
    MenuItem,
    Breadcrumbs,
    Link,
  } from "@material-ui/core";
  import { Skeleton } from "@material-ui/lab";
  import React, { useState, useEffect, useReducer } from "react";
  import { useHistory } from "react-router-dom";

  import Switch from "@material-ui/core/Switch";
  
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
      resizeMode: 'contain',
    },
    Gridheight:{
      marginTop: 20,
      height: 50,
    },
    confirmBox:{
      width: theme.spacing(30),
      height: theme.spacing(20),
    },
    confirmBoxText:{
      marginTop:theme.spacing(1),
    },
  }));
  
  function TabPanel({ children, value, index, ...other }) {
    return (
      <Box hidden={value !== index} {...other} marginTop={2}>
        {value === index && <div>{children}</div>}
      </Box>
    );
  }

  
  function DetailedResourcesPage({ match }) {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [resource, setResource] = useState({});
    const [category, setCategory] = useState({});
    const [branches, setBranches] = useState([]);
    
    const [userData, setUser] = useState([]);
    const [resourceBranch, setResourceBranch] = useState({});
    const [resourceCategory, setResourceCategory] = useState({});
    const [error, setError] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [imgMethod, setImgMethod] = useState("None");
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    const [tosList, setTosList] = useState([]);
    const [resourceTos, setResourceTos] = useState({});
    const { permissionReady, permissions, getPermission } = usePermission();
    const [selectedTosNumber, setselectedTosNumber] = useState([]);
    const [selectTosData, setselectTosData] = useState([]);
    const [tos,setTos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

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
          tos_id: name === "tos_id" ? value : resource.tos_id,
          category_id: name === "category_id" ? value:resource.category_id,
        })
        .then(() => {
          fetchAllData();
        })
        .catch((error) => {
          console.log(error.response);
        });
    };
  
    useEffect(() => {
      if(tos.length==0){
        return
      };
      const TosData = tos.find((data)=>data.id==selectedTosNumber);
      setselectTosData(TosData);
    }, [selectedTosNumber,tos]);

    useEffect(() => {
      fetchAllData();
    }, []);
  
    useEffect(() => {
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
        const [resourceData, branches , user, tosData, categoriesData] = await axios.all([
          fetchResource(),
          fetchBranches(),
          fetchUser(),
          fetchTos(),
          fetchCategories(),
        ]);
  
        // console.log(resourceData);
        setselectedTosNumber(resourceData.data.tos_id);
  
        var temp = [];
        user.data.forEach((data) => {
          temp.push({
            id: data.id,
            user_id: data.name,
          });
        });
        setUser(temp);
  
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

        const categoriesPickerItem = categoriesData.data.map((item) => {
          return createPickerValue(item.id, item.title_en);
        });
        setCategory(categoriesPickerItem);
        setResourceCategory(
          resourceData.data.category_id === null
            ? createPickerValue("none", "none")
            : categoriesData.data.find(
                (categoriy) => categoriy.id === resourceData.data.category_id
              )
        );
  
        setTos(tosData.data);
        const tosPickerItem = tosData.data.map((item) => {
          return createPickerValue(item.id, item.id);
        });
        setTosList(tosPickerItem);
  
        setResourceTos(
          resourceData.data.tos_id === null
            ? createPickerValue("none", "none")
            : tosData.data.find(
                (tos) => tos.id === resourceData.data.tos_id
              )
        );
  
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setError(true);
        setLoading(false);
      }
    };
  
    const fetchTos = () => 
      axiosInstance.get("api/tos");
  
    const fetchResource = () =>
      axiosInstance.get(`api/resources/${match.params.id}`);
  
    const fetchBranches = () => axiosInstance.get(`api/branches`);

    const fetchCategories = () => axiosInstance.get(`api/categories`);
  
    const fetchUser = () => axiosInstance.get(`api/users`);
  
    const delteResource = () => {
      axiosInstance.delete(`api/resources/${match.params.id}`).then(() => {
        history.push(`/resources`);
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
  
          <EditForm title="Terms and Conditions">
            {getPermission(
                            TAG.CRUD.UPDATE + TAG.routes.resources
                          ) && (
                          <div className={classes.Gridheight}>
          <Grid container spacing={1}>     
          <Grid item xs={3}>
            <Typography variant="body1" color="textPrimary">
                Select TOS Code
              </Typography>
              </Grid>
              <Grid item xs={7}>
          <Select
                disabled={isLoading}
                              id={tosList.id}
                              variant="outlined"
                              fullWidth
                              onChange={(event)=>setselectedTosNumber(event.target.value)
                              }
                              value={selectedTosNumber}
                style={{height:35}}
                          >
                              {tosList.map((item) => (
                                  <MenuItem value={item.id} key={item.id}>
                                      {item.value}
                                  </MenuItem>
                              ))}
                          </Select>
              </Grid>
              <Grid item xs={2}>
            <Button 
              disabled={isLoading||selectedTosNumber==resource.tos_id}
              variant="outlined"
              color="secondary"
              onClick={() => updateResource("tos_id", selectedTosNumber)}
            >
              Change Tos
            </Button>
            </Grid>
            </Grid>
                         
            </div>
            )}
            {getPermission(
                            TAG.CRUD.UPDATE + TAG.routes.resources
                          ) && (
            <Divider />)}
            {selectTosData ? 
            <EditField
              loading={isLoading}
              name="TOS_English"
              value={selectTosData.tos_en}
              editable={false
              } 
            />:<></>}
          </EditForm>
        </>
      );
    }
  
    function ViewCalendar() {
  
      const [old_startDate, setstartDate] = useState([]);
      const [bookings, setBookings] = useState([]);
      const [selectedBookings, setSelectedBookings] = useState([]);
  
      const fetchBookings = (arg) => {
  
        const startDate = moment(arg.view.activeStart).format("YYYY-MM-DD");
        const endDate = moment(arg.view.activeEnd).add(1,"day").format("YYYY-MM-DD");
    
        if (startDate === old_startDate){
          return;
        }
    
        setstartDate(startDate);
    
        axiosInstance.get(`api/resources/${match.params.id}/bookings_admin?start=${startDate}&end=${endDate}`).then((data)=>{
          let events = [];
          console.log(data.data);
          data.data.bookings.forEach((data) => {
            events.push({
              id: data.id,
              title: data.number + `\n` + (userData.find((user)=> user.id === data.user_id).user_id),
              start: data.start_time,
              end: data.end_time,
              color: `red`,
            });
          });
          setBookings(events);
        });
      }

      return (
        <Box flexDirection="column" display="flex" >
            <Button 
              style={{marginLeft:"auto"}}
              disabled={selectedBookings.length<1?true:false}
              variant="contained"
              color="primary"
              onClick={() => history.push({pathname:routes.bookings.NEW, data:selectedBookings})}
            >
              ADD Booking
            </Button>
            <Box style={{marginTop:10}} />
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
              select={(selectionInfo )=>{setSelectedBookings({date:moment(selectionInfo.startStr).format("YYYY-MM-DD"),start:moment(selectionInfo.startStr).format("HH:mm:ss"),end:moment(selectionInfo.endStr).format("HH:mm:ss"),resource_id:resource.id,resource:resource.number});
              console.log(selectedBookings)}}
              datesSet={(dateInfo)=>fetchBookings(dateInfo)}
              eventClick={function(arg){
                // alert(arg.event.id)
                history.push(`/bookings/${arg.event.id}`);
              }}
            />
          )}
        </Box>
      );
    }

    function LockResource() {
  
      const [old_startDate, setstartDate] = useState([]);
      const [lockData, setLockData] = useState([]);
      const [selectedBookings, setSelectedBookings] = useState([]);
      const [open, setOpen] = useState(false);
      const [isRepeat, setRepeat] = useState(false);
      const [removeLock, setrRemoveLock] = useState(false);
      const [removeLockID, setRemoveLockID] = useState([]);

      const handleClickOpen =()=> {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const LockResource = () => {
        console.log(selectedBookings.date,selectedBookings.start,selectedBookings.end,isRepeat,match.params.id);
        setLoading(true);
        axiosInstance
        .post(`api/reservations`, {
          date:selectedBookings.date,
          start:selectedBookings.start,
          end:selectedBookings.end,
          repeat:isRepeat,
          resource_id:match.params.id,
        })
      .then(() => {
        setRepeat(false);
        fetchLockStatus();
        setLoading(false);
      })
      .catch((error) => {
        setRepeat(false);
        setLoading(false);
      });

      };

      const RemoveLockResource = () => {
        axiosInstance.delete(`api/reservations/${removeLockID}`).then((data) => {
          setrRemoveLock(false);
          fetchLockStatus();
          // console.log(data)
        }).catch((e)=>console.log(e));
      }
  
      const fetchLockStatus = (arg) => {

        const startDate = moment(arg.view.activeStart).format("YYYY-MM-DD");
        const endDate = moment(arg.view.activeEnd).add(1,"day").format("YYYY-MM-DD");
    
        if (startDate === old_startDate){
          return;
        }
    
        setstartDate(startDate);

        axiosInstance.get(`api/resources/${match.params.id}/reservations?start=${startDate}&end=${endDate}`).then((data)=>{
          let temp = [];
          // console.log(data.data);
          data.data.forEach((data) => {
              if (data.repeat==1){
                temp.push({
                  id: data.id,
                  title: "Repeating Lock",
                  start: data.start_time,
                  end: data.end_time,
                  color: `gray`,
                });
              } else {
                temp.push({
                  id: data.id,
                  title: "One Time Lock",
                  start: data.start_time,
                  end: data.end_time,
                  color: `red`,
                });
              }
          });
          setLockData(temp);
        });

      };
      return (
        <Box flexDirection="column" display="flex" >
            <Button 
              style={{marginLeft:"auto"}}
              disabled={selectedBookings.length<1?true:false}
              variant="contained"
              color="secondary"
              onClick={()=>handleClickOpen()}
            >
              Lock
            </Button>
            <Box style={{marginTop:10}} />
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
              events={lockData}
              select={(selectionInfo)=>{setSelectedBookings({date:moment(selectionInfo.startStr).format("YYYY-MM-DD"),start:moment(selectionInfo.startStr).format("HH:mm:ss"),end:moment(selectionInfo.endStr).format("HH:mm:ss"),resource_id:resource.id,resource:resource.number});
              }}
              datesSet={(dateInfo)=>fetchLockStatus(dateInfo)}
              eventClick={(arg)=>{
                setRemoveLockID(arg.event.id);
                setrRemoveLock(true);
              }}
            />
          )}

          <ConfirmDialog
          open={open}
          onClose={() => handleClose(false)}
          onConfirm={() => LockResource()}
          title={`Lock Detail`}
        >
          <div className={classes.confirmBox}>
          <Typography>
          Resource: {selectedBookings.resource}
          </Typography>
          <Typography className={classes.confirmBoxText}>
          Date: {selectedBookings.date}
          </Typography>
          <Typography className={classes.confirmBoxText}>
          Start Time: {selectedBookings.start}
          </Typography>
          <Typography className={classes.confirmBoxText}>
          End Time: {selectedBookings.end}
          </Typography>
            Repeat:
          <Switch
              checked={isRepeat}
              onChange={()=>setRepeat(!isRepeat)}
              color="secondary"
          />
          </div>
        </ConfirmDialog>

        <ConfirmDialog
          open={removeLock}
          onClose={() => setrRemoveLock(false)}
          onConfirm={() => RemoveLockResource()}
          title={`Remove Lock`}
        >
          <div className={classes.confirmBox}>
          <Typography>
          Are you sure to remove the locking?
          </Typography>
          </div>
        </ConfirmDialog>
              
        </Box>
      );
    }
  
    function SettingsTabPanel() {
      return (
        <EditForm title="">
          {getPermission(TAG.CRUD.UPDATE + TAG.routes.resources) && (
          <div style={{height:50}}>
          <Grid container spacing={1}>     
        <Grid item xs={3}>
          <Typography variant="body1" color="textPrimary">
              Change Category
            </Typography>
            </Grid>
            <Grid item xs={7}>
        <Select
              disabled={isLoading}
							id={category.id}
							variant="outlined"
							fullWidth
							onChange={(event)=>setSelectedCategory(event.target.value)
							}
							value={selectedCategory.length<1?resourceCategory.id:selectedCategory}
              style={{height:35}}
						>
							{category.map((item) => (
								<MenuItem value={item.id} key={item.id}>
									{item.value}
								</MenuItem>
							))}
						</Select>
            </Grid>
            <Grid item xs={2} style={{display:"flex",marginLeft:"auto"}}>
              <div style={{display:"flex",marginLeft:"auto"}}>
          <Button 
            disabled={isLoading || selectedCategory.length<1?true:false || selectedCategory==resourceCategory.id}
            variant="outlined"
            color="secondary"
            display="flex"
            onClick={() => updateResource("category_id", selectedCategory)}
          >
            Change    
          </Button>
          </div>
          </Grid>
          </Grid>
          </div>
          )}

        {getPermission(TAG.CRUD.UPDATE + TAG.routes.resources) && (
          <Divider />)}

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
        </EditForm>
      );
    }

    function NoPermission() {
      return (
        <>No Permission</>
      );
    }

  
    return (
      <NavDrawer>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={routes.resources.MANAGE}>resource</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
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
                  {isLoading ? (
                    <Skeleton />
                  ) : resource.image_url == null ? (
                    resource.title_en.charAt(0)
                  ) : (
                    <img src={resource.image_url} className={classes.avatar} alt={resource.title_en} />
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
            {permissionReady &&(
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
                // onClick={()=>fetchBookings(0)}
              />
              <Tab
                label="LockResource"
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
            )}
            <TabPanel value={tabIndex} index={0}>
              <GeneralTabPanel />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
            {getPermission(
                            TAG.CRUD.READ + TAG.routes.bookings
                          ) ? <ViewCalendar />:<NoPermission />}
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
            {getPermission(
                            TAG.CRUD.UPDATE + TAG.routes.resources
                          ) ?
                          <LockResource />:<NoPermission />}
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
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
  
  export default DetailedResourcesPage;
  