import React, { useState, useEffect } from 'react';
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
import TextInput from '../../shared/Fields/TextInput';
import { Link, useHistory } from 'react-router-dom';
import PasswordService from '../../services/forgotpassword'
import { supportMail } from '../../config';
import Footer from '../../shared/footer';


const useStyles = makeStyles((theme) => ({

   
    passwordRecoverDiv:{
        padding: '15px 25px 20px',
        border: '2px solid #bfb4b4',
        borderRadius: '6px'
    },
    navbarClass :{
        marginTop: '0px'
    },
    loginLogoDiv:{
        position: 'relative',
        left: '0px',
        width: '200px'
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
    },
    passwordContents:{
        lineHeight: '22px',
        marginTop: '78px',
        marginLeft: '25px',
        padding:'15px',
        fontSize:'14px',
        backgroundColor: 'gainsboro'

    },
    conType:{
        marginLeft: '30px',
        fontSize:'14px',
    },
    newsContent:{
        textAlign: 'justify',
        lineHeight: '22px',
        // '& p':{
        //     fontSize: '14px'
        // }
    },
    '@media (min-width: 780px)' : {
        newsContent:{
            marginLeft: '1.5rem',
            paddingLeft: '36px',
            borderLeft: '1px solid #d8d4d4',
            height: '150px',
        }
    }
}));

function NewPassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [errorMsg,setErrorMsg] = useState(0);
    // const [retryState, setRetryState] = useState(false);
    const [passwordForm, setPasswordForm] = useState(true);
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
            
          
        },
    });
    function updateCode(captchaCode)
    {    
        setcaptchaCode(captchaCode);
        console.log(captchaCode,"captchaCode");
    }
    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    
    return (
        <Container className="mt-100">
            
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="3" className="p-0 ml-4"><Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link></Col>

            </Row>
            <Row className="justify-content-md-center">
                {/* <Col sm="12" md="6" className="loginDiv"> */}
                <Col sm="12" md="5" className={'mb-5 mt-4 '+classes.passwordRecoverDiv}>
                    <form name="passwordForm" onSubmit={formik.handleSubmit} className={(passwordForm ? 'd-block' : 'd-none')}>

                        <h5 className="loginTitle">New Password</h5>
                        {errorMsg == 1 ? <h6 className="loginTitle failedTextColor">The code was incorrect, please try again</h6> :errorMsg == 2 ? <h5 className="loginTitle">{t('loginAccount')}</h5> : errorMsg == 3 ? <h6 className="loginTitle failedTextColor">Invalid username</h6>:'' }

                        <div className="form-group">
                            <TextInput 
                                fullWidth
                                id="userName"
                                name="userName"
                                label='New password'
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
                                label='Re-enter new password'
                                variant="outlined"
                                value={formik.values.captchaCode}
                                onChange={formik.handleChange}
                                error={formik.touched.captchaCode && Boolean(formik.errors.captchaCode)}
                                helperText={formik.touched.captchaCode && formik.errors.captchaCode}
                            />
                        </div>
                      
                        <div className="form-group">
                           <Button variant="contained" className="float-right text-capitalize" >Save New Password</Button>
                           &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;

                            <Button variant="contained" className="float-right text-capitalize" >{t('cancel')}</Button>

                        </div>
                    </form>
                    <div className={'p-4 ' +(passwordForm ? 'd-none' : 'd-block')}>

                        <h5>{t('pwdRecovery')}</h5>
                        <br />
                        <p>{t('thankYou')}</p>
                        <p>{t('loginInfoText')}</p>
                        <p>{t('pleaseContactText1')} <a href={"mailto:"+supportMail}>{supportMail}</a> {t('pleaseContactText2')}</p>
                    </div>
                </Col>
                <Col sm="12" md="6">
                {/* <div  className={classes.newsContent}> */}
                <div className={classes.passwordContents}>
                      <div >
                         <p>{t('cpconentstitle')}</p>
                         <h6><strong>{t('cppassrules')}</strong></h6>
                      </div>
                     
                       <div className={classes.conType}>
                        <p>{t('cpsubtitle')}</p>
                               <ul>
                                <li>{t('cprule1')}</li>
                                <li>{t('cprule2')}</li>
                                <li>{t('cprule3')}</li>
                                <li>{t('cprule4')}</li>
                                </ul>
                    </div>
                      

                  </div>
                {/* </div> */}

                  
                </Col>
            </Row>
            <div className={classes.navbarClass}>
            <Footer />
        </div>
        </Container>

    );
}

export default NewPassword;