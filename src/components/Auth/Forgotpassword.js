import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import {useTranslation} from "react-i18next";



//import { userActions } from '../_actions';
//console.log(GQLogo,'logoss');
function Forgotpassword() {
    const {t, i18n} = useTranslation('common');
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
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
        }
    }

    return (
        <Container className="mt-100">

            <Row className="justify-content-md-center">
                <Col sm="12" md="6" className="p-0"><img src={GQLogo} alt="GQLogo" /></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col sm="12" md="6" className="logoDiv">
                    <form name="form" onSubmit={handleSubmit}>

                        <h5 className="login-title">{t('pwdRecovery')}</h5>
                        <p className="login-title">{t('pwdRecoveryTitle')}</p>
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
                            <Button variant="contained" color="primary" className="float-right login-submit text-capitalize" type="submit">
                                {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                {t('submit')}
                            </Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>

    );
}

export default Forgotpassword;