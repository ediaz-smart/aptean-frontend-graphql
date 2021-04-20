import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));
//import { userActions } from '../_actions';
//console.log(GQLogo,'logoss');
function Login() {
    const classes = useStyles();
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
                <Col xs lg="12" className="justify-content-center text-center logo-div" ><img src={GQLogo} alt="GQLogo" /></Col>
                <Col xs lg="6" className="logoDiv">
                    <form name="form" onSubmit={handleSubmit}>

                        <h5 className="login-title">Login into your Account</h5>
                        <div className="form-group">
                            <TextField id="outlined-basic" label="Username" variant="outlined" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                            {submitted && !username &&
                                <div className="invalid-feedback">Username is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <TextField id="outlined-basic" label="Password" variant="outlined" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                            {submitted && !password &&
                                <div className="invalid-feedback">Password is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <Button variant="contained" color="primary" className="float-right login-submit text-capitalize" type="submit">
                                {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Submit
                                </Button>
                        </div>
                    </form>
                </Col>
                <Col xs lg="7">
                    <Link to="/forgot" className="btn btn-link ml-3">Forgot your login details</Link>

                </Col>
            </Row>
        </Container>

    );
}

export default Login;