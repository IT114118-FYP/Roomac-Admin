import React, { useEffect, useState } from "react";
import {
  makeStyles,
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

import moment from "moment";

function ReportPage(props) {
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date(moment().date(0).startOf('month')));
  const [selectedDateTo, setSelectedDateTo] = useState(new Date(moment().date(0)));

  useEffect(() => {
    //fetchAllData();
  }, []);

  const handleDateFromChange = (date) => {
    setSelectedDateFrom(date);
  };

  const handleDateToChange = (date) => {
    setSelectedDateTo(date);
  };

  return (
    <NavDrawer>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        Report
      </Typography>
      <Grid container>
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
    </NavDrawer>
  );
}

export default ReportPage;
