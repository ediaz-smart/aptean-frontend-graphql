import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GQLogo from '../../assets/image/GenomeQuest.svg';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import { toast } from 'react-toastify';
import Newsupdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Validate from '../../helpers/validate';


const useStyles = makeStyles((theme) => ({
   
    passwordRecoverDiv:{
        padding: '15px 25px 20px',
        border: '2px solid #bfb4b4',
        borderRadius: '6px'
    },
    loginLogoDiv:{
        position: 'relative',
        left: '0px',
        width: '200px'
    },
    materialUILabel: {
        fontStyle: 'italic'
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
            left: '28px',
            width:'100%'
        }
    }
}));

function ChangePassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [passwordForm, setPasswordForm] = useState(true);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            userName: '',
            captchaCode: '',
        },
        validationSchema: Validate.ForgotValidate(),
        onSubmit: (values) => {
            toast.error("BAD Request Found!");
            setPasswordForm(false);
        },
    });

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    
    return (
        <Container className="mt-100">
            
          
            <Row >
                {/* <Col sm="12" md="6" className="loginDiv"> */}
                <Col sm="12" md="6" >
                    <form name="passwordForm" onSubmit={formik.handleSubmit} className={(passwordForm ? 'd-block' : 'd-none')}>
                        <h5 className="loginTitle">Authorization</h5>
                        <div className="form-group">
                            <TextField
                                fullWidth
                                id="userName"
                                name="userName"
                                label={'Current Password'}
                                variant="outlined"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helperText={formik.touched.userName && formik.errors.userName}
                                InputLabelProps={{
                                    classes: {root:classes.materialUILabel}, 
                                }}
                                className={classes.root}
                                />
                        </div>
                        <h5 className="loginTitle">New Password</h5>

                        {/* <p className="appTextColor mb-4">{t('pwdRecoveryTitle')}</p> */}
                        <div className="form-group">
                            <TextField
                                fullWidth
                                id="userName"
                                name="userName"
                                label={'New Password'}
                                variant="outlined"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helperText={formik.touched.userName && formik.errors.userName}
                                InputLabelProps={{
                                    classes: {root:classes.materialUILabel}, 
                                }}
                                className={classes.root}
                                />
                        </div>
                        <div className="form-group">
                            <TextField
                                fullWidth
                                id="captchaCode"
                                name="captchaCode"
                                label={'Re-enter New Password'}
                                variant="outlined"
                                value={formik.values.captchaCode}
                                onChange={formik.handleChange}
                                error={formik.touched.captchaCode && Boolean(formik.errors.captchaCode)}
                                helperText={formik.touched.captchaCode && formik.errors.captchaCode}
                                InputLabelProps={{
                                    classes: {root:classes.materialUILabel}, 
                                }}
                                className={classes.root}
                                />
                        </div>
                        <div className="form-group">
                        <Row className="float-right">
                            <Col  >
                            <Button variant="secondary"  className="float-right changePassword text-capitalize">Cancel</Button>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;

                            </Col>
                            <Col >
                            <Button variant="secondary" color="primary" className="float-right changePassword text-capitalize" type="submit">
                               a New Password
                            </Button>
                            </Col>
                        </Row>

                        </div>
                    </form>
                 
                </Col>
                <Col sm="12" md="5">

                </Col>
            </Row>
        </Container>

    );
}

export default ChangePassword;