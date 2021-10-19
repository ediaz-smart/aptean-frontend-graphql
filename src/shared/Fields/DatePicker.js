import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from "@material-ui/core/styles";
import DatePickerNew from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    padding: '9px',
    marginTop: '2px'
  },
  gridRoot: {
    width: '257px'
  }
  // '@media (max-width: 780px)': {
  //     gridRoot: {
  //         width: '193px',
  //     },
  //     root:{
  //         margin:'0 !important'
  //     }
  // }
}));
export default function DatePicker(props) {
  // The first commit of Material-UI
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [startDate, setStartDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around" className={classes.gridRoot + " d-block float-left"}>
        <DatePickerNew
          id={props.id}
          name={props.name}
          format={props.format}
          showWeekNumbers
          className={classes.root + ' ' + props.className}
          disabled={props.disabled}
          onChange={props.onChange}
          selected={props.value}
          onFocus={e => e.target.blur()}
          dateFormat={props.dateFormat}
        />
        {/* <KeyboardDatePicker
          margin={props.margin}
          id={props.id}
          name={props.name}
          format={props.format}
          value={props.value}
          inputVariant={props.inputVariant}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.root+' '+props.className}
          allowKeyboardControl={props.allowKeyboardControl}
          onChange={props.onChange}
          disablePast={props.disablePast}
          InputProps={{ readOnly: true }}
          disabled={props.disabled}
          variant="inline"
          showWeekNumbers
        /> */}
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
