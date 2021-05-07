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
import { submitLogin } from '../../reducers/slice/loginSlice';
import Validate from '../../helpers/validate';
import TextInput from '../../shared/Fields/TextInput';

const useStyles = makeStyles((theme) => ({
    loginDiv: {
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    forgotLink: {
        marginTop: '10px',
        a: {
            color: '#008EC5'
        }
    },
    loginLogoDiv: {
        position: 'relative',
        left: '0px',
        width: '200px'
    },
    root: {
        "& .Mui-error": {
            fontStyle:'italic'
        },
        "& .MuiFormHelperText-root": {
            fontStyle:'italic'
        }
    },
    '@media (min-width: 768px)' : {
        loginLogoDiv:{
            position: 'relative',
            left: '50px',
            width:'100%'
        }
    },
    '@media (min-width: 1024px)' : {
        loginLogoDiv:{
            position: 'relative',
            left: '80px',
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
            userName: '',
            password: '',
        },
        validationSchema: Validate.LoginValidate(),
        onSubmit: async(values) => {
            dispatch(submitLogin({GQUSERID: values.userName, GQPASSWORD: values.password}));
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
                <Col md="3" className="p-0 ml-4">
                    <Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col sm="12" md="5" className="mb-5 mt-4">
                
                <form name="loginForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>
                    <h5 className="loginTitle">{t('loginAccount')}</h5>
                    <div className="form-group">
                        <TextInput 
                        fullWidth
                        id="userName"
                        name="userName"
                        label={t('userName')}
                        variant="outlined"
                        value={formik.values.userName}
                        onChange={formik.handleChange} 
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                        helperText={formik.touched.userName && formik.errors.userName}
                        />
                    </div>
                    <div className="form-group">
                        <TextInput 
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
