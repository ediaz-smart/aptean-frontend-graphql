import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .Mui-error": {
            fontStyle: 'italic'
        },
        "& .MuiFormHelperText-root": {
            fontStyle: 'italic'
        },
        width: "100%",
        borderRadius: "7px",
        borderColor: "rgb(193, 184, 184)",
        fontStyle: "italic",
        padding: "13px 19px"
    },
    materialUILabel: {
        fontStyle: 'italic'
    }
}));

export default function TextInput(props) {
    const classes = useStyles();
    return (
        <TextareaAutosize
            rowsMax={props.rowsMax}
            rowsMin={props.rowsMin}
            aria-label={props.label}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            className={classes.root}
            error={props.error}
            // helperText={props.helperText}
            // InputLabelProps={{
            //     classes: { root: classes.materialUILabel },
            // }}
        />
    );
}
