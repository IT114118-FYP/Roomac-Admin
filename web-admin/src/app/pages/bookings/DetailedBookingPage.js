import {
    Box,
    Breadcrumbs,
    Divider,
    Tab,
    Tabs,
    Typography,
    Button,
  } from "@material-ui/core";
  import { Skeleton } from "@material-ui/lab";
  import React, { useState, useEffect } from "react";
  import { Link, useHistory } from "react-router-dom";
  
  import { axiosInstance } from "../../api/config";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import EditField from "../../components/forms/edit/EditField";
  import EditForm from "../../components/forms/edit/EditForm";
  import NavDrawer from "../../components/NavDrawer";
  import usePermission from "../../navigation/usePermission";
  import routes, { TAG } from "../../navigation/routes";
  import * as axios from "axios";
  import moment from "moment";
import CardView from "../../components/CardView";
  

//   ${match.params.id}
  function TabPanel({ children, value, index, ...other }) {
    return (
      <Box hidden={value !== index} {...other} marginTop={2}>
        {value === index && <div>{children}</div>}
      </Box>
    );
  }
  
  function DetailedBookingPage({ match }) {
    const history = useHistory();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { permissionReady, permissions, getPermission } = usePermission();
    const [resourceData, setResourceData] = useState([]);
    const [userData, setUser] = useState([]);
    const [data, setBookings] = useState([]);
  
    useEffect(() => {
        fetchAllData();
      }, []);

    const fetchUser = () => axiosInstance.get(`api/users`);

    const fetchResources = () => axiosInstance.get(`api/resources`);

    const fetchDashboard = () => axiosInstance.get("api/dashboard");

    const fetchAllData = async (silence = true) => {
        if (!silence) setLoading(true);
     try {
       const [user_data, resource_data , dashboard_data] = await axios.all([
            fetchUser(),
            fetchResources(),
            fetchDashboard(),
        ]);

        // console.log(user_data.data);
        var temp = [];
        user_data.data.forEach((data) => {
            temp.push({
            id: data.id,
            user_name: data.last_name + " " + data.first_name,
            user_id: data.name,
            });
        });
        setUser(temp);

        var temp2 = [];
        resource_data.data.forEach((data) => {
            temp2.push({
            id: data.id,
            branch_id: data.branch_id,
            resource_title: data.number === "" ? "null" : data.number,
            });
        });
        setResourceData(temp2);

        var temp3 = [];

        // console.log(dashboard_data.data.active_bookings);
        dashboard_data.data.active_bookings.forEach((data) => {
            temp3.push({
                id: data.id,
                branch_id:(temp2.find((resource)=> resource.id === data.resource_id).branch_id),
                resource_id: (temp2.find((resource)=> resource.id === data.resource_id).resource_title),
                user_id: (temp.find((user)=> user.id === data.user_id).user_id),
                user_name: (temp.find((user)=> user.id === data.user_id).user_name),
                number: data.number,
                date: moment(data.start_time).format("MM-DD-YYYY"),
                start_time: moment(data.start_time).format("HH:mm"),
                end_time: moment(data.end_time).format("HH:mm"),
                checkin_time: data.checkin_time == null ? "null": moment(data.checkin_time).format("HH:mm"),
            });
        });

        var booking_data = temp3.find((data)=>data.id == match.params.id)

        // console.log(booking_data);
        setBookings(booking_data);

        setLoading(false);
        } catch (error) {
        console.log(error.message);
        }
    };
  
    const deleteTos = () => {
    //   axiosInstance.delete(`api/tos/${match.params.id}`).then(() => {
    //     history.push(routes.tos.MANAGE);
    //   });
    };

    const check_in = () => {
        axiosInstance
        .post(`api/resourcebookings/${match.params.id}/checkin`);
        fetchAllData();
        history.push(`/bookings/${match.params.id}`);
    }
  
    function GeneralTabPanel() {
      return (

        <Box flexDirection="column" display="flex">
        <EditForm title="Resource info">
          <EditField
            loading={isLoading}
            name="Branch"
            value={data.branch_id}
            editable={false}
            // onSave={(newValue) => updateTos("tos_en", newValue)}
            // editable={
            //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
            // }
          />
          <Divider />
          <EditField
            loading={isLoading}
            name="Resource"
            value={data.resource_id}
            editable={false}
            // onSave={(newValue) => updateTos("tos_en", newValue)}
            // editable={
            //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
            // }
          />
          <Divider />
        </EditForm>
        <Divider />
        <EditForm title="Booking info">
            <EditField
                loading={isLoading}
                name="Reference No."
                value={data.number}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="Owner"
                value={data.user_name}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="CNA"
                value={data.user_id}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="Date"
                value={data.date}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="Start Time"
                value={data.start_time}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="End Time"
                value={data.end_time}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            <EditField
                loading={isLoading}
                name="Check-in Time"
                value={data.checkin_time}
                editable={false}
                // onSave={(newValue) => updateTos("tos_en", newValue)}
                // editable={
                //   getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
                // }
            />
            <Divider />
            </EditForm>
        </Box>
      );
    }
  
    function SettingsTabPanel() {
      return (
        <Box flexDirection="row" display="flex" marginTop={2}>
          {/* {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
            <Box flexGrow={1}>
              <Typography variant="body1" color="textPrimary">
                Delete tos
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Upon deletion, the tos will not be recoverable.
              </Typography>
            </Box>
          )}
          {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setDeleteOpen(true)}
            >
              Delete tos
            </Button>
          )} */}
        </Box>
      );
    }
  
    return (
      <NavDrawer>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={routes.HOME}>dashborad</Link>
          <Typography color="textPrimary">details</Typography>
        </Breadcrumbs>
        {error ? (
          <Box
            alignItems="center"
            justifyContent="center"
            display="flex"
            flexDirection="column"
          >
            <Typography variant="h6">Booking Not Found...</Typography>
            <Link to={routes.HOME}>go back</Link>
          </Box>
        ) : (
          <div>
            <Box marginBottom={2} marginTop={3}>
                <Box flexDirection="row" display="flex">
                    <Typography variant="h6" component="div" color="textSecondary">
                        {isLoading ? <Skeleton /> : `${data.number}`}
                    </Typography>
                    {data.checkin_time == "null" && (
                    <>
                        <Button color="primary" size="medium" Right={0} position="absolute" onClick={check_in}>
                        Check-in
                        </Button>
                    </>
                    )}
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
              <SettingsTabPanel />
            </TabPanel>
          </div>
        )}
        <ConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={deleteTos}
          title={`Cancel Bookings ${data.number}?`}
        >
          <Typography>Upon deletion, the tos will not be recoverable.</Typography>
        </ConfirmDialog>
      </NavDrawer>
    );
  }
  
  export default DetailedBookingPage;
  