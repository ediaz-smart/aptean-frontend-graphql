import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import GQLogo from '../../assets/image/GenomeQuest.svg';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
// import { toast } from 'react-toastify';
import NewsUpdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Validate from '../../helpers/validate';
import TextInput from '../../shared/Fields/TextInput';
// import ClientCaptcha from "react-client-captcha"
import "react-client-captcha/dist/index.css"
import { Link, useHistory, useParams } from 'react-router-dom';
// import PasswordService from '../../services/forgotpassword'
import { supportMail } from '../../config';
import Footer from '../../shared/footer';
import AccountService from '../../services/accountInfo';
import ChangePassCheckModal from '../../shared/Modal/ChangePassCheckModal'
// import ForgotPassword from '../../services/forgotpassword';
import GQLogoComponent from '../../shared/components/GQLogoComponent';


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
    lengthLine:{
            borderLeft: '1px solid grey',
            height: '318px',
            marginLeft: '40px'
       
      
    
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
            left: '20px',
            width:'100%'
        }
    }
}));

function NewPassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [errorMsg,setErrorMsg] = useState(0);
    // const [retryState, setRetryState] = useState(false);
    const [passwordForm, setPasswordForm] = useState(false);
    const [sucPasswordForm, setSucPasswordForm] = useState(false);
    const [sucKey, setSucKey] = useState(false);

    const [verifycaptchaCode, setcaptchaCode] = useState(); 
    const dispatch = useDispatch();
    const [modalCheckPass, setModalCheckPass] = React.useState(false); 
    const { key } = useParams();
    const { userId } = useParams();

    const history = useHistory();
     const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Validate.NewPassValidate(),
         onSubmit: async(values) => {

            // setErrorMsg(0);
            console.log(values.newPassword,'1');
            console.log(values.confirmPassword,'12');
            if(values && values.newPassword == values.confirmPassword )
            {
                console.log(values.newPassword,'13');
                console.log(values.confirmPassword,'14');
                const result = await AccountService.updateResetPass(userId,key,values.newPassword);
                console.log(result);
                setSucPasswordForm(true);
                setPasswordForm(false);
                

            }else{
                setModalCheckPass(true);
            }
            
            
        },
    });
   
    function tryAgainFormNew()
    {
     
      formik.setFieldValue('newPassword','') && formik.setFieldValue('confirmPassword',''); 
      formik.setFieldValue('default','')
      setModalCheckPass(false);
    }
   
    // reset login status
   
    useEffect(() => {
        (async () => {
            console.log(key,"key value");
            console.log(userId,"userId userId userId value");
            if(key && userId)
            {
                const result = await AccountService.authCheckInfo(userId,key);
                console.log(result,"result value");
                if(result && result.response_content && result.response_content.status)
                {
                    result.response_content.status == 'valid_auth' ? setPasswordForm(true) : setPasswordForm(false);
                    result.response_content.status == 'invalid_auth' ? setSucKey(false) : setSucKey(true);
                    var test = sucKey;
                    console.log('test');
                }
    
            }
         
        })()
      }, []);
    function cancelForm()
    {
      setModalCheckPass(false);
      history.push('/login');
    }
    function validVar()
    {
        history.push('/login');
        // formik.setFieldValue('newPassword','') && formik.setFieldValue('confirmPassword',''); 
        // formik.setFieldValue('default','')
    }
    const passwordVlaue = formik.values.newPassword;
    const passwordCnVlaue = formik.values.confirmPassword;
    console.log(passwordVlaue,"vlauess vlauess vlauess vlauess vlauess");
    const passValCheck = passwordVlaue.length; 
    const passValCheck1 = passwordCnVlaue.length; 
    function loginPage()
    {
        history.push('/login');
    }

    function forgotPage() {
        history.push('/forgot');
    }

    return (
        <Container className="mt-100">
            
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="3" className="p-0 ml-4">
                    {/* <Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link> */}
                    <GQLogoComponent toLink='#/login' />
                </Col>

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
                     className={( !sucPasswordForm && passwordForm ? 'd-block' : 'd-none')}>

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
                                type="password"
                                inputProps={{
                                    maxlength: 20
                                  }}
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
                                inputProps={{
                                    maxlength: 20
                                  }}
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </div>
                        <br></br>
                        <div className='float-right'>
                        <Button variant="contained" onClick={()=>validVar()} className={classes.loginSubmitCancel} >{t('cancel')}</Button>
                            {passValCheck != 0  && passValCheck1 != 0  ?
                                <Button variant="contained" className='accountInfo' type="submit">{t('cpsavenewpass')}</Button> :
                                <Button variant="contained" className='cancelButtonCP'  disableRipple={true}>{t('cpsavenewpass')}</Button> 
                             }
                      
                       
                        </div>
                    </form>
                    <div className={'p-4 ' +(sucKey && !sucPasswordForm && !passwordForm ? 'd-block' : 'd-none')}>

                            <h5>Password Recovery</h5>
                            <br />
                            <br />
                            <p>Too many unsuccessful attempts to access this account have been received. For your protection, the account has been locked.</p>
                            <p>Please contact <a href={"mailto:"+supportMail}>{supportMail}</a> for assistance.
                            </p>
                            </div>
                            <div className={'p-4 ' +(sucKey && sucPasswordForm && !passwordForm ? 'd-block' : 'd-none')}>

                            <h5>Password Recovery</h5>
                            <br />
                            <br />
                            <p> Your new password has been saved. Please use it to log in to the application.</p>
                               
                            <br />
                            <br />
                            <Button variant="contained" className='accountInfo' onClick={()=>loginPage()}>Login</Button> 

                            </div>
                            <div className={'p-4 ' +( !sucKey ? 'd-block' : 'd-none')}>

                        <h5>Password Recovery</h5>
                        <br />
                        <p>Your password recovery token has expired. <br /> Please return to the password reset option and try again.</p>
                        <p>Please contact <a href={"mailto:" + supportMail}>{supportMail}</a> for assistance.</p>
                        <Button variant="contained" className='accountInfo' onClick={() => forgotPage()}>Password reset</Button>
                    </div>


                            {/* <div className={'p-4 ' +(passwordForm ? 'd-block' : 'd-block')}>

                                <h5>Password Recovery</h5>
                                <br />
                                <br />
                                <p> Your new password has been saved. Please use it to log in to the application.</p>
                         
                                </div> */}
                           

                    <ChangePassCheckModal
                            show={modalCheckPass}
                            onHide={() => cancelForm()}
                            tryAgain={()=> tryAgainFormNew()}
                            // onMessage={errorMessage}
                        />
                </Col>

                { passwordForm ?  <div  className={classes.lengthLine} /> : <p></p>

                }
               
                
                <Col sm="12" md="6" className="ml-3">
             
                { passwordForm ? 
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
                  :
                  <NewsUpdate />
               
                }
               
                 
                </Col>

            </Row>
            <div className={classes.navbarClass}>
            <Footer />
        </div>
        </Container>

    );
}

export default NewPassword;