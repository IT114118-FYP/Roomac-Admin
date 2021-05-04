import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  Grid,
} from "@material-ui/core";

import NavDrawer from "../components/NavDrawer";
import { axiosInstance } from "../api/config";

// https://material-ui.com/components/pickers/
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  //KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';

// ChartJS
import { Line, Doughnut, Pie } from 'react-chartjs-2';

import moment from "moment";

function ReportPage() {
  // Is Loading
  const [loading, setLoading] = useState(true);

  // Select Date Range
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date(moment().date(0).startOf('month').subtract(3, 'months')));
  const [selectedDateTo, setSelectedDateTo] = useState(new Date());

  // Response Report Data
  const [reportData, setReportData] = useState({});

  // Charts
  const [totalBookings, setTotalBookings] = useState({});
  const [branches, setBranches] = useState({});
  const [categories, setCategories] = useState({});
  const [resources, setResources] = useState({});
  const [users, setUsers] = useState({});
  const [usersBranches, setUsersBranches] = useState({});
  const [usersPrograms, setUsersPrograms] = useState({});

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`api/report?start=${moment(selectedDateFrom).format("YYYY-MM-DD")}&end=${moment(selectedDateTo).format("YYYY-MM-DD")}`)
      .then(response => {
        setReportData(response.data);

        let bookingsTotal = response.data['bookings']['total'];

        // Set Total Bookings
        let details = response.data['bookings']['details'];
        var labels = details.map(x => x['date']);
        var total = details.map(x => x['total']);
        var checkIn = details.map(x => x['checkIn']);
        var notCheckIn = details.map(x => x['notCheckIn']);

        setTotalBookings({
          labels: ['1', '2', '3', '4', '5', '6'],
          datasets: [
            {
              label: 'Total',
              data: total,
              fill: false,
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
              label: 'Checked-In',
              data: checkIn,
              fill: false,
              backgroundColor: 'rgb(0, 255, 102)',
              borderColor: 'rgba(0, 255, 102, 0.2)',
            },
            {
              label: 'Not Checked-In',
              data: notCheckIn,
              fill: false,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132, 0.2)',
            },
          ],
        });

        // Set Branches
        labels = response.data['branches'].map(x => x['title_en']);
        var data = response.data['branches'].map(x => x['total']);
        var sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setBranches({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set Categories
        labels = response.data['categories'].map(x => x['title_en']);
        data = response.data['categories'].map(x => x['total']);
        sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setCategories({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set Resources
        labels = response.data['resources'].map(x => x['number']);
        data = response.data['resources'].map(x => x['total']);
        sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setResources({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set Users
        labels = response.data['users'].map(x => x['name']);
        data = response.data['users'].map(x => x['total']);
        sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setUsers({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set Users Branches
        labels = response.data['users_branches'].map(x => x['title_en']);
        data = response.data['users_branches'].map(x => x['total']);
        sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setUsersBranches({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set Users Programs
        labels = response.data['users_programs'].map(x => x['title_en']);
        data = response.data['users_programs'].map(x => x['total']);
        sum = data.reduce((a, b) => a + b, 0);

        if (bookingsTotal > sum) {
          labels.push('Others');
          data.push(bookingsTotal - sum);
        }

        setUsersPrograms({
          labels: labels,
          datasets: [
            {
              label: '# of Bookings',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(140, 140, 140, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      })
      .catch(error => {
        console.log(error)
      });
  }, [selectedDateFrom, selectedDateTo]);

  const handleDateFromChange = (date) => {
    setSelectedDateFrom(date);
  };

  const handleDateToChange = (date) => {
    setSelectedDateTo(date);
  };

  // Total Bookings
  const options = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month'
        }
      }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  var body;
  if (loading) {
    body = (
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    )
  } else {
    body = (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
              style={{marginBottom: 10}}
            >
              Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(75, 192, 192, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Total Bookings</Typography>
                  <Typography variant="h6" color="textPrimary">{'total' in reportData['bookings'] ? reportData['bookings']['total'] : 0}</Typography>
                  <div>Checked-In: {reportData['bookings']['checkIn']}</div>
                </Paper>
              </Grid>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(255, 206, 86, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Top Resource</Typography>
                  <Typography variant="h6" color="textPrimary">{reportData['resources'].length === 0 ? 0 : reportData['resources'][0]['number']}</Typography>
                  <div>Bookings: {reportData['resources'].length === 0 ? 0 : reportData['resources'][0]['total']}</div>
                </Paper>
              </Grid>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(255, 99, 132, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Top Resource (Branch)</Typography>
                  <Typography variant="h6" color="textPrimary">{reportData['branches'].length === 0 ? 0 : reportData['branches'][0]['title_en']}</Typography>
                  <div>Bookings: {reportData['branches'].length === 0 ? 0 : reportData['branches'][0]['total']}</div>
                </Paper>
              </Grid>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(255, 99, 132, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Top Resource (Category)</Typography>
                  <Typography variant="h6" color="textPrimary">{reportData['categories'].length === 0 ? 0 : reportData['categories'][0]['title_en']}</Typography>
                  <div>Bookings: {reportData['categories'].length === 0 ? 0 : reportData['categories'][0]['total']}</div>
                </Paper>
              </Grid>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(54, 162, 235, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Top User (Branch)</Typography>
                  <Typography variant="h6" color="textPrimary">{reportData['users_branches'].length === 0 ? 0 : reportData['users_branches'][0]['title_en']}</Typography>
                  <div>Bookings: {reportData['users_branches'].length === 0 ? 0 : reportData['users_branches'][0]['total']}</div>
                </Paper>
              </Grid>
              <Grid item xs={6} style={{textAlign: "center"}}>
                <Paper style={{padding: 10, background: 'rgba(54, 162, 235, 0.2)'}}>
                  <Typography variant="h6" color="textPrimary">Top User (Program)</Typography>
                  <Typography variant="h6" color="textPrimary">{reportData['users_programs'].length === 0 ? 0 : reportData['users_programs'][0]['program_id']}</Typography>
                  <div>Bookings: {reportData['users_programs'].length === 0 ? 0 : reportData['users_programs'][0]['total']}</div>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Total Bookings
            </Typography>
            <Line data={totalBookings} options={options} />
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Resources
            </Typography>
            <Doughnut data={resources} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Resources (Branches)
            </Typography>
            <Doughnut data={branches} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Resources (Categories)
            </Typography>
            <Doughnut data={categories} />
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Users
            </Typography>
            <Pie data={users} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Users (Branches)
            </Typography>
            <Pie data={usersBranches} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            <Typography
              variant="h5"
              color="textPrimary"
            >
              Users (Programs)
            </Typography>
            <Pie data={usersPrograms} />
          </Paper>
        </Grid>
      </Grid>
    )
  }

  return (
    <NavDrawer>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        Report
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        View the statistics with selected date range
      </Typography>
      <Divider style={{marginTop:25,height:1.5}}/>
      <Grid container style={{marginBottom:15}}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-from"
            label="From"
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{marginRight: 25}}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-to"
            label="To"
            value={selectedDateTo}
            onChange={handleDateToChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>

      {body}

    </NavDrawer>
  );
}

export default ReportPage;
