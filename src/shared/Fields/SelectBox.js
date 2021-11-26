import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    // width: '194px',
    width: '215px',
    padding: '10px 0px',
    margin: '-8px 0 0 -5px'
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 100,
    top: '150px'
  },
  smallBox: {
    width: '14%',
    padding: '10px 0px',
    margin: '-8px 0 0 -5px',
    '& .MuiSelect-iconOutlined': {
      right: '0px'
    }
  },

}));

export default function SelectBox(props) {
  const classes = useStyles();

  const items = props.items;
  console.log(items)
  return (
    // <form className={classes.container} noValidate autoComplete="off">
    <TextField
      id={props.id}
      name={props.name}
      select
      // label={gender=== "" ? "Gender": ""}
      className={props.className + " " + (props.smallSelectBox ? classes.smallBox : classes.textField)}
      value={props.value}
      InputLabelProps={{ shrink: false }}
      SelectProps={{
        MenuProps: {
          className: (props.smallSelectBox ? "" : classes.menu),
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          getContentAnchorEl: null

        }
      }}
      margin={props.margin}
      variant={props.variant}
      onChange={props.onChange}
      disabled={props.disabled}
      onBlur={props.onBlur}
    >
      {items && items.length > 0 && items.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    // </form>
  );
}
