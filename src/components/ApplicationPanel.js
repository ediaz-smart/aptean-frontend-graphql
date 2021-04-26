import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    savedForm: {
        backgroundColor: '#f5f2f2',
        height: '500px',
        paddingLeft : "70px",
        paddingTop: "34px"
    },
    anchorTag: {
        textDecoration: 'none',
        color: "#74a4d8"
    },
    p:{
        color: "#74a4d8",
        size: "20px"
      },
      textHeading: {
        fontWeight: "700 !important",
        color: "#8e8c8c",
        marginBottom: "5px"
      },
      columnPadding: {
          paddingLeft: "27px",
          paddingTop: "20px"
      },
      pTagMargin: {
          marginBottom: "0px",
          fontWeight: "500"
      },
      applicationPanelRow: {
          marginBottom: "15px"
      }
}));

function ApplicationPanel() {
    const { t, i18n } = useTranslation('common');

    const classes = useStyles();

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

    return (
        <div>
            <Row>
                <Col md="4" className={classes.savedForm}>
                    <p className={classes.textHeading}>{t('savedSearchForms')}</p>
                    <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('ftoMrnaDefaults')}</a></p>
                    <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('domainCheckSearch')}</a></p>
                    <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('primerFto')}</a></p>
                    <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('more')}</a></p>
                </Col>
                <Col md="4" className={classes.columnPadding}>
                    <p className={classes.textHeading}>{t('sequenceSearch')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9">
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('ipSequence')}</a></p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('sequenceVariation')}</a></p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('antibodySequence')}</a></p>
                        </Col>
                    </Row>
                    <p className={classes.textHeading}>{t('documentSearch')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9" className={classes.anchorTag}>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('patentFullText')}</a></p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('patentNumbers')}</a></p>
                        </Col>
                    </Row>
                    <p className={classes.textHeading}>{t('sequenceDatabases')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9" className={classes.anchorTag}>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('browseDatabases')}</a></p>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('personalDatabases')}</a></p>
                        </Col>
                    </Row>
                </Col>
                <Col md="4" className={classes.columnPadding}>
                    <p className={classes.textHeading}>{t('searchResults')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9" className={classes.anchorTag}>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('allSearchResults')}</a></p>
                        </Col>
                    </Row>
                    <p className={classes.textHeading}>{t('sequenceTools')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9" className={classes.anchorTag}>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('alignSequencesDirectly')}</a></p>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('convertSequenceFormats')}</a></p>
                        </Col>
                    </Row>
                    <p className={classes.textHeading}>{t('myAccount')}</p>
                    <Row className={classes.applicationPanelRow}>
                        <Col md="3"><AccessAlarm style={{ fontSize: 60 }} /></Col>
                        <Col md="9" className={classes.anchorTag}>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('accountInformation')}</a></p>
                        <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">{t('changePassword')}</a></p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>

    );
}

export default ApplicationPanel;