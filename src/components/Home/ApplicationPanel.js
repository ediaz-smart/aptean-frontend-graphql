import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '30px auto',
        minHeight: '360px',
        borderBottom: '1px solid #cec7c7'
    },
    savedForm: {
        backgroundColor: '#f5f2f2',
        paddingLeft: "30px",
        paddingTop: "34px",
        height:'100%'
    },
    anchorTag: {
        textDecoration: 'none',
        color: "#008EC5"
    },
    p: {
        color: "#008EC5",
        size: "20px"
    },
    textHeading: {
        fontWeight: "700 !important",
        marginBottom: "5px"
    },
    columnPadding: {
        paddingTop: '5px',
        paddingLeft: '20px'
    },
    pTagMargin: {
        marginBottom: "0px",
        fontWeight: "500"
    },
    applicationPanelRow: {
        marginBottom: "15px",
        minHeight: '70px'
    },
    appIcon:{
        fontSize: '50px',
        color: '#5A6868'
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
        <div className={classes.grow}>
            {/* <Container className="p-0 m-5"> */}
                <Row>
                    <Col md="3" sm="12" className="mb-3">
                        <div className={classes.savedForm}>
                            <p className={'appTextColor '+classes.textHeading}>{t('savedSearchForms')}</p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('ftoMrnaDefaults')}</a></p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('domainCheckSearch')}</a></p>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('primerFto')}</a></p>

                            <br></br>
                            <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('more')}</a></p>
                        </div>

                    </Col>
                    <Col md="4" sm="12" className={classes.columnPadding}>
                        <p className={'appTextColor '+classes.textHeading}>{t('sequenceSearch')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" sm="12"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" sm="12">
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('ipSequence')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('sequenceVariation')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('antibodySequence')}</a></p>
                            </Col>
                        </Row>
                        <p className={'appTextColor '+classes.textHeading}>{t('documentSearch')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" className={classes.anchorTag}>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('patentFullText')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('patentNumbers')}</a></p>
                            </Col>
                        </Row>
                        <p className={'appTextColor '+classes.textHeading}>{t('sequenceDatabases')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" className={classes.anchorTag}>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('browseDatabases')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('personalDatabases')}</a></p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="4" sm="12" className={classes.columnPadding}>
                        <p className={'appTextColor '+classes.textHeading}>{t('searchResults')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" className={classes.anchorTag}>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('allSearchResults')}</a></p>
                            </Col>
                        </Row>
                        <p className={'appTextColor '+classes.textHeading}>{t('sequenceTools')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" className={classes.anchorTag}>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('alignSequencesDirectly')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('convertSequenceFormats')}</a></p>
                            </Col>
                        </Row>
                        <p className={'appTextColor '+classes.textHeading}>{t('myAccount')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3"><AccessAlarm className={classes.appIcon} /></Col>
                            <Col lg="10" md="9" className={classes.anchorTag}>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('accountInformation')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:">{t('changePassword')}</a></p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            {/* </Container> */}

        </div>

    );
}

export default ApplicationPanel;