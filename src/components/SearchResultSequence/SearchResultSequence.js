import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from "react-dom";
import { useHistory,useParams } from 'react-router-dom';
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


import seqSearchImg from '../../assets/image/seqSearch.png';
import resultshareImg from '../../assets/image/resultshare.png';
import alertImg from '../../assets/image/alert.png';
import searchResultImg from '../../assets/image/searchResult.png';
import notesImg from '../../assets/image/notes.png';
import TextInput from '../../shared/Fields/TextInput';
import searchResSequence from '../../services/searchResSequence';



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
    failedTextColor:{
        color: '#e17a47 !important'
    },
    content:{
        fontSize: '14px !important',
        lineHeight: '25px',
        color: '#4a5050'
    },
    rowHeight:{
        height:'8%'
    }
}));
const columns = [
    {
        name: "",
        selector: "date"
    },
    {
        name: "",
        selector: "result"
    },
    {
        name: "",
        selector: "report"
    },
    {
        name: "",
        selector: "id"
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
    const [techincalData, setTechincalData] = useState();
    const { workflowId } = useParams();

    // reset login status
    useEffect(async () => {
        const getSummaryResponse = await searchResSequence.getSequenceSummary(workflowId);
        const getShareResponse = await searchResSequence.getSequenceShare(workflowId);
        const getAlertResponse = await searchResSequence.getSeqAlert(workflowId);
        const getTechnicalResponse = await searchResSequence.getSeqTechnical(workflowId);
        console.log(getAlertResponse,'getAlertResponse')
        if(getSummaryResponse && getSummaryResponse.response_status == 0)
        {
            setSeqSummary(getSummaryResponse.response_content);
        }
        if(getAlertResponse && getAlertResponse.response_status == 0)
        {
            setAlarmSetting(getAlertResponse.response_content);
        }
        if(getShareResponse && getShareResponse.response_status == 0)
        {
            // Getting Shared Members Name
            let {gq_user_id,write_sharee_id,read_sharee_id} = getShareResponse.response_content.SUBJECT;
            if(gq_user_id == write_sharee_id == read_sharee_id){
                setSeqShare('');
            }else {
                let user_candidates = getShareResponse.response_content.user_candidates;
                let group_candidates = getShareResponse.response_content.group_candidates;
                let seat_candidates = getShareResponse.response_content.seat_candidates;
                let universal_team = getShareResponse.response_content.universal_team;
                let team_candidates = getShareResponse.response_content.team_candidates;
                let userIds = [write_sharee_id,read_sharee_id];
                let sharedNames = [];
                let sharedObj = [];
                userIds.map(function(value,key){
                    if(user_candidates && user_candidates[value])
                    {
                        sharedNames.push(user_candidates[value].full_name);
                        sharedObj.push(user_candidates[value]);
                    }
                    if(group_candidates && group_candidates[value])
                    {
                        sharedNames.push(group_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if(seat_candidates && seat_candidates[value])
                    {
                        sharedNames.push(seat_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if(team_candidates && team_candidates[value])
                    {
                        sharedNames.push(team_candidates[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                    if(universal_team && universal_team[value])
                    {
                        sharedNames.push(universal_team[value].text_label);
                        sharedObj.push(user_candidates[value]);
                    }
                });
                // console.log(sharedObj,'sharedObj');
                let sharedData = {};
                sharedData['sharedNameObj'] = sharedObj;
                if(sharedNames.length > 0)
                {
                    const last = sharedNames.pop();
                    const shareDatas = sharedNames.join(', ') + ' and ' + last;
                    sharedData['sharedNames'] = shareDatas;
                    
                    
                }else {
                    sharedData['sharedNames'] = '';
                }
                setSeqShare(sharedData);
                // setTimeout(() => {
                //     console.log(seqShare,'seqShare');
                // }, 3000);
            }
            
        }
        
    }, []);
    const updateState = useCallback(state => setSelectData(state));
    function updateVal(state) {
        console.log(state, 'state');
        if (state.selectedCount > 0) {
            setDisableDelete(false);
        } else {
            setDisableDelete(true);
        }
        setSelectData(state)
    }
    const handleScroll = (e,id)=>{
        document.getElementById(id).scrollIntoView();
        // const item = ReactDOM.findDOMNode(id);
        // var element = document.querySelector("#"+id);
        // element.scrollIntoView();
        // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
        e.preventDefault();
        // window.scrollTo(myElement);
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
                    <h6 className={"appTextColor loginTitle"}>{t('ImmunoglobulinVariationsFor')} Steve​</h6>
                    <Row>
                        <Col lg="1" md="1" sm="12" className="pr-0 text-center">
                            <img src={seqSearchImg} alt="Immunoglobulin variations for Steve​"  />
                        </Col>
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Typography className={(seqSummary ? 'd-block':'d-none')}>
                                {/* <img className="float-left mx-3" src={seqSearchImg} alt={t('ImmunoglobulinVariationsFor')}/> */}
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /><span>{t('searchLaunchTitle')} {seqSummary && seqSummary.create_time ? format(new Date(seqSummary.create_time), 'dd-MMM-yyyy'):''} {t('by')} {seqSummary && seqSummary.sdb__owner_full_name}.​</span></Typography>
                            <Typography className={(seqShare ? 'd-block':'d-none')}>
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> <span>{t('sharedWithTitle')} {seqShare && seqShare.sharedNames} 
                                <a href="#" onClick={(e)=>handleScroll(e,'resultSharing')}>({t('shareSettings')}).</a></span></Typography>
                            <Typography className={(alarmSetting && alarmSetting.is_created ? 'd-block':'d-none')}>
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> <span>{t('alarmSettingText1')} {alarmSetting && alarmSetting.email}.{t('alarmSettingText2')} <a href="#" onClick={(e)=>handleScroll(e,'alertSettings')}>({t('alertSettings')}).</a></span></Typography>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lg="12" md="12" sm="12" className="pr-0 content">
                            <h6 className={"appTextColor loginTitle"}>{t('query')}</h6>
                            <Typography className="appTextFont ml-3"><Link className={"appLinkColor"} href="#" onClick={(e) => e.preventDefault()}>These {seqSummary && seqSummary.sdb_nb_db} <span className="text-lowercase">{seqSummary && seqSummary.sdb_seq_type}</span> sequences</Link> {t('usedInSearch')}.​</Typography>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>{t('subjDB')}</h6>
                            
                            {seqSummary && seqSummary.sdb_db_list && Object.keys(seqSummary.sdb_db_list).map((dbVal, i) => {
                                
                                    // Return the element. Also pass key     
                                    return (
                                        <Row className={"ml-1 "+classes.rowHeight} key={i}>
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
                                            <Col lg="2" md="2" className={"pr-0 "+(classes.content)}>
                                                
                                                {(seqSummary.sdb_db_list[dbVal].update_time == seqSummary.sdb_db_list[dbVal].current_update_time) && 
                                                    <Typography className="text-success">{t('currentVersion')}</Typography>
                                                }
                                                {(seqSummary.sdb_db_list[dbVal].update_time != seqSummary.sdb_db_list[dbVal].current_update_time) && 
                                                    <Typography className="failedTextColor">{t('updateAvailable')}</Typography>
                                                }
                                                ​​
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
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> Search Id 4512653 consumes 15.90 Mb of server disk space​.​</Typography>
                            </Col>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"} id="resultSharing">{t('resSharing')}​</h6>
                    <Row>
                        <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={resultshareImg} alt={t('resSharing')}/>
                        </Col>
                        <Col lg="8" md="9" sm="12" className="p-0 content">
                            <Row>
                                {/* <img className="float-left mx-3" src={resultshareImg} alt="Result sharing"  /> */}
                                <Typography className="mb-2">
                                    The following people have access to this result. <Link className={"appLinkColor"} href="#" onClick={(e) => e.preventDefault()} >Add more …​</Link></Typography>
                            </Row>
                            {seqShare && seqShare.sharedNameObj.length >0 && seqShare.sharedNameObj.map((dbVal, i) => {
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
                                        This result is repeated automatically once a month. New results are emailed to Heather.Leeman@Aptean.com. ​</Typography>
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
                                data={searchResultData}
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
                                data={searchResultData}
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
                        <Col lg="12" md="12" className={"mt-3 px-5" + (searchResultData.length > 0 ? ' d-block' : ' d-none')} md="6">
                            <Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'deleteBtnColor')} type="submit">{t('deleteSelected')}</Button>
                            <Button color="primary" variant="contained" className={"text-capitalize mr-2 loginSubmit"} type="submit">{t('delPrevResult')}</Button>

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
                                        />
                                    </div>
                                </Col>
                                <Col md="2"></Col>
                            </Row>
                            <Row>
                                <Col lg="10" md="10" sm="10" className="pr-0 content float-right">
                                    <Button color="primary" variant="contained" className={"text-capitalize mr-2 loginSubmit float-right"} type="submit">{t('saveChanges')}</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default SearchResultSequence;
