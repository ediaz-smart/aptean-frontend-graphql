import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import GQLogo from '../../assets/image/GenomeQuest.svg';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import NewsUpdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Validate from '../../helpers/validate';
import TextInput from '../../shared/Fields/TextInput';
import ClientCaptcha from "react-client-captcha"
import "react-client-captcha/dist/index.css"
import { useHistory } from 'react-router-dom';
import PasswordService from '../../services/forgotpassword'
import { supportMail } from '../../config';
import Footer from '../../shared/footer';
import { containerWidth } from '../../shared/constants';
import GQLogoComponent from '../../shared/components/GQLogoComponent';


const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
    },
    contentContainer: {
        minWidth: containerWidth
    },
    passwordRecoverDiv: {
        padding: '15px 25px 20px',
        border: '2px solid #bfb4b4',
        borderRadius: '6px'
    },
    navbarClass :{
        marginTop: '0px'
    },
    loginLogoDiv:{
        position: 'relative',
        width: '100%'
    },
    // '@media (min-width: 768px)': {
    //     loginLogoDiv: {
    //         position: 'relative',
    //         left: '50px',
    //         width: '100%'
    //     }
    // },
    // '@media (min-width: 1024px)': {
    //     loginLogoDiv: {
    //         position: 'relative',
    //         left: '80px',
    //         width: '100%'
    //     }
    // }
}));

function Forgotpassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [errorMsg,setErrorMsg] = useState(0);
    // const [retryState, setRetryState] = useState(false);
    const [passwordForm, setPasswordForm] = useState(true);
    const [locked, setLocked] = useState(false);

    const [verifycaptchaCode, setcaptchaCode] = useState(); 
    const dispatch = useDispatch();
    const history = useHistory();
     const formik = useFormik({
        initialValues: {
            userName: '',
            captchaCode: '',
        },
        validationSchema: Validate.ForgotValidate(),
         onSubmit: async(values) => {
            // setErrorMsg(0);
            if (values.captchaCode == verifycaptchaCode) {
                const result = await PasswordService.forgotPassword(values.userName);
                // dispatch(forgotpasswordSlice({userId:values.userName},history));
                //  checkflag = result.response_content.success;
                if (result.response_content.success == false) {
                    const error = result.response_content.errors[0];
                    // toast.error(error);
                    // setErrorMsg(3);
                    setErrorMsg(0);
                    setPasswordForm(false);
                    
                    if(result.response_content.errors[0] == 'locked')
                    {
                        setLocked(true);
                    }
                    
                   
                }
                else{
                    setErrorMsg(0);
                    setPasswordForm(false);
                    toast.success("Success");
                }
               
            }
            else{
                
            setErrorMsg(1);
            // toast.error("Captcha InCorrect ! Try Again");
            // setPasswordForm(false);
            }
        },
    });
    function updateCode(captchaCode)
    {    
        setcaptchaCode(captchaCode);
    }
    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    const passwordVlaue = formik.values.userName;
    const passwordCnVlaue = formik.values.captchaCode;
    const passValCheck = passwordVlaue.length;
    const passValCheck1 = passwordCnVlaue.length;
    // const borderStyle = {
    //     borderLeft: '1px solid #0606061f'
    // }
    return (
        <div className={classes.container + " mt-100"}>
            <div className={classes.contentContainer}>

                <Row className={classes.loginLogoDiv}>
                    <Col sm="1" md="1" xs='1'></Col>
                    <Col sm="3" md="3" xs='3' className="p-0">
                        {/* <Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link> */}
                        <GQLogoComponent toLink='#/login' />
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    {/* <Col sm="12" md="6" className="loginDiv"> */}
                    <Col sm="5" md="5" xs='5' className={'mt-4 ' + classes.passwordRecoverDiv}>
                        <form name="passwordForm" onSubmit={formik.handleSubmit}
                            onKeyDown={(e) => {

                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            className={(passwordForm ? 'd-block' : 'd-none')}>

                            <h5 className="loginTitle">{t('pwdRecovery')}</h5>
                            <p className="bodyText mb-4">{t('pwdRecoveryTitle')}</p>
                            {errorMsg == 1 ? <h6 className="loginFailedTitle">The code was incorrect, please try again</h6> : errorMsg == 2 ? <h5 className="loginTitle">{t('loginAccount')}</h5> : errorMsg == 3 ? <h6 className="loginFailedTitle">Invalid username</h6> : ''}

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
                                <ClientCaptcha fontColor='#FC0202' id='clientCaptcha' backgroundColor='#BDCFF5' width='150' fontSize='32' charsCount='5' captchaCode={updateCode} />
                            </div>

                            <div className="form-group">
                                {passValCheck != 0 && passValCheck1 != 0 ?
                                    <Button variant="contained" disableRipple={true} className='accountInfo' type="submit">{t('submit')}</Button> :
                                    <Button variant="contained" className='cancelButtonDisable' disableRipple={true}>{t('submit')}</Button>
                                }

                            </div>
                        </form>
                        <div className={'p-4 ' + (!locked && !passwordForm ? 'd-block' : 'd-none')}>

                            <h5>{t('pwdRecovery')}</h5>
                            <br />
                            <p>{t('thankYou')}</p>
                            <p>{t('loginInfoText')}</p>
                            <p>{t('pleaseContactText1')} <a href={"mailto:" + supportMail}>{supportMail}</a> {t('pleaseContactText2')}</p>
                        </div>
                        <div className={'p-4 ' + (locked && !passwordForm ? 'd-block' : 'd-none')}>

                            <h5>Password Recovery</h5>
                            <br />
                            <br />
                            <p>Too many unsuccessful attempts to access this account have been received. For your protection, the account has been locked.</p>
                            <p>Please contact <a href={"mailto:" + supportMail}>{supportMail}</a> for assistance.
                            </p>
                        </div>
                    </Col>
                    <Col sm="5" md="5" xs='5' className="mt-4">
                        <NewsUpdate isForgotPanel={true} />
                    </Col>
                </Row>
                <div className={classes.navbarClass}>
                    <Footer />
                </div>
            </div>
        </div>

    );
}

export default Forgotpassword;