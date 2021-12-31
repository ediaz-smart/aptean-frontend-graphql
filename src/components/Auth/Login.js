import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';

import GQLogoComponent from '../../shared/components/GQLogoComponent';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-bootstrap';
import { useTranslation, } from "react-i18next";
import NewsUpdate from '../../shared/NewsUpdate';
import { makeStyles } from '@material-ui/core/styles';
import { submitLogin } from '../../reducers/slice/loginSlice';
import Validate from '../../helpers/validate';
import TextInput from '../../shared/Fields/TextInput';
import Footer from '../../shared/footer';
import { supportMail } from '../../config';
import { containerWidth } from '../../shared/constants'

const useStyles = makeStyles((theme) => ({
    container: {
        minWidth: containerWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        width: containerWidth,
        padding: '0 0 0 20px',
        marginLeft: '20px'
    },
    loginBox: {
        borderRight: '1px solid #bfb4b4'
    },
    loginDiv: {
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    navbarClass: {
        marginTop: '60px',
        width: '100%'
    },
    loginSubmitDis: {
        backgroundColor: '#EEEEEE',
        // borderColor: '#a2a2a3',
        border: '1px solid #CCCCCC',
        float: 'right',
        color: '#777777',
        textTransform: 'capitalize',
        '&:hover': {
            // backgroundColor: '#EEEEEE',
            pointerEvents: 'none',
            boxShadow: 'none',
        },
    },
    forgotLink: {
        marginTop: '10px',
        a: {
            color: '#008EC5'
        }
    },
    loginLogoDiv: {
        position: 'relative',
        width: '100%'
    },
    root: {
        "& .Mui-error": {
            fontStyle: 'italic'
        },
        "& .MuiFormHelperText-root": {
            fontStyle: 'italic'
        }
    }
}));
//import { userActions } from '../_actions';
function Login(props) {

    const history = useHistory();
    const classes = useStyles();
    const [errorMsg, setErrorMsg] = useState(false);
    const { t, i18n } = useTranslation('common');
    const [errorMsgText, setErrorMsgText] = useState(t('loginFailure1'));
    const [loginTry, setLoginTry] = useState();
    const dispatch = useDispatch();
    const toastRef = useRef(null)

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: Validate.LoginValidate(),
        onSubmit: async (values) => {
            let resp = await dispatch(submitLogin({ GQUSERID: values.userName, GQPASSWORD: values.password }, history, t, toastRef));
            if (resp && resp.response_status > 0) {
                if (resp.response_content.triesLeft > 3) {
                    setErrorMsgText(t('loginFailure1'));
                }
                else if (resp.response_content.triesLeft == 3) {
                    setErrorMsgText(t('loginFailure2'));
                }
                else if (resp.response_content.triesLeft == 2) {
                    setErrorMsgText(t('loginFailure3'));
                }
                else if (resp.response_content.triesLeft == 1) {
                    setErrorMsgText(t('loginFailure4'));
                } else if (resp.response_content.triesLeft == null) {
                    setErrorMsgText(t('loginFailure1'));
                }
                else {
                    setErrorMsgText(t('loginFailure5'));
                }
                setLoginTry(resp.response_content.triesLeft)
                setErrorMsg(true);
            }
        },
    });

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
        const isUserLogin = localStorage.getItem('isLoggedIn');
        if (isUserLogin) {
            history.push('/home');
        }
    }, []);
    const passwordVlaue = formik.values.userName;
    const passwordCnVlaue = formik.values.password;
    const passValCheck = passwordVlaue.length;
    const passValCheck1 = passwordCnVlaue.length;

    return (
        <div className={classes.container}>
            <Row className={classes.contentContainer}>
                <div className={"mt-100 " + classes.contentContainer}>
                    <Row className={classes.loginLogoDiv}>
                        <Col md="6" sm="6" xs='6' className="p-0 ml-4">
                            {/* <Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-50" /></Link> */}
                            <GQLogoComponent toLink='#/login' />
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col sm="5" md="5" xs='5' className={classes.loginBox + " mb-5"} >

                            <form name="loginForm" onSubmit={formik.handleSubmit} className={classes.loginDiv + " content"}>
                                {!errorMsg && <h5 className="loginTitle">{t('loginAccount')}</h5>}
                                {errorMsg && <h6 className="loginFailedTitle">{errorMsgText}</h6>}
                                {errorMsg && loginTry == 0 &&
                                    <p>Please Contact <a href={"mailto:" + supportMail}>{supportMail}</a> for assistance.</p>
                                }
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
                                    {passValCheck != 0 && passValCheck1 != 0 ?
                                        <Button variant="contained" disableRipple={true} className='accountInfo' type="submit">{t('submit')}</Button> :
                                        <Button variant="contained" className='cancelButtonDisable' disableRipple={true}>{t('submit')}</Button>
                                    }

                                </div>

                            </form>
                            <p className={classes.forgotLink}>
                                <Link to="/forgot" className="m-0">{t('forgotLogin')}</Link>
                            </p>
                        </Col>
                        <Col sm="5" md="5" xs="5">
                            <NewsUpdate isMostUsedPanel={true} />
                        </Col>
                    </Row>
                </div>
            </Row>
            <div className={classes.navbarClass}>
                <Footer />
            </div>
        </div>


    );
}

export default Login;