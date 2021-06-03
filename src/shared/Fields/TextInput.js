import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .Mui-error": {
            fontStyle: 'italic'
        },
        "& .MuiFormHelperText-root": {
            fontStyle: 'italic'
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "7px"
        },
        
    },
    materialUILabel: {
        fontStyle: 'italic',
        lineHeight:'6px'
    }
}));

export default function TextInput(props) {
    const classes = useStyles();
    return (
        <TextField 
        fullWidth={props.fullWidth}
        id={props.id}
        name={props.name}
        type={props.type}
        label={props.label}
        variant={props.variant}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        className={classes.root+' '+props.className} 
        error={props.error}
        helperText={props.helperText}
        InputLabelProps={{
            classes: {root:classes.materialUILabel}, 
        }} 
        InputProps={props.InputProps}
        multiline={props.multiline}
        rows={props.rows}
        rowsMax={props.rowsMax}
        disabled={props.disabled}
        />
    );
}
