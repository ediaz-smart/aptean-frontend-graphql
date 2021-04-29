import React, { useState, useEffect } from 'react';
import { Link, useLocation,useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import GQLogo from '../../assets/image/GenomeQuest.svg';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Newsupdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    loginDiv:{
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    forgotLink:{
        marginTop: '10px',
        a:{
            color:'#008EC5'
        }
    },
    loginLogoDiv:{
        position: 'relative',
        left: '0px',
        width: '200px'
    },
    '@media (min-width: 768px)' : {
        loginLogoDiv:{
            position: 'relative',
            left: '36px',
            width:'100%'
        }
    }
}));
//import { userActions } from '../_actions';
//console.log(GQLogo,'logoss');
function Login(props) {

    const history = useHistory();
    const classes = useStyles();
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });

    const { t, i18n } = useTranslation('common');
    const [submitted, setSubmitted] = useState(false);
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

        setSubmitted(true);
        if (username && password) {
            // get return url from location state or default to home page
            const { from } = location.state || { from: { pathname: "/" } };
            //dispatch(userActions.login(username, password, from));
            history.push('/home');
        }
    }

    return (
        <Container className="mt-100">
            <Row className={classes.loginLogoDiv}>
                <Col sm="12" md="2" className="p-0 ml-4"><Link to="/login"><img src={GQLogo} alt="GQLogo" /></Link></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col sm="12" md="6" className="mb-5 mt-4">
                    <form name="form" onSubmit={handleSubmit} className={classes.loginDiv}>

                        <h5 className="loginTitle">{t('loginAccount')}</h5>
                        <div className="form-group">
                            <TextField id="outlined-basic" label={t('username')} variant="outlined" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                            {submitted && !username &&
                                <div className="invalid-feedback">{t('usernameReq')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <TextField id="outlined-basic" label={t('password')} variant="outlined" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                            {submitted && !password &&
                                <div className="invalid-feedback">{t('passwordReq')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <Button variant="contained" color="primary" className="float-right loginSubmit text-capitalize" type="submit">
                                {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
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