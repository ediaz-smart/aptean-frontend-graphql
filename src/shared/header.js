import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GQLogo from '../assets/image/GQLogo.png';
import { Row, Col, Navbar, Nav,NavItem } from 'react-bootstrap'

import {
    BrowserRouter as Router,
    useParams,
} from "react-router-dom";
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1),
        borderColor: theme.palette.success.main,
        color: theme.palette.success.main
    },
}));
function Header() {
    const classes = useStyles();
    return (

        <div >
            <Row>
                <Col>
                    <Router>
                        <Navbar expand="lg" sticky="top">
                            <Col sm="12" md="3">
                                <Navbar.Brand href="#home"><img src={GQLogo} alt="GQLogo" /></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" className="float-right" />
                            </Col>
                            <Col sm="12" md="9">
                                <Navbar.Collapse id="basic-navbar-nav" className="float-right">
                                    <NavItem className="mr-3">
                                    <AccountCircle className={classes.menuButton} /><span>Admin</span>
                                    </NavItem>
                                    <span className="headerPipe">|</span>
                                    <Nav.Link href="/">Logout</Nav.Link>
                                    <span className="headerPipe">|</span>
                                    <Nav.Link href="/">Documentation</Nav.Link>
                                    {/* <Nav className="mr-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/about-us">Contact Us</Nav.Link>
                                    <Nav.Link href="/contact-us">About Us</Nav.Link>
                                </Nav>
                                <Form inline>
                                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                                    <Button variant="outline-success">Search</Button>
                                </Form> */}
                                </Navbar.Collapse>
                            </Col>

                        </Navbar>
                        <br />
                    </Router>
                </Col>
            </Row>
        </div>
    );
}

export default Header;