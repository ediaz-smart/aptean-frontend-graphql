import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
       display:'block',
    },
    gridRoot:{
        width:'257px'
    },
    '@media (max-width: 780px)': {
        gridRoot: {
            width: '193px',
        },
        root:{
            margin:'0 !important'
        }
    }
  }));
export default function DatePicker(props) {
  // The first commit of Material-UI
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around" className={classes.gridRoot+" d-block float-left"}>
        <KeyboardDatePicker
          margin={props.margin}
          id={props.id}
          name={props.name}
          format={props.format}
          value={props.value}
          inputVariant={props.inputVariant}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.root+' '+props.class}
          allowKeyboardControl={props.allowKeyboardControl}
          onChange={props.onChange}
          disablePast={true}
          InputProps={{ readOnly: true }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
