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
            borderRadius: "7px",
            backgroundColor: "white"
        },
        "&::placeholder": {
            fontFamily: 'Arial, Helvetica, sans-serif ,Helvetica Neue',
            fontSize: '14px',
            color: '#D3D3D3',
            fontWeight: '400',
            fontStyle: 'italic',
        }

    },
    materialUILabel: {
        fontFamily: 'Arial, Helvetica, sans-serif ,Helvetica Neue',
        fontSize: '14px',
        color: '#D3D3D3',
        fontWeight: '400',
        fontStyle: 'italic',
        lineHeight: '2px'
    },
    smallText: {
        "& .MuiFormHelperText-root.Mui-error": {
            fontStyle: 'italic',
            width: "184px"
        }
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
            // label={props.label}
            placeholder={props.label}
            variant={props.variant}
            value={props.value}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            className={classes.root + ' ' + props.className + ' ' + (props.fullWidth ? "" : classes.smallText)}
            error={props.error}
            helperText={props.helperText}
            InputLabelProps={{
                classes: { root: classes.materialUILabel },
            }}
            InputProps={props.InputProps}
            inputProps={props.inputProps}
            multiline={props.multiline}
            rows={props.rows}
            rowsMax={props.rowsMax}
            disabled={props.disabled}
            min={props.min}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
        />
    );
}
