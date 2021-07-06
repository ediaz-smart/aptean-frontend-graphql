import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import Newsupdate from '../../shared/newspdate';
import { url } from '../../reducers/url';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '0 auto 28px',
        minHeight: '260px',
        borderBottom: '1px solid #cec7c7',
        padding: '23px 0 5px'
    },
    savedSearchForm: {
        backgroundColor: '#f5f2f2',
        height: '250px',
        paddingTop: '30px',
        paddingLeft: '20px',
        overflowX: 'auto'
    },
    anchorTag: {
        textDecoration: 'none !important',
        color: "#008EC5"
    },
    p: {
        color: "#008EC5",
        size: "20px"
    },
    textHeading: {
        // fontWeight: "700 !important",
        marginBottom: "5px"
    },
    columnPadding: {
        paddingTop: '5px',
        paddingLeft: '20px'
    },
    pTagMargin: {
        marginBottom: "0px",
        // fontWeight: "500"
    },
    applicationPanelRow: {
        marginBottom: "15px",
        minHeight: '70px'
    },
    appIcon: {
        fontSize: '50px',
        color: '#5A6868'
    },
    '@media (min-width: 780px)': {
        newsContent: {
            marginLeft: '0',
            paddingLeft: '0',
            borderLeft: 'none',
        }
    }
}));

function MostUsedPanel() {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const userInfo = useSelector(state => state.setUserInfo);
    const [userData, setUserData] = useState();

    // reset login status
    useEffect(async () => {
        if (userInfo && userInfo.current_user) {
            setUserData(userInfo);
        }
    }, [userInfo]);
    // const stageUrlLink = "https://stage.genomequestlive.com/query?do=gqfetch.field_search&field=PN"
    return (
        <div className={classes.grow}>
            {/* <Container className="p-0 m-5"> */}
            <Row>
                <Col md="9" sm="12">
                    <Newsupdate isMostUsedPanel={true} />
                </Col>
                <Col md="3" sm="12" className={classes.columnPadding + ' mb-3'}>
                    <div className={classes.savedSearchForm}>
                        <p className={'subHeading ' + classes.textHeading}>{t('mostusedlink')}</p>
                        <p className={classes.pTagMargin}>
                            <Link to="/ipseqsearch" className="appLink">{t('ipSequence')}</Link>
                        </p>
                        <p className={classes.pTagMargin}><a className="appLink" href='#' onClick={e => e.preventDefault()}>{t('patentFullText')}</a></p>
                        <p className={classes.pTagMargin}>
                            <Fragment>
                                {userData && !userData.vmAccess && <span className={classes.pTagMargin + " bodyText"}>{t('sequenceVariation')}</span>}
                                {userData && userData.vmAccess && <Link to="/ipseqvariation" className="appLink">{t('sequenceVariation')}</Link>}
                            </Fragment>
                        </p>
                        <p className={classes.pTagMargin}>
                            <Fragment>
                                {userData && !userData.abAccess && <span className={classes.pTagMargin + " bodyText"}>{t('antibodySequence')}</span>}
                                {userData && userData.abAccess && <Link to="/searchresantibody" className="appLink">{t('antibodySequence')}</Link>}
                            </Fragment>
                        </p>
                        <p className={classes.pTagMargin}><a className="appLink" href={url.patentNumberLookup} target="_blank" >{t('patentnumlookup')}</a></p>
                    </div>
                </Col>
            </Row>
            {/* </Container> */}

        </div>

    );
}

export default MostUsedPanel;