import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import { toast } from 'react-toastify';
import Newsupdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
   
    passwordRecoverDiv:{
        padding: '15px 0 6px',
        border: '2px solid #bfb4b4',
        borderRadius: '6px'
    }
}));


function Forgotpassword() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [passwordForm, setPasswordForm] = useState(true);
    const { username, password } = inputs;
    // const loggingIn = useSelector(state => state.authentication.loggingIn);
    const loggingIn = false;
    const dispatch = useDispatch();
    const location = useLocation();

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        toast.error("BAD Request Found!");
        setSubmitted(true);
        setPasswordForm(false);
        if (username && password) {
            // get return url from location state or default to home page
            const { from } = location.state || { from: { pathname: "/" } };
            //dispatch(userActions.login(username, password, from));
        }
    }

    return (
        <Container className="mt-100">
            
            <Row className="justify-content-md-center">
            
                <Col sm="12" md="6" className="p-0"><img src={GQLogo} alt="GQLogo" /></Col>
            </Row>
            <Row className="justify-content-md-center">
                {/* <Col sm="12" md="6" className="loginDiv"> */}
                <Col sm="12" md="6" className={'mb-5 mt-4 '+classes.passwordRecoverDiv}>
                    <form name="form" onSubmit={handleSubmit} className={(passwordForm ? 'd-block' : 'd-none')}>
                        <h5 className="loginTitle">{t('pwdRecovery')}</h5>
                        <p className="loginTitle mb-0">{t('pwdRecoveryTitle')}</p>
                        <div className="form-group">
                            <TextField id="outlined-basic" label={t('username')} variant="outlined" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                            {submitted && !username &&
                                <div className="invalid-feedback">{t('usernameReq')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <TextField id="outlined-basic" label={t('codeShown')} variant="outlined" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                            {submitted && !password &&
                                <div className="invalid-feedback">{t('codeReq')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <Button variant="contained" color="primary" className="float-right loginSubmittext-capitalize" type="submit">
                                {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
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