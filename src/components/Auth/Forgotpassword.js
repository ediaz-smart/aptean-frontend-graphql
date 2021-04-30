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
    '@media (min-width: 768px)' : {
        loginLogoDiv:{
            position: 'relative',
            left: '28px',
            width:'100%'
        }
    }
}));

function Forgotpassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [passwordForm, setPasswordForm] = useState(true);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: '',
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
            
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="2" className="p-0 ml-4"><Link to="/login"><img src={GQLogo} alt="GQLogo" /></Link></Col>

            </Row>
            <Row className="justify-content-md-center">
                {/* <Col sm="12" md="6" className="loginDiv"> */}
                <Col sm="12" md="6" className={'mb-5 mt-4 '+classes.passwordRecoverDiv}>
                    <form name="passwordForm" onSubmit={formik.handleSubmit} className={(passwordForm ? 'd-block' : 'd-none')}>
                        <h5 className="loginTitle">{t('pwdRecovery')}</h5>
                        <p className="appTextColor mb-4">{t('pwdRecoveryTitle')}</p>
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
                                id="captchaCode"
                                name="captchaCode"
                                label={t('codeShown')}
                                variant="outlined"
                                value={formik.values.captchaCode}
                                onChange={formik.handleChange}
                                error={formik.touched.captchaCode && Boolean(formik.errors.captchaCode)}
                                helperText={formik.touched.captchaCode && formik.errors.captchaCode}
                                />
                        </div>
                        <div className="form-group">
                            <Button variant="contained" color="primary" className="float-right loginSubmit text-capitalize" type="submit">
                                {t('submit')}
                            </Button>
                        </div>
                    </form>
                    <div className={'p-4 ' +(passwordForm ? 'd-none' : 'd-block')}>

                        <h5>{t('pwdRecovery')}</h5>
                        <br />
                        <p>{t('thankYou')}</p>
                        <p>{t('loginInfoText')}</p>
                        <p>{t('pleaseContactText')}</p>
                    </div>
                </Col>
                <Col sm="12" md="5">
                    <Newsupdate />
                </Col>
            </Row>
        </Container>

    );
}

export default Forgotpassword;