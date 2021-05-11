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
        }
    },
    materialUILabel: {
        fontStyle: 'italic',
    }
}));

export default function TextInput(props) {
    const classes = useStyles();
    console.log(props, 'propsss')
    return (
        <TextField 
        fullWidth={props.fullWidth}
        id={props.id}
        name={props.name}
        label={props.label}
        variant={props.variant}
        value={props.value}
        onChange={props.onChange}
        className={classes.root+' '+props.class} 
        error={props.error}
        helperText={props.helperText}
        InputLabelProps={{
            classes: {root:classes.materialUILabel}, 
        }} 
        />
    );
}
