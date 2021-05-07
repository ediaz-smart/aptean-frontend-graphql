import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';

import GQLogo from '../../assets/image/GenomeQuest.svg';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation, } from "react-i18next";
import Newsupdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
// import { submitLogin } from '../../reducers/slice/loginSlice';
import Validate from '../../helpers/validate';


const useStyles = makeStyles((theme) => ({
   
}));

function IpSequenceSearch(props) {

    const history = useHistory();
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: Validate.LoginValidate(),
        onSubmit: async(values) => {
            // dispatch(submitLogin({GQUSERID: values.userName, GQPASSWORD: values.password}));
            // history.push('/home');
        },
    });

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    return (
        <Container className="mt-100">
            
        </Container>

    );
}

export default IpSequenceSearch;
