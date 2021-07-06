import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { AccessAlarm } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import account from '../../assets/image/account.png';
import docsearch from '../../assets/image/docsearch.png';
import searchResultImg from '../../assets/image/searchResult.png';
import seqDb from '../../assets/image/seqDb.png';
import seqSearch from '../../assets/image/seqSearch.png';
import seqTool from '../../assets/image/seqTool.png';
import { url } from '../../reducers/url';
import { useSelector } from 'react-redux';
import SavedSearch from '../../services/savedsearch';

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
        // textDecoration: 'none !important',
        // color: "#008EC5",
        // fontSize:"15px",
        // cursor: 'pointer',
        wordWrap: 'break-word'
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
        // fontWeight: "500",
        // '& span':{
        //     color: "#5A6868",
        // }
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
    const history = useHistory();
    const [searchFormsData, setSearchFormsData] = useState([]);

    const classes = useStyles();
    const userInfo = useSelector(state => state.setUserInfo);
    const [userData, setUserData] = useState();

    // reset login status
    useEffect(() => {
        (async () => {
          const result = await SavedSearch.getSavedSearchData();
          if(result && result.response_content && result.response_content.templates)
          {
            console.log(result.response_content,"result.response_content.template) result.response_content.template)");
            const dta = await result.response_content.templates;
             setSearchFormsData(dta);
          }
        })()
        if(userInfo && userInfo.current_user) {
            setUserData(userInfo);
        }
      }, []);
    function showString(str){
        let getLength = str.length;
        if(getLength > 23){
            str = str.substring(0,23)+' ...';
        }
        return str;
        
    }
    function accountInfoForm()
    {
        history.push('/accountinfo')
    }
    function changePasswordForm()
    {
        history.push('/changepassword')
    }
    function searchForm() {
       history.push('/search')
       
    }


    return (
        <div className={classes.grow}>
            {/* <Container className="p-0 m-5"> */}
                <Row>
                    <Col md="3" sm="12" className="mb-3">
                        <div className={classes.savedForm}>
                            <p className={'subHeading '+classes.textHeading}>{t('savedSearchForms')}</p>
                            {searchFormsData && searchFormsData.length > 0 && searchFormsData.map((dbVal, index) => {
                               if(index <= 8)
                               {
                                return (
                                    <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href='#' onClick={e => e.preventDefault()}> {dbVal.name} </a></p>

                                )
                               }
                            })
                            }
                            
                            <br></br>
                            <p className={classes.pTagMargin}><a className={"moreLink "+classes.anchorTag+' appLink'}  onClick={searchForm}>Manage ...</a></p>
                        </div>

                    </Col>
                    <Col md="4" sm="12" className={classes.columnPadding}>
                        <p className={'subHeading '+classes.textHeading}>{t('sequenceSearch')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" sm="12" className="pr-0">
                                {/* <AccessAlarm className={classes.appIcon} /> */}
                                <img src={seqSearch} alt="seqSearch" className="w-100" />
                            </Col>
                            <Col lg="10" md="9" sm="12">
                                <p className={classes.pTagMargin}>
                                    <Link to="/ipseqsearch" className={classes.anchorTag+' appLink'}>{t('ipSequence')}</Link>
                                </p>
                                <p className={classes.pTagMargin}>
                                    <Fragment>
                                    {userData && !userData.vmAccess && <span className={classes.pTagMargin + " bodyText"}>{t('sequenceVariation')}</span>}
                                   {userData && userData.vmAccess && <Link to="/ipseqvariation" className={classes.anchorTag+' appLink'}>{t('sequenceVariation')}</Link>}
                                   </Fragment>
                                </p>
                                <p className={classes.pTagMargin}>
                                    <Fragment>
                                    {userData && !userData.abAccess && <span className={classes.pTagMargin + " bodyText"}>{t('antibodySequence')}</span>}
                                   {userData && userData.abAccess && <Link to="/searchresantibody" className={classes.anchorTag+' appLink'}>{t('antibodySequence')}</Link>}
                                   </Fragment>
                                </p>
                            </Col>
                        </Row>
                        <p className={'subHeading '+classes.textHeading}>{t('documentSearch')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" className="pr-0">
                                <img src={docsearch} alt="docsearch" className="w-100" />
                            </Col>
                            <Col lg="10" md="9">
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href='#' onClick={e => e.preventDefault()}>{t('patentFullText')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href={url.stagePatentNumLink} target="_blank">{t('patentNumbers')}</a></p>
                            </Col>
                        </Row>
                        <p className={'subHeading '+classes.textHeading}>{t('sequenceDatabases')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" className="pr-0">
                                <img src={seqDb} alt="seqDb" className="w-100" />
                            </Col>
                            <Col lg="10" md="9">
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href={url.stageBrowserDBLink} target="_blank">{t('browseDatabases')}</a></p>
                                <p className={classes.pTagMargin}>
                                    <Link className={classes.anchorTag+' appLink'} to='/searchResult'>{t('personalDatabases')}</Link>
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="4" sm="12" className={classes.columnPadding}>
                        <p className={'subHeading '+classes.textHeading}>{t('searchResults')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" className="pr-0">
                                <img src={searchResultImg} alt="searchResult" className="w-100" />
                            </Col>
                            <Col lg="10" md="9">
                                <p className={classes.pTagMargin}>
                                    <Link className={classes.anchorTag+' appLink'} to='/searchResult'>{t('allSearchResults')}</Link>
                                </p>
                            </Col>
                        </Row>
                        <p className={'subHeading '+classes.textHeading}>{t('sequenceTools')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" className="pr-0">
                                <img src={seqTool} alt="seqTool" className="w-100" />
                            </Col>
                            <Col lg="10" md="9">
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href={url.stageAlignSequencesDirectly} target="_blank">{t('alignSequencesDirectly')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'} href='#' onClick={e => e.preventDefault()}>{t('convertSequenceFormats')}</a></p>
                            </Col>
                        </Row>
                        <p className={'subHeading '+classes.textHeading}>{t('myAccount')}</p>
                        <Row className={classes.applicationPanelRow}>
                            <Col lg="2" md="3" className="pr-0">
                                <img src={account} alt="account" className="w-100" />
                            </Col>
                            <Col lg="10" md="9" >
                                <p className={classes.pTagMargin}><a onClick={accountInfoForm}>{t('accountInformation')}</a></p>
                                <p className={classes.pTagMargin}><a className={classes.anchorTag+' appLink'}  onClick={changePasswordForm}>{t('changePassword')}</a></p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            {/* </Container> */}

        </div>

    );
}

export default ApplicationPanel;