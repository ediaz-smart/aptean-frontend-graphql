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
import ClientCaptcha from "react-client-captcha"
import "react-client-captcha/dist/index.css"
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
    passwordContents:{
        marginTop: '82px',
        marginLeft: '28px',
        padding:'10px',
        fontSize:'14px',
        backgroundColor: 'gainsboro'

      },
      loginSubmitCancel:{
        backgroundColor: '#0182C5',
        borderColor: '#1F4E79',
        border: '2px solid #1F4E79' ,
        color:'white',
        margin: '4px',
        marginRight: '18px',
        textTransform: 'capitalize',
        '&:hover': {
          backgroundColor: '#0182C5',
          boxShadow: 'none',
        },
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
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Validate.NewPassValidate(),
         onSubmit: async(values) => {
            // setErrorMsg(0);
            
            
        },
    });
   
    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    const passwordVlaue = formik.values.newPassword;
    const passwordCnVlaue = formik.values.confirmPassword;
    console.log(passwordVlaue,"vlauess vlauess vlauess vlauess vlauess");
    const passValCheck = passwordVlaue.length; 
    const passValCheck1 = passwordCnVlaue.length; 

    return (
        <Container className="mt-100">
            
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="3" className="p-0 ml-4"><Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link></Col>

            </Row>
            <Row className="justify-content-md-center">
                {/* <Col sm="12" md="6" className="loginDiv"> */}
                <Col sm="12" md="5" className={'mb-5 mt-4 '+classes.passwordRecoverDiv}>
                    <form name="passwordForm" onSubmit={formik.handleSubmit} 
                    onKeyDown={(e) => {
                      
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                     }}
                     className={(passwordForm ? 'd-block' : 'd-block')}>

                        <h5 className="loginTitle">New Password</h5>
                        {errorMsg == 1 ? <h6 className="loginFailedTitle">The code was incorrect, please try again</h6> :errorMsg == 2 ? <h5 className="loginTitle">{t('loginAccount')}</h5> : errorMsg == 3 ? <h6 className="loginFailedTitle">Invalid username</h6>:'' }
                        <br></br>
                        <div className="form-group">
                            <TextInput 
                                fullWidth
                                id="newPassword"
                                name="newPassword"
                                label={t('newpass')}
                                variant="outlined"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange} 
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                            />
                        </div>
                        <div className="form-group">
                            
                            <TextInput
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label={t('renpass')}
                                variant="outlined"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </div>
                        <br></br>
                        <div className='float-right'>
                        <Button variant="contained" className={classes.loginSubmitCancel} >{t('cancel')}</Button>
                            {passValCheck != 0  && passValCheck1 != 0  ?
                                <Button variant="contained" className='accountInfo' type="submit">{t('cpsavenewpass')}</Button> :
                                <Button variant="contained" className='cancelButtonCP'  disableRipple={true}>{t('cpsavenewpass')}</Button> 
                             }
                      
                       
                        </div>
                    </form>
                  
                </Col>
                
                
                <Col sm="12" md="6" className="ml-3">
             

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
                </Col>
            </Row>
            <div className={classes.navbarClass}>
            <Footer />
        </div>
        </Container>

    );
}

export default NewPassword;