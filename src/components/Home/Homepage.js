import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Home from "../Home/Homepage"




function Homepage() {
    
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

   

    return (
       <div>
           <Home />
       </div>
    );
}

export default Homepage;