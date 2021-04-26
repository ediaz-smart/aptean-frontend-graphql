import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    newsContent:{
        textAlign: 'justify',
        lineHeight: '22px',
    },
    '@media (min-width: 780px)' : {
        newsContent:{
            marginLeft: '1.5rem',
            paddingLeft: '42px',
            borderLeft: '1px solid #d8d4d4',
        }
    }
}));
function Newsupdate() {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    return (
        <div className={classes.newsContent}>
            <h5>{t('newsandupdates')}</h5>
            <p>2021 Jan 21 <b>Patent Family Updates – </b>The GenomeQuest content team has streamlined the patent family assignment process to increase accuracy and increase update frequency. The new process has resulted in a significant reduction of singletons, updates for newdocuments are now done weekly. Please contact support@gqlif esciences.com with questions or comments.</p>
            <p>2020 Oct 27 <b>Antibody Module – </b>The new module has been released! Please join us in a <a href="javascript">webinar</a> on Nov ember 10th to learn about streamlining your antibody searches.</p>
        </div>

    );
}

export default Newsupdate;