import React, { useEffect, useState } from "react";
import {
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Grid,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import * as axios from "axios";

import NavDrawer from "../components/NavDrawer";
import { axiosInstance } from "../api/config";
import usePermission from "../navigation/usePermission";

// https://material-ui.com/components/pickers/
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';

// ChartJS
import { Line } from 'react-chartjs-2';

import moment from "moment";

function ReportPage(props) {
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date(moment().date(0).startOf('month').subtract(3, 'months')));
  const [selectedDateTo, setSelectedDateTo] = useState(new Date(moment().date(0)));

  useEffect(() => {
    //fetchAllData();
  }, [selectedDateFrom, selectedDateTo]);

  const handleDateFromChange = (date) => {
    setSelectedDateFrom(date);
  };

  const handleDateToChange = (date) => {
    setSelectedDateTo(date);
  };

  const data = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: 'Total',
        data: [1, 2, 1, 1, 2, 2],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Checked-In',
        data: [1, 2, 1, 1, 2, 2],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Not Checked-In',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
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

      {// Add charts
      }

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper style={{padding: 20}}>
            fds
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
            <Line data={data} options={options} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            fds
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            fds
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{padding: 20}}>
            fds
          </Paper>
        </Grid>
      </Grid>
    </NavDrawer>
  );
}

export default ReportPage;
