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
        '& p':{
            fontSize: '15px'
        }
    },
    '@media (min-width: 780px)' : {
        newsContent:{
            marginLeft: '1.5rem',
            paddingLeft: '42px',
            borderLeft: '1px solid #d8d4d4',
        },
        newsMostUsedContent:{
            marginLeft: '0',
            paddingLeft: '0',
            borderLeft: 'none',
            padding: '12px 0'
        }
    }
}));
function Newsupdate(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);
    console.log(props,'isMostUsedPanel');
    return (
        
        <div className={classes.newsContent+' '+(props.isMostUsedPanel ? classes.newsMostUsedContent : '')}>
            <h5 className="appTextColor"><b>{t('newsandupdates')}</b></h5>
            <p className={"appTextColor"+' '+(props.isMostUsedPanel ? 'ml-2 mt-4' : '')}>2021 Jan 21 <b>Patent Family Updates – </b>The GenomeQuest content team has streamlined the patent family assignment process to increase accuracy and increase update frequency. The new process has resulted in a significant reduction of singletons, updates for newdocuments are now done weekly. Please contact support@gqlifesciences.com with questions or comments.</p>
            <p className={"appTextColor"+' '+(props.isMostUsedPanel ? 'ml-2 ' : '')}>2020 Oct 27 <b>Antibody Module – </b>The new module has been released! Please join us in a <a href='#' onClick={e => e.preventDefault()}>webinar</a> on Nov ember 10th to learn about streamlining your antibody searches.</p>
        </div>

    );
}

export default Newsupdate;