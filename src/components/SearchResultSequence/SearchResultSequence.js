import React, { useState, useCallback, useEffect, Fragment } from 'react';
import ReactDOM from "react-dom";
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DataTable from "react-data-table-component";
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal'


import seqSearchImg from '../../assets/image/seqSearch.png';
import resultshareImg from '../../assets/image/resultshare.png';
import alertImg from '../../assets/image/alert.png';
import searchResultImg from '../../assets/image/searchResult.png';
import notesImg from '../../assets/image/notes.png';
import TextInput from '../../shared/Fields/TextInput';
import searchResSequence from '../../services/searchResSequence';
import SearchManagementService from '../../services/searchmanagement'
import Constant from '../../helpers/constant';
import { url } from '../../reducers/url';



const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '130px auto 28px',
        minHeight: '260px',
        // borderBottom: '1px solid #cec7c7',
        padding: '23px 16px 14px',
        border: '1px solid #cec7c7',
        borderRadius: '3px'
    },
    headerPipe: {
        margin: '0 10px'
    },
    listStyle: {
        listStyleType: 'none',
        padding: '0 10px'
    },
    failedTextColor: {
        color: '#e17a47 !important'
    },
    content: {
        fontSize: '14px !important',
        lineHeight: '25px',
        color: '#4a5050'
    },
    rowHeight: {
        height: '8%'
    }
}));
const columns = [
    {
        name: "",
        selector: "date"
    },
    {
        name: "",
        selector: "results"
    },
    {
        name: "",
        selector: "report"
    },
    {
        name: "",
        selector: "searchId"
    }
];
const searchResultData = [{
    date: "5-Feb-2021",
    result: "1500 Alignments",
    report: "Report",
    id: "Search ID:123"
}, {
    date: "5-Feb-2021",
    result: "1500 Alignments",
    report: "Report",
    id: "Search ID:124"
}, {
    date: "5-Feb-2021",
    result: "1500 Alignments",
    report: "Report",
    id: "Search ID:125"
}]
const customStyles = {
    rows: {
        style: {
            minHeight: '50px', // override the row height
        }
    },
    subHeader: {
        style: {
            minHeight: '0 !important'
        },
    },
    headRow: {
        style: {
            border: '0 !important',
            display: 'none',
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            borderLeft: '1px solid #0606061f',
            '&:first-child': {
                borderLeft: '0',
            },
            fontWeight: 'bold',
            color: '#4a5050'
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
            borderLeft: '1px solid #0606061f',
            // borderBottom: '1px solid #0606061f',
            '&:first-child': {
                borderLeft: '0',
            },
            display: 'grid'
        },

    },
};
const isIndeterminate = indeterminate => indeterminate;
const selectableRowsComponentProps = { indeterminate: isIndeterminate };
function SearchResultSequence() {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const history = useHistory();
    const [selectData, setSelectData] = useState();
    const [disableDelete, setDisableDelete] = useState(true);
    const [seqSummary, setSeqSummary] = useState();
    const [seqShare, setSeqShare] = useState();
    const [alarmSetting, setAlarmSetting] = useState();
    const [alertData, setAlertData] = useState([]);
    const [alertRedoData, setAlertRedoData] = useState([]);
    const [redoData, setRedoData] = useState([]);
    const [techincalData, setTechincalData] = useState();
    const { workflowId } = useParams();
    const [notes, setNotes] = useState();
    const updateState = useCallback(state => setSelectData(state));
    //using state
    const userInfo = useSelector(state => state.setUserInfo);

    // Table Data Delete Variable
    const [confirmContent, setConfirmContent] = useState(true);
    const [delLoaderContent, setDelLoaderContent] = useState(false);
    const [errorContent, setErrorContent] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [termsDisable, setTermsDisable] = React.useState(false);
    const [deleteType, setDeleteType] = React.useState('single');

    // reset login status
    useEffect(async () => {
        getSummaryResp();
        getShareResp();
        getAlertResp();
        getAlertRedoResp();
        // console.log(userInfo, 'userInfo');

    }, []);
    const getSummaryResp = async () => {
        const getSummaryResponse = await searchResSequence.getSequenceSummary(workflowId);
        if (getSummaryResponse && getSummaryResponse.response_status == 0) {
            let diskUsage = getSummaryResponse.response_content.disk_usage;
            let usedSpace = 0;
            if (diskUsage) {
                usedSpace = (diskUsage / (1024 * 1024));
                usedSpace = usedSpace.toFixed(2);
            }
            getSummaryResponse.response_content['usedSpace'] = usedSpace;
            if(getSummaryResponse.response_content.description)
            {
                setNotes(getSummaryResponse.response_content.description);
            }
            setSeqSummary(getSummaryResponse.response_content);

        }
    }
    const getAlertResp = async () => {
        const getAlertResponse = await searchResSequence.getSeqAlert(workflowId);
        if (getAlertResponse && getAlertResponse.response_status == 0) {
            setAlarmSetting(getAlertResponse.response_content);
        }
    }
    const getShareResp = async () => {
        const getShareResponse = await searchResSequence.getSequenceShare(workflowId);
        if (getShareResponse && getShareResponse.response_status == 0) {
            // Getting Shared Members Name
            let { gq_user_id, write_sharee_id, read_sharee_id } = getShareResponse.response_content.SUBJECT;
            if (gq_user_id == write_sharee_id == read_sharee_id) {
                setSeqShare('');
            } else {
                let user_candidates = getShareResponse.response_content.user_candidates;
                let group_candidates = getShareResponse.response_content.group_candidates;
                let seat_candidates = getShareResponse.response_content.seat_candidates;
                let universal_team = getShareResponse.response_content.universal_team;
                let team_candidates = getShareResponse.response_content.team_candidates;
                let userIds = [write_sharee_id, read_sharee_id];
                let sharedNames = [];
                let sharedObj = [];
                userIds.map(function (value, key) {
                    if (user_candidates && user_candidates[value]) {
                        sharedNames.push(user_candidates[value].full_name);
                        sharedObj.push(user_candidates[value]);
                    }
                    if (group_candidates && group_candidates[value]) {
                        sharedNames.push(group_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if (seat_candidates && seat_candidates[value]) {
                        sharedNames.push(seat_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if (team_candidates && team_candidates[value]) {
                        sharedNames.push(team_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if (universal_team && universal_team[value]) {
                        sharedNames.push(universal_team[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                });
                // console.log(sharedObj,'sharedObj');
                let sharedData = {};
                sharedData['sharedNameObj'] = sharedObj;
                if (sharedNames.length > 0) {
                    const last = sharedNames.pop();
                    const shareDatas = sharedNames.join(', ') + ' and ' + last;
                    sharedData['sharedNames'] = shareDatas;


                } else {
                    sharedData['sharedNames'] = '';
                }
                setSeqShare(sharedData);
                // setTimeout(() => {
                //     console.log(seqShare,'seqShare');
                // }, 3000);
            }

        }
    }
    const getAlertRedoResp = async () => {
        const getAlertRedoResponse = await searchResSequence.getAlertRedo(workflowId);
        if (getAlertRedoResponse && getAlertRedoResponse.response_status == 0 && getAlertRedoResponse.response_content.relatives.length > 0) {
            setAlertRedoData(getAlertRedoResponse.response_content.relatives);
            let redoArr = [], alertArr = [];
            let type = 'Alignments';
            getAlertRedoResponse.response_content.relatives.map(function (values, key) {
                let tempObj = {};
                tempObj['date'] = values.create_time ? format(new Date(values.create_time), 'dd-MMM-yyyy') : null;
                const regex = /Fulltext/i;
                let type = 'Alignments';
                if (values.type !== null && values.type !== '') {
                    const found = values.type.match(regex);
                    if (found && found.length > 0) {
                        type = 'Documents';
                    }
                    let mostRecentTypeUrl = url.mostRecentTypeUrl
                    mostRecentTypeUrl = mostRecentTypeUrl.replace('**', values.id);
                    let typeUrl = process.env.REACT_APP_BASE_URL + mostRecentTypeUrl;
                    if (values.type !== 'GqFolder') {
                        if (values.status == 'STILL_RUNNING') {
                            tempObj['results'] = '';
                        }
                        else if (values.status == 'FAILED') {
                            tempObj['results'] = <a href="#" className={"failedIconColor"} onClick={(e) => e.preventDefault()}>Search Failed</a>;
                        }
                        else {
                            tempObj['results'] = <a href={typeUrl} target="_blank">{values.total_nb_results} {type}</a>
                        }
                    } else {
                        tempObj['results'] = <a href="#" onClick={(e) => e.preventDefault()}>Empty</a>;
                    }
                } else {
                    tempObj['results'] = <a href="#" onClick={(e) => e.preventDefault()}>Empty</a>;
                }
                let mostRecentClassicUrl = url.mostRecentClassicUrl
                mostRecentClassicUrl = mostRecentClassicUrl.replace('**', values.id);
                let classicLink = process.env.REACT_APP_API_URL + mostRecentClassicUrl
                if (values.status == 'FAILED') {
                    tempObj["report"] = '';
                } else {
                    if (values.type != '') {
                        if (values.type == "GqWfABIpSearch") {
                            let mostRecentReportUrl = url.mostRecentReportUrl
                            mostRecentReportUrl = mostRecentReportUrl.replace('**', values.id);
                            let reportLink = process.env.REACT_APP_BASE_URL + mostRecentReportUrl
                            tempObj["report"] = <Fragment><a href={reportLink} target="_blank">Report</a>
                                <span className="mx-2">|</span>
                                <a href={classicLink} target="_blank">Classic</a>
                            </Fragment>
                        } else if (values.type !== "GqFolder") {
                            tempObj["report"] = <Fragment>
                                <a href={classicLink} target="_blank">Classic</a>
                            </Fragment>
                        } else {
                            tempObj["report"] = '';
                        }
                    } else {
                        tempObj["report"] = '';
                    }
                }
                if(userInfo && userInfo.current_user.user_class_name === "adminium")
                {
                    tempObj["searchId"] = <a href="#" onClick={(e)=>downloadTechLog(e,values.id)}>Search id {values.id}</a>;
                }else {
                    tempObj["searchId"] = <span>Search id {values.id}</span>;
                }
                tempObj["id"] = values.id;
                if (values.credit_code == "redo") {
                    redoArr.push(tempObj);
                } else {
                    alertArr.push(tempObj);
                }
            });
            // console.log(redoArr,'redoArr');
            setRedoData(redoArr);
            setAlertData(alertArr);
        }
    }
    function updateVal(state) {
        // console.log(state, 'state');
        if (state.selectedCount > 0) {
            setDisableDelete(false);
        } else {
            setDisableDelete(true);
        }
        setSelectData(state)
    }
    const handleScroll = (e, id) => {
        document.getElementById(id).scrollIntoView();
        // const item = ReactDOM.findDOMNode(id);
        // var element = document.querySelector("#"+id);
        // element.scrollIntoView();
        // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
        e.preventDefault();
        // window.scrollTo(myElement);
    }
    const closeModal = () => {
        setModalShow(false);
        setTermsDisable(false);
        setConfirmContent(true);
        setErrorContent(false);
    }
    const deleteSearch = async (type) => {
        setDeleteType(type)
        if(type == "single")
        {
            if (selectData && selectData.selectedCount > 0) {
                setModalShow(true);
                setConfirmContent(true);
            }
        }else {
            setModalShow(true);
            setConfirmContent(true);
        }
        
    }
    const deleteConfirm = async () => {
        setModalShow(false);
        setConfirmContent(false);
        var getIds = '';
        if(deleteType == "single")
        {
            getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
        }else {
            getIds = alertRedoData.map(function (a) { return a.id; }).join(',');
        }
        // console.log(getIds,'getIds');
        const deleteResp = await SearchManagementService.deleteSearchResult(getIds, history);
        setModalShow(true);
        setDelLoaderContent(true);
        if (deleteResp && deleteResp.response_content && deleteResp.response_content.success.length > 0) {
            toast.success('Deleted Successfully');
            getAlertRedoResp();
        } else {
            toast.error('Unable to Delete');
            setModalShow(true);
            setDelLoaderContent(false);
            setErrorContent(true);
        }
    }
    const updateNotes = async()=>{
        if(notes){
            const getnotesResponse = await searchResSequence.updateSeqNotes(workflowId,notes);
            if (getnotesResponse && getnotesResponse.response_status == 0) {
                toast.success('Notes Updated Successfully');
            }else {
                toast.error('Update in Error.');
            }
            // console.log(getnotesResponse,'getnotesResponse');
        }else {
            toast.error('Please Enter Notes to Save Changes.');
        }
    }
    const downloadQuerySeq = async(e)=>{
        e.preventDefault()
        await searchResSequence.downloadQuerySeq(workflowId);
    }
    const downloadTechLog = async(e,workflowId)=>{
        e.preventDefault()
        await searchResSequence.getSeqTechnical(workflowId);
        // console.log(getTechResp,'getTechResp');
    }
    return (
        <div className={classes.grow}>
            <Row>
                <Col lg="12" md="12" sm="12" className="mb-5">
                    <Typography className={classes.root + " float-right"}>
                        <span className={"appTextColor appLinkFont"} title={t('auditTrial')}>
                            {t('auditTrial')}
                        </span>
                        <span className={classes.headerPipe + " appTextColor"}>|</span>
                        <Link href="#" title={t('resSharing')} className={"appLinkColor appLinkFont"} onClick={(e) => e.preventDefault()}>
                            {t('resSharing')}
                        </Link>
                        <span className={classes.headerPipe + " appTextColor"}>|</span>
                        <Link href="#" title={t('alertSetting')} className={"appLinkColor appLinkFont"} onClick={(e) => e.preventDefault()} >
                            {t('alertSetting')}
                        </Link>
                        <span className={classes.headerPipe + " appTextColor"}>|</span>
                        <Link href="#" title={t('searchHistory')} className={"appLinkColor appLinkFont"} onClick={(e) => e.preventDefault()}>
                            {t('searchHistory')}
                        </Link>
                        <span className={classes.headerPipe + " appTextColor"}>|</span>
                        <Link href="#" title={t('notes')} className={"appLinkColor appLinkFont"} onClick={(e) => e.preventDefault()}>
                            {t('notes')}
                        </Link>
                    </Typography>
                </Col>
                <Col lg="12" md="12" sm="12">
                    <h6 className={"appTextColor loginTitle"}>{t('ImmunoglobulinVariationsFor')} {seqSummary && seqSummary.sdb__owner_full_name}</h6>
                    <Row>
                        <Col lg="1" md="1" sm="12" className="pr-0 text-center">
                            <img src={seqSearchImg} alt="Immunoglobulin variations for" />
                        </Col>
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Typography className={(seqSummary ? 'd-block' : 'd-none')}>
                                {/* <img className="float-left mx-3" src={seqSearchImg} alt={t('ImmunoglobulinVariationsFor')}/> */}
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /><span>{t('searchLaunchTitle')} {seqSummary && seqSummary.create_time ? format(new Date(seqSummary.create_time), 'dd-MMM-yyyy') : ''} {t('by')} {seqSummary && seqSummary.sdb__owner_full_name}.​</span></Typography>
                            <Typography className={(seqShare ? 'd-block' : 'd-none')}>
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> <span>{t('sharedWithTitle')} {seqShare && seqShare.sharedNames}
                                    <a href="#" onClick={(e) => handleScroll(e, 'resultSharing')}>({t('shareSettings')}).</a></span></Typography>
                            <Typography className={(alarmSetting && alarmSetting.is_created ? 'd-block' : 'd-none')}>
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" />
                                <span>The search is repeated automatically {alarmSetting && alarmSetting.is_created && Constant['alertOptions'][alarmSetting.relaunch_interval]} with an email going to {alarmSetting && alarmSetting.email}.{t('alarmSettingText2')} <a href="#" onClick={(e) => handleScroll(e, 'alertSettings')}>({t('alertSettings')}).</a></span></Typography>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lg="12" md="12" sm="12" className="pr-0 content">
                            <h6 className={"appTextColor loginTitle"}>{t('query')}</h6>
                            <Typography className="appTextFont ml-3"><Link className={"appLinkColor"} href="#" onClick={(e)=>downloadQuerySeq(e)}>These {seqSummary && seqSummary.sdb_nb_db} <span className="text-lowercase">{seqSummary && seqSummary.sdb_seq_type}</span> sequences</Link> {t('usedInSearch')}.​</Typography>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>{t('subjDB')}</h6>

                            {seqSummary && seqSummary.sdb_db_list && Object.keys(seqSummary.sdb_db_list).map((dbVal, i) => {

                                // Return the element. Also pass key     
                                return (
                                    <Row className={"ml-1 " + classes.rowHeight} key={i}>
                                        <Col lg="8" md="8" className="pr-0 content">
                                            <Typography>
                                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> {seqSummary.sdb_db_list[dbVal].title}</Typography>
                                        </Col>
                                        <Col lg="2" md="2" className="pr-0 content">
                                            <Typography>
                                                {
                                                    seqSummary.sdb_db_list[dbVal].update_time ? format(new Date(seqSummary.sdb_db_list[dbVal].update_time), 'dd-MMM-yyyy') : ''
                                                }
                                            </Typography>
                                        </Col>
                                        <Col lg="2" md="2" className={"pr-0 " + (classes.content)}>

                                            {(seqSummary.sdb_db_list[dbVal].update_time == seqSummary.sdb_db_list[dbVal].current_update_time) &&
                                                <Typography className="text-success">{t('currentVersion')}</Typography>
                                            }
                                            {(seqSummary.sdb_db_list[dbVal].update_time != seqSummary.sdb_db_list[dbVal].current_update_time) &&
                                                <Typography className="failedTextColor">{t('updateAvailable')}</Typography>
                                            }

                                        </Col>
                                    </Row>
                                )
                            })
                            }
                            <br />
                            <h6 className={"appTextColor loginTitle"}>{t('searchStrategy')}</h6>
                            <Col lg="12" md="12" className="pr-0 content">
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                            </Col>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>{t('techData')}</h6>
                            <Col lg="12" md="12" className="pr-0 content">
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> 
                                    <div className={(userInfo && userInfo.current_user.user_class_name === "adminium" ? ' d-block':'d-none')}>
                                        <Link className={"appLinkColor"} href="#" onClick={(e)=>downloadTechLog(e,workflowId)}>Search Id {workflowId}</Link> consumes {seqSummary && seqSummary.usedSpace} Mb of server disk space​.​
                                    </div>
                                    <div className={(userInfo && userInfo.current_user.user_class_name !== "adminium" ? ' d-block':'d-none')}>
                                        <span className={"appLinkColor"+(userInfo && userInfo.current_user.user_class_name !== "adminium" ? 'd-block':'d-none')}>Search Id {workflowId}</span> consumes {seqSummary && seqSummary.usedSpace} Mb of server disk space​.​
                                    </div>
                                </Typography>
                            </Col>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"} id="resultSharing">{t('resSharing')}​</h6>
                    <Row>
                        <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={resultshareImg} alt={t('resSharing')} />
                        </Col>
                        <Col lg="8" md="9" sm="12" className="p-0 content">
                            <Row>
                                {/* <img className="float-left mx-3" src={resultshareImg} alt="Result sharing"  /> */}
                                <Typography className="mb-2">
                                    The following people have access to this result. <Link className={"appLinkColor"} href="#" onClick={(e) => e.preventDefault()} >Add more …​</Link></Typography>
                            </Row>
                            {seqShare && seqShare.sharedNameObj.length > 0 && seqShare.sharedNameObj.map((dbVal, i) => {
                                return (
                                    <Row key={i}>
                                        <Col lg="4" md="4" className="pr-0 content">
                                            <Typography >
                                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> {dbVal.full_name}</Typography>
                                        </Col>
                                        <Col lg="4" md="4" className="pr-0 content">
                                            <Typography ><Link className={"failedTextColor"} id={dbVal.id} href="#" onClick={(e) => e.preventDefault()}>Remove</Link></Typography>
                                        </Col>
                                    </Row>
                                )
                            })
                            }
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"}>{t('alertSetting')}​</h6>
                    <Row>
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Row>
                                <Col lg="8" md="8" className="pr-0 content">
                                    <img className="float-left mx-3" src={alertImg} alt={t('alertSetting')} />
                                    <Typography >
                                        This result is repeated automatically {alarmSetting && alarmSetting.is_created && Constant['alertOptions'][alarmSetting.relaunch_interval]}. New results are emailed to {alarmSetting && alarmSetting.is_created && alarmSetting.email}. ​</Typography>
                                </Col>
                                <Col lg="12" md="12" className="pr-0 content float-right">
                                    <Typography className={"float-right"}>
                                        <Link href="#" title={t('resSharing')} className={"appLinkColor appLinkFont"} onClick={(e) => e.preventDefault()}>
                                            Change Settings
                                        </Link>
                                        <span className={classes.headerPipe + " appTextColor"}>|</span>
                                        <Link href="#" title={t('resSharing')} className={"failedTextColor appLinkFont"} onClick={(e) => e.preventDefault()}>
                                            Remove Alert
                                        </Link>
                                    </Typography>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"}>{t('searchHistory')}</h6>
                    <Row>
                        {/* <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={searchResultImg} alt="Search History"  />
                        </Col> */}
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Row>
                                <Col lg="8" md="8" className="pr-0 content">
                                    <img className="float-left mx-3" src={searchResultImg} alt={t('searchHistory')} />
                                    <Typography >
                                        The following previous versions of this search are stored on our servers. Please consider deleting results that you no longer need.​​</Typography>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="12" md="12" className="pr-0 content float-right mt-3 ml-3">
                            <h6 className={"appTextColor loginTitle"} id="alertSettings">{t('alerts')}</h6>
                            <DataTable
                                columns={columns}
                                data={alertData}
                                defaultSortField="date"
                                defaultSortAsc={false}
                                sortable={false}
                                sortServer={true}
                                // sortIcon={<SortIcon />}
                                onSelectedRowsChange={updateVal}
                                noDataComponent={t('noSearchSubmit')}
                                customStyles={customStyles}
                                selectableRowsNoSelectAll
                                selectableRowsComponent={Checkbox}
                                selectableRowsComponentProps={selectableRowsComponentProps}
                                selectableRows
                                noHeader={true}
                                subHeader={true}
                            // onRowClicked={getRowData}
                            // onRowClicked={getRowData}
                            // clearSelectedRows={clearCheckedRow}
                            />
                        </Col>
                        <Col lg="12" md="12" className="pr-0 content float-right mt-3 ml-3">
                            <h6 className={"appTextColor loginTitle"}>{t('redos')}</h6>
                            <DataTable
                                columns={columns}
                                data={redoData}
                                defaultSortField="date"
                                defaultSortAsc={false}
                                sortable={false}
                                sortServer={true}
                                // sortIcon={<SortIcon />}
                                onSelectedRowsChange={updateVal}
                                noDataComponent={t('noSearchSubmit')}
                                customStyles={customStyles}
                                selectableRowsNoSelectAll
                                selectableRowsComponent={Checkbox}
                                selectableRowsComponentProps={selectableRowsComponentProps}
                                selectableRows
                                noHeader={true}
                                subHeader={true}
                            // onRowClicked={getRowData}
                            // onRowClicked={getRowData}
                            // clearSelectedRows={clearCheckedRow}
                            />
                        </Col>
                        <Col lg="12" md="12" className={"mt-3 px-5" + (redoData.length > 0 || alertData.length > 0 ? ' d-block' : ' d-none')} md="6">
                            <Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'deleteBtnColor')} type="submit" onClick={(e)=>deleteSearch('single')}>{t('deleteSelected')}</Button>
                            <Button color="primary" variant="contained" onClick={(e)=>deleteSearch('all')} className={"text-capitalize mr-2 loginSubmit"} type="submit">{t('delPrevResult')}</Button>

                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"}>{t('notes')}</h6>
                    <Row>
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Row>
                                <Col lg="8" md="8" className="pr-0 content">
                                    <img className="float-left mx-3" src={notesImg} alt={t('notes')} />
                                    <Typography >
                                        You can leave notes in the box below. Press “Save Changes” to remember them. Notes are visible to and editable by people you share this result with.
                                    ​</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md="10" className="mx-4 mt-2">
                                    <div className="form-group">
                                        <TextInput
                                            rowsMax="8"
                                            rows="8"
                                            multiline={true}
                                            fullWidth
                                            id="notes"
                                            name="notes"
                                            label={t('notesComment')}
                                            variant="outlined"
                                            value={notes || ''}
                                            onChange={(e)=>setNotes(e.target.value)}
                                        />
                                    </div>
                                </Col>
                                <Col md="2"></Col>
                            </Row>
                            <Row>
                                <Col lg="10" md="10" sm="10" className="pr-0 content float-right">
                                    <Button color="primary" variant="contained" className={"text-capitalize mr-2 loginSubmit float-right"} type="submit" onClick={updateNotes}>{t('saveChanges')}</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
                show={modalShow}
                size="md"
                aria-labelledby="contained-modal-title-vcente"
                centered
                contentClassName='modalPromptContent'
            >
                <Modal.Body className="appTextColor">
                    <div className={(confirmContent ? 'd-block' : 'd-none')}>
                        <p className="mb-3"><b>{t('deleteSelItems')}</b></p>
                        <p className="mb-3">{t('deleteSelItemContent')}</p>
                        <div className="mb-5 h-100">
                            <Checkbox
                                color="primary"
                                className={"float-left p-0 " + classes.checkBox}
                                name="acceptTerms"
                                id="acceptTerms"
                                checked={termsDisable}
                                onClick={() => setTermsDisable(!termsDisable)}
                            />
                            <p className={"float-left ml-1"}>{t('termsConditionText')}</p>
                        </div>
                        <div className={classes.footerDiv + " float-right"}>
                            <Button onClick={() => deleteConfirm()} color={(!termsDisable ? 'default' : 'secondary')} disabled={!termsDisable} className={"text-capitalize mr-2 " + ' ' + (!termsDisable ? 'disableBtnBorder' : 'deleteBtnColor')} variant="contained">{t('deleteSelItems')}</Button>
                            <Button onClick={closeModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('cancel')}</Button>
                        </div>
                    </div>
                    <div className={"text-center " + (delLoaderContent ? 'd-block' : 'd-none')}>
                        <p className="mb-3">{t('deletingItems')}</p>
                        <p className="mb-3">{t('takeTimeText')}</p>
                    </div>
                    <div className={(errorContent ? 'd-block' : 'd-none')}>
                        <p className="mb-3">{t('errorDeletTitle')}</p>
                        <p className="mb-3">{t('contactText1')} <a href="support@gqlifesciences.com" onClick={(e) => e.preventDefault()}>support@gqlifesciences.com</a> {t('contactText2')}</p>
                        <div className={classes.footerDiv + " float-right"}>
                            <Button onClick={closeModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('close')}</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SearchResultSequence;
