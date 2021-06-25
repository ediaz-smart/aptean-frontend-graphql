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
    loginDiv: {
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    navbarClass :{
        marginTop: '60px'
    }
    ,
    forgotLink: {
        marginTop: '10px',
        a: {
            color: '#008EC5'
        }
    },
    titleContent :{
        color: '#505F5F',
        margin: '5px 0 40px',
        fontWeight: '600'
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
            left: '6px',
            width:'100%'
        }
    },
    passwordContents:{
        lineHeight: '22px',
        marginTop: '100px',
        marginLeft: '25px',
        padding:'15px',
        fontSize:'14px',
        backgroundColor: 'gainsboro'

    },
    conType:{
        marginLeft: '30px',
        fontSize:'14px',
    },
    buttonAlignment :{
        float:'right',
        text :'capitalize',
        marginRight: '16px'
    },
    straightLine:{
        borderLeft: '1px solid #d8d4d4',
        height: '340px'
    },
    columnDesign:{
        flexGrow :0,
        marginLeft:'25px',
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
        <div >
        <Container className="mt-100">
            <Row className={classes.loginLogoDiv}>
                <Col md="3" className="p-0 ml-4">
                    <Link to="/login"><img src={GQLogo} alt="GQLogo" className="w-75" /></Link>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col sm="12" md="5" className="mb-5 mt-4" className={(passwordForm ? 'd-block' : 'd-none')}>
            
                <form name="loginForm" onSubmit={formik.handleSubmit} className={classes.loginDiv+" content"}>
                <h5 className={classes.titleContent}>New Password</h5>
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
                    <br></br>
                    <div className="form-group">
                    <Button color="default" variant="contained" className={classes.buttonAlignment} type="submit">
                        Save New Password
                        </Button>
                        <Button color="default" variant="contained" className={classes.buttonAlignment} type="submit">
                         Cancel
                        </Button>
                        <br></br>
                    </div>
                </form>
                <div className={'p-4 ' +(passwordForm ? 'd-none' : 'd-block')}>

                            <h5>{t('pwdRecovery')}</h5>
                            <br />
                            <p>{t('thankYou')}</p>
                            <p>{t('loginInfoText')}</p>
                            <p>{t('pleaseContactText1')} <a href={"mailto:"+supportMail}>{supportMail}</a> {t('pleaseContactText2')}</p>
                   </div>
                <br></br>
                </Col>
                 <Col className={classes.columnDesign} >
                 <div className={classes.straightLine} />
                 </Col>
                <Col sm="12" md="6">
                <div className={classes.passwordContents}>
                         <p>{t('cpconentstitle')}</p>
                         <h6><strong>{t('cppassrules')}</strong></h6>
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
        </Container>
        <div className={classes.navbarClass}>
            <Footer />
        </div>
        </div>
      
    );
}

export default NewPassword;