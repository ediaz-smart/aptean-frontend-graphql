import React, { useState, useEffect } from 'react';
import { Link,useHistory } from 'react-router-dom';
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
import Validate from '../../helpers/validate';


const useStyles = makeStyles((theme) => ({
    loginDiv:{
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    forgotLink:{
        marginTop: '10px',
        a:{
            color:'#008EC5'
        }
    },
    loginLogoDiv:{
        position: 'relative',
        left: '0px',
        width: '200px'
    },
    '@media (min-width: 768px)' : {
        loginLogoDiv:{
            position: 'relative',
            left: '36px',
            width:'100%'
        }
    }
}));
//import { userActions } from '../_actions';
//console.log(GQLogo,'logoss');
function Login(props) {
    
    const history = useHistory();
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Validate.LoginValidate(),
        onSubmit: (values) => {
          alert(JSON.stringify(values, null, 2));
          history.push('/home');
        },
    });

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    return (
        <Container className="mt-100">
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="2" className="p-0 ml-4"><Link to="/login"><img src={GQLogo} alt="GQLogo" /></Link></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col sm="12" md="6" className="mb-5 mt-4">
                
                <form name="loginForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>
                    <h5 className="loginTitle">{t('loginAccount')}</h5>
                    <div className="form-group">
                        <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label={t('username')}
                        variant="outlined"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                        fullWidth
                        variant="outlined"
                        id="password"
                        name="password"
                        label={t('password')}
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        />
                    </div>
                    <div className="form-group">
                        <Button color="primary" variant="contained" className="float-right loginSubmit text-capitalize" type="submit">
                        {t('submit')}
                        </Button>
                    </div>
                    
                </form>
                    <p className={classes.forgotLink}>
                        <Link to="/forgot" className="m-0">{t('forgotLogin')}</Link>
                    </p>
                </Col>
                <Col sm="12" md="5">
                    <Newsupdate />
                </Col>
            </Row>
        </Container>

    );
}

export default Login;