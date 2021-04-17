import {
  Box,
  Breadcrumbs,
  Divider,
  Tab,
  Tabs,
  Typography,
  Button,
  Grid,
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
  const [checin,setCheckin] = useState(false);

  useEffect(() => {
      fetchAllData();
    }, []);

    useEffect(() => {
      fetchAllData();
    }, [checin]);

  const fetchUser = () => axiosInstance.get(`api/users`);

  const fetchResources = () => axiosInstance.get(`api/resources`);
  
  const fetchDashboard = () => axiosInstance.get(`api/resourcebookings/${match.params.id}`);

  const fetchAllData = async (silence = true) => {
      if (!silence) setLoading(true);
   try {
     const [user_data, resource_data , dashboard_data] = await axios.all([
          fetchUser(),
          fetchResources(),
          fetchDashboard(),
      ]);

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
          resource_title: data.number === "" ? "-" : data.number,
          });
      });
      setResourceData(temp2);

      var temp3 = [];
      var booking_detail = dashboard_data.data;

      console.log(booking_detail);
      temp3.push({
        id: booking_detail.id,
        branch_id:(temp2.find((resource)=> resource.id === booking_detail.resource_id).branch_id),
        resource_id: (temp2.find((resource)=> resource.id === booking_detail.resource_id).resource_title),
        user_id: (temp.find((user)=> user.id === booking_detail.user_id).user_id),
        user_name: (temp.find((user)=> user.id === booking_detail.user_id).user_name),
        number: booking_detail.number,
        date: moment(booking_detail.start_time).format("YYYY-MM-DD"),
        start_time: moment(booking_detail.start_time).format("HH:mm:ss"),
        end_time: moment(booking_detail.end_time).format("HH:mm:ss"),
        checkin_time: booking_detail.checkin_time == null ? "-": moment(booking_detail.checkin_time).format("HH:mm"),
      });

      var booking_data = temp3.find((data)=>data.id == match.params.id)

      // console.log(temp3);
      setBookings(booking_data);
      setLoading(false);
      } catch (error) {
      console.log(error.message);
      }
  };

  const deleteBooking = () => {
    axiosInstance.delete(`api/resourcebookings/${match.params.id}`).then(() => {
      history.push(routes.HOME);
    });
  };

  const check_in = () => {
    setLoading(true);
      axiosInstance
      .post(`api/resourcebookings/${match.params.id}/checkin`).then((data)=>{
        setCheckin(true);
      // fetchAllData();
      // window.location.reload();
      });
  }

  const updateBooking = (name, value) => {
    setLoading(true);

    const date = (name === "date" ? value : data.date);
    const start = (name === "start_time" ? value : data.start_time);
    const end = (name === "end_time" ? value : data.end_time);

    console.log(date+"/"+start+"/"+end);
    axiosInstance
      .put(`api/resourcebookings/${match.params.id}`,{
        date : name === "date" ? value : data.date,
        start : name === "start_time" ? value : data.start_time,
        end : name === "end_time" ? value : data.end_time,
      })
      .then(() => {
        fetchAllData();
        })
        .catch((error) => {
        console.log(error.response);
      }).finally(setLoading(false));
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
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Resource"
          value={data.resource_id}
          editable={false}
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
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="Owner"
              value={data.user_name}
              editable={false}
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="CNA"
              value={data.user_id}
              editable={false}
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="Date"
              value={data.date}
              type="date"
              onSave={(newValue) => updateBooking("date", newValue)}
              editable={
                getPermission(TAG.CRUD.UPDATE + TAG.routes.bookings) ? true : false
              }
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="Start Time"
              value={data.start_time}
              type="time"
              onSave={(newValue) => updateBooking("start_time", newValue)}
              editable={
                getPermission(TAG.CRUD.UPDATE + TAG.routes.bookings) ? true : false
              }
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="End Time"
              value={data.end_time}
              type="time"
              onSave={(newValue) => updateBooking("end_time", newValue)}
              editable={
                getPermission(TAG.CRUD.UPDATE + TAG.routes.bookings) ? true : false
              }
          />
          <Divider />
          <EditField
              loading={isLoading}
              name="Check-in Time"
              value={data.checkin_time}
              editable={false}
          />
          <Divider />
          </EditForm>
      </Box>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete booking
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the booking will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Booking
          </Button>
        )}
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
              {/* <Box flexDirection="row" display="flex"> */}
              <Grid container spacing={1}>
              <Grid item xs={10}>
                  <Typography variant="h6" component="div" color="textSecondary">
                      {isLoading ? <Skeleton /> : `${data.number}`}
                  </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    {isLoading ? <></> :
                    data.checkin_time == "-" ? 
                  <>
                      <Button color="primary" variant="contained" size="medium" onClick={check_in}>
                      Check-in
                      </Button>
                  </>
                  :
                  <>
                      <Button color="primary" variant="contained" disabled size="medium">
                      Checked-in
                      </Button>
                  </>
                  }
                  </Grid>
                  </Grid>
              {/* </Box> */}
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
        onConfirm={deleteBooking}
        title={`Cancel Bookings ${data.number}?`}
      >
        <Typography>Upon deletion, the tos will not be recoverable.</Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedBookingPage;
