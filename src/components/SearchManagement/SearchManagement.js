import DataTable from "react-data-table-component";
// import movies from "./movies";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import _, { get } from "lodash";
import InfoIcon from '@material-ui/icons/Info';
import RedoIcon from '@material-ui/icons/Redo';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CloseIcon from '@material-ui/icons/Close';

import TextInput from '../../shared/Fields/TextInput';
import HomeService from '../../services/home'
import SearchManagementService from '../../services/searchmanagement'
import FolderTreeMenu from '../../shared/FolderTreeStructure/FolderTreeMenu';
// import UtilsService from '../../helpers/utils';
import FolderIcon from '../../assets/image/folder.png';
import FolderIcons from '../../assets/image/folder1.png';

import FolderPlusIcon from '../../assets/image/folder-plus.png';
import Checkbox from "@material-ui/core/Checkbox";
import Constant from '../../helpers/constant';
import ProgressBar from '../../shared/ProgressBar/Progress';
import { url } from '../../reducers/url';
import CustomPagination from '../../shared/CustomPagination';
import MergeResults from '../MergeResults/MergeResults';
import FolderNameAlertModal from '../../shared/Modal/FolderNameAlertModal'


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '260px',
        padding: '23px 0 5px'
    },
    loginDiv: {
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    forgotLink: {
        marginTop: '10px',
        a: {
            color: '#008EC5'
        }
    },
    loginSubmitCancel: {
        backgroundColor: '#0182C5',
        borderColor: '#1F4E79',
        border: '1px solid #1F4E79',
        color: 'white',
        margin: '4px',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: '#0182C5',
            boxShadow: 'none',
        },
    },
    textHeading: {
        fontWeight: "700 !important",
        color: "#5A6868",
        fontSize: 'larger'
        // marginBottom: "400px",

    },
    modalClassConEF: {
        position: 'absolute',
        width: '96%',
        // height: '55%',
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)'
    },
    colorConDSIEF: {
        backgroundColor: 'gainsboro',
        marginTop: '35px',
        padding: '28px',
        // paddingTop: '28px',
        paddingBottom: '65px',
        marginLeft: '15px',
        marginRight: '15px',
        paddingRight: '10px',
        borderRadius: '5px',
    },
    columnPadding: {
        paddingTop: '20px',
        paddingLeft: '20px'
    },
    columnPaddings: {
        paddingTop: '5px',
        paddingLeft: '877px'
    },
    line: {
        borderBottom: '1px solid #E7E4E4',
        paddingBottom: '20px',
    },
    columnPad: {
        paddingTop: '45px',
    },
    projectTitle: {
        margin: '0px 4px',
        position: 'relative',
        top: '2px',
        fontSize: '15px',
        padding: '0'
    },
    projectListItem: {
        padding: '0.2rem 0.25rem !important',
        border: 'none !important'
    },
    projTitleActive: {
        backgroundColor: '#008EC5',
        color: '#fff',
        padding: '3px',
        borderRadius: '3px'
    },
    folderIcon: {
        width: '8%'
    },
    modalHeader: {
        borderBottom: 'none !important',
    },
    modalBody: {
        paddingBottom: '20px'
    },
    modal_body: {
        padding: '10px 0 0 0'
    },
    footerDiv: {
        padding: '0 10px'
    },
    checkBox: {
        transform: "scale(0.9)",
    },
    addNewLabel: {
        marginTop: '-20px',
        marginLeft: '31px'
    },
    addNewText: {
        marginTop: '-6px',
        marginLeft: '30px',
        height: '65px'
    },
    modalBoxContent: {
        maxHeight: '675px',
    },
    modalClassConDSI: {
        position: 'absolute',
        width: '96%',
        padding: '35px 15px 15px',
        // height: 'auto',
        // top: '30%',
        // left: '50%',
        right: 'auto',
        bottom: 'auto',
        // transform: 'translate(-50%, -50%)'
    },
    modalClassConDR: {
        position: 'absolute',
        width: '96%',
        height: '46%',
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)'
    },
    modaltext: {
        position: 'absolute',
        top: '10px',
        right: '10px'
    },

    colorConDSI: {
        backgroundColor: 'gainsboro',
        // marginTop: '-38px',
        padding: '28px',
        paddingTop: '28px',
        paddingBottom: '65px',
        // marginLeft: '7px',
        // marginRight: '7px',
        paddingRight: '10px',
        borderRadius: '5px',
    },
    footerDivDSI: {
        marginTop: '-26px',
        marginRight: ' -30px',
    },
    modalHeaderConMTF: {
        borderBottom: 'none !important',
        position: 'absolute',
        right: '0px',
        top: '0px',
        zIndex: '1'
    },

    modalClassConMTF: {
        position: 'relative',
        width: '96%',
        height: 'auto',
    },
    colorConMTF: {
        backgroundColor: 'gainsboro',
        padding: '15px 10px 50px 15px',
        margin: '30px 15px 15px',
        borderRadius: '5px',
    },
    footerDivMTF: {
        marginTop: '-8px',
    },
    modalClassContent: {
        position: 'absolute',
        width: '96%',
        height: 'auto',
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)'
    },
    colorContainer: {
        backgroundColor: 'gainsboro',
        marginTop: '-38px',
        // marginLeft: 0px;
        paddingTop: '28px',
        paddingBottom: '65px',
        marginLeft: '7px',
        marginRight: '7px',
        paddingRight: '10px',
        borderRadius: '5px',
    },
    popupFolderIcon: {
        width: '3% !important'
    },
    sharedFolderText: {
        fontSize: '14px',
    },
    selectedTitle: {
        backgroundColor: '#337ab7',
        color: '#fff',
        padding: '3px',
        borderRadius: '3px'
    },
    buttonStyle: {
        backgroundColor: '#EEEEEE !important',
        border: '1px solid #a2a2a3 !important',
        float: 'right',
        textTransform: 'none !important',
        marginTop: '4px !important',
        color: '#777777!important',
        boxShadow: 'none !important'
    }
}));

const customStyles = {
    rows: {
        style: {
            minHeight: '50px', // override the row height
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
            color: '#4a5050',
            justifyContent: 'start !important'
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
            display: 'grid',
            // textAlign: 'center',
            justifyContent: 'start !important'
        },

    },
};

const columns = [
    {
        name: "Type",
        selector: "type",
        center: true
    },
    {
        name: "Date",
        selector: "date",
        center: true
    },
    {
        name: "",
        selector: "info",
        // center: true
        cell: row => <div data-tag="allowRowEvents"><div style={{ textAlign: 'left' }}>{row.info}</div></div>,

    },
    {
        name: "Description",
        selector: "description",
        center: true,
        // cell: row => <div style={{ textAlign: 'left' }}>{row.description}</div>,
    },
    {
        name: "",
        selector: "results",
        style: {
            justifyContent: 'unset !important'
        }
    },
    {
        name: " ",
        selector: "report",
        center: true,
        style: {
            justifyContent: 'center !important'
        }
    }
];

const searchColumns = [
    {
        name: "Name",
        selector: "name",
        center: true,
        cell: row => <div data-tag="allowRowEvents"><div style={{ textAlign: 'left' }}>{row.name}</div></div>,

    },
    {
        name: " ",
        selector: "icon",
        center: true,
        width: "5%"
        // cell: row => <div style={{ width: '5px' }}>{row.icon}</div>,

    },
    {
        name: "Description",
        selector: "description",
        center: true
    },
    {
        name: "Owner",
        selector: "owner",
        center: true,
        cell: row => <div data-tag="allowRowEvents"><div style={{ textAlign: 'left' }}>{row.owner}</div></div>,

    },
    {
        name: "Location",
        selector: "location",
        center: true,
        cell: row => <div data-tag="allowRowEvents"><div style={{ textAlign: 'left' }}>{row.location}</div></div>,
    },
    {
        name: "Update Time",
        selector: "updateTime",
        center: true,
        cell: row => <div data-tag="allowRowEvents"><div style={{ textAlign: 'left' }}>{row.updateTime}</div></div>,

    }
];

const isIndeterminate = indeterminate => indeterminate;
const selectableRowsComponentProps = { indeterminate: isIndeterminate, color: 'primary' };
var lookup = {}
function SearchManagement(props) {
    const classes = useStyles();
    const history = useHistory();
    const pageCount = useSelector(state => state.setCommon["Paging size"]);
    const [selectData, setSelectData] = useState();
    const [folderDetail, setFolderDetail] = useState([]);
    const [moveSelection, setMoveSelection] = useState();
    const [disableDelete, setDisableDelete] = useState(true);
    const [disableMergeBtn, setDisableMergeBtn] = useState(true);
    const [searchResultData, setSearchResultData] = useState([]);
    const [defaultTitle, setDefaultTitle] = useState('Recent Search Results');
    const [defaultTitleId, setDefaultTitleId] = useState('');
    const [infoFolderIds, setInfoFolderIds] = useState([]);
    const [folderResultCount, setFolderResultCount] = useState();

    // Search Set
    const [searchResSet, setSearchResSet] = useState('');

    // Table Data Delete Variable
    const [confirmContent, setConfirmContent] = useState(true);
    const [delLoaderContent, setDelLoaderContent] = useState(false);
    const [errorContent, setErrorContent] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [termsDisable, setTermsDisable] = React.useState(false);

    // Folder Delete Variable
    const [folderModalShow, setFolderModalShow] = React.useState(false);
    const [confirmFolderContent, setConfirmFolderContent] = useState(true);
    const [delFolderLoaderContent, setFolderDelLoaderContent] = useState(false);
    const [errorFolderContent, setFolderErrorContent] = useState(false);
    const [disableFolderDelete, setDisableFolderDelete] = useState(true);
    // Move To Folder Variable
    const [moveFolderModalShow, setMoveFolderModalShow] = React.useState(false);
    const [moveFolderId, setMoveFolderId] = useState('');
    const [folderIds, setFolderIds] = useState([]);

    // create New Folder
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [addFolderModalShow, setAddFolderModalShow] = useState(false);
    const [parentFolderId, setParentFolderId] = useState('');
    const [addFolderText, setAddFolderText] = useState(true);
    const [clearCheckedRow, setClearCheckedRow] = useState(false);

    // Get Parent Object for display in delete popup
    const [parentTreeObj, setParentTreeObj] = useState([]);

    const [isSearchDone, setIsSearchDone] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [isShared, setIsShared] = useState(false);

    //Pagination

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            //Do whatever when esc is pressed
            setShowNewFolder(false);
            setAddFolderText(true);
        }
    }, []);

    const { t, i18n } = useTranslation('common');
    const handleAction = value => setSelectData(value);
    // unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
    const updateState = useCallback(state => setSelectData(state));
    function updateVal(state) {
        let mergeData = [];
        let mergeType = [];
        state.selectedRows.map((value, index) => {
            // if (value.type != 'Folder' && value.type != 'Antibody') {
            mergeData.push(value.id);
            // if (mergeType.length == 0) {
            mergeType.push(value.type);
            // } else {
            //     if (mergeType.includes(value.type)) {
            //         mergeType.push(value.type);
            //     }
            // }

            // }
        });
        const isMergeEqual = mergeType.every(i => i === mergeType[0]);
        const isFolderOrAntiBody = mergeType.includes("Folder") || mergeType.includes("Antibody") ? true : false;
        const isIpAndDoc = mergeType.length >= 2 && mergeType.includes("IP Sequence") && mergeType.includes("Document") && !mergeType.includes('Variation') && !mergeType.includes('Sequence') && !mergeType.includes('Merge Result') ? true : false;
        if (state.selectedCount > 0) {
            setDisableDelete(false);
            if (state.selectedCount >= 2 && mergeType.length >= 2 && (isMergeEqual || isIpAndDoc) && !isFolderOrAntiBody) {
                setDisableMergeBtn(false);
            } else {
                setDisableMergeBtn(true);
            }
        } else {
            setDisableDelete(true);
        }
        setSelectData(state)
    }
    function greetUser() {
        const data = [];
        const dataValues = selectData && data.push(selectData.selectedRows[0]);
        if (selectData.selectedCount >= 1 && data && data.length > 0) {
            toast.success("Successfully Deleted");
        }
        else {
            toast.error("Select Any One Item");
        }

    }
    const getRowData = (event) => {
    };

    async function deleteSearch(type) {
        setModalShow(false);
        setFolderModalShow(false);
        setConfirmContent(false);
        setConfirmFolderContent(false);
        if (type === "record") {
            if (selectData.selectedCount > 0) {
                setModalShow(true);
                setDelLoaderContent(true);
                var getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
                deleteRecordFolder(getIds, type);
            }
        } else {
            if (defaultTitleId) {
                setFolderModalShow(true);
                setFolderDelLoaderContent(true);
                deleteRecordFolder(defaultTitleId, type);
            }
        }
    }
    async function deleteRecordFolder(getIds, type) {
        const response = await SearchManagementService.deleteSearchResult(getIds, history);
        if (response && response.response_content && response.response_content.success.length > 0) {
            setTermsDisable(false);
            if (type === "record") {
                setModalShow(false);
                setConfirmContent(true);
                setDelLoaderContent(false);
                setErrorContent(false);
            } else {
                setFolderModalShow(false);
                setConfirmFolderContent(true);
                setFolderDelLoaderContent(false);
                setFolderErrorContent(false);
            }

            if (defaultTitle === 'Recent Search Results') {
                getDefaultSearchResult('defaultText', '');
            } else {
                if (type === "record") {
                    getDefaultSearchResult('folder', defaultTitleId);
                } else {
                    setDefaultTitle('Recent Search Results');
                    getDefaultSearchResult('defaultText', '');
                }
                getFolderResultData();
            }
            setDisableDelete(true)
            setTimeout(() => {
                toast.success('Deleted Successfully');
            }, 3000);
        } else {
            if (type === "record") {
                setModalShow(true);
                setDelLoaderContent(false);
                setErrorContent(true);
            } else {
                setFolderModalShow(true);
                setFolderDelLoaderContent(false);
                setFolderErrorContent(true);
            }
            // toast.error('Unable to Delete');
        }
    }
    async function getDefaultSearchResult(type, id, start, stop) {
        let tempArr = [];
        let pageStart, pageStop;
        if (start && stop) {
            pageStart = start;
            pageStop = stop;
        } else {
            pageStart = 1;
            pageStop = pageCount;
        }
        // setSearchResultData([]);
        if (type == "defaultText") {
            let recentParentId = parentFolderId;
            let folderData;
            if (!recentParentId) {
                folderData = await SearchManagementService.getProjectFolders(history);
                if (folderData && folderData.response_content) {
                    recentParentId = folderData.response_content.id;
                }
            }
            const result = await HomeService.getSearchResults(history, pageStart, pageStop);
            let recentCountResult;
            if (recentParentId) {
                recentCountResult = await HomeService.getSearchCount(recentParentId);
            }
            if (result && result.response_content && result.response_content.length > 0 && recentParentId) {
                setFolderResultCount(recentCountResult && recentCountResult.response_content && recentCountResult.response_content.numerics && recentCountResult.response_content.numerics[0].subCount);
                // tempArr = await UtilsService.mostRecentResCalculation(result, 'searchmanagement');
                tempArr = await getSearchDataArr(result, 'searchmanagement');
                // tempArr = _.orderBy(tempArr, [(obj) => new Date(obj.date)], ['desc']);
            }
        } else {
            if (id && !isSearchDone) {
                const result = await SearchManagementService.getFolderData(id, history, pageStart, pageStop);
                if (result && result.response_content) {
                    setFolderResultCount(result.response_content.totalcount);
                    if (result.response_content.results.length > 0) {
                        // tempArr = await UtilsService.mostRecentResCalculation(result, 'searchfolder');
                        tempArr = await getSearchDataArr(result, 'searchfolder');
                    }
                }
            } else if (isSearchDone) {
                const getSearchResp = await SearchManagementService.getSearchResultSet(searchResSet, history, pageStart, pageStop);
                if (getSearchResp && getSearchResp.response_content) {
                    setFolderResultCount(getSearchResp.response_content.totalcount);
                    if (getSearchResp.response_content.results.length > 0) {
                        // tempArr = await UtilsService.mostRecentResCalculation(result, 'searchfolder');
                        tempArr = await getSearchResultArr(getSearchResp, 'searchResults');
                    }
                    // setSearchResultData(tempArr);
                    // setDefaultTitle(`All data which contains: "${searchResSet}"`);
                    // setDefaultTitleId('searchResult');
                }
            } else if (type === 'shared results') {
                const sharedResults = await SearchManagementService.getResultsSharedWithMe(history);
                setIsShared(true)
                setDefaultTitle('Shared Results')
                setDefaultTitleId('sharedResults')
                tempArr = await getSearchDataArr(sharedResults, 'sharedResults');
                setFolderResultCount(sharedResults.response_content.length ? sharedResults.response_content.length : 0)
            }
        }
        setSearchResultData(tempArr);
    }
    const getProgressStatus = async (isCompleted) => {
        if (isCompleted) {
            getDefaultSearchResult('defaultText', '');
        }

    }
    async function getSearchDataArr(data, pagetype) {
        let tempArr = [];
        let resultData;
        if (pagetype == 'searchfolder' || pagetype === 'sharedResults') {
            resultData = data.response_content.results ? data.response_content.results : [];
        } else {
            resultData = data.response_content;
        }
        resultData.forEach(datas => {
            let tempObj = datas;
            let id = datas.id;
            tempObj['date'] = datas.date ? format(new Date(datas.date), 'dd-MMM-yyyy') : null;
            const regex = /Fulltext/i;
            let type = 'Alignments';
            if (datas.type !== null && datas.type !== '' && datas.type) {
                const found = datas.type.match(regex);
                if (found && found.length > 0) {
                    type = 'Documents';
                }
            } else {
                datas.type = ' '
            }
            // let type = 'Alignments';

            let mostRecentTypeUrl = url.mostRecentTypeUrl
            mostRecentTypeUrl = mostRecentTypeUrl.replace('**', id);
            let typeUrl = process.env.REACT_APP_BASE_URL + mostRecentTypeUrl;
            if (datas.type != '') {
                if (datas.status == 'UNKNOWN') {
                    // NO ACTION AVAILABLE
                }
                if (datas.type == "GqWfMerge" && (datas.status == 'UNKNOWN' || datas.status == 'STILL_RUNNING')) {

                    tempObj['results'] = <ProgressBar getStatus={getProgressStatus} datas={datas} />
                }
                else if (datas.type !== 'GqFolder') {
                    if (datas.status == 'STILL_RUNNING') {
                        tempObj['results'] = <ProgressBar getStatus={getProgressStatus} datas={datas} />
                    }
                    else if (datas.status == 'FAILED') {
                        tempObj['results'] = <a href="#" className={(datas.status == 'FAILED' ? 'failedIconColor' : '')} onClick={(e) => e.preventDefault()}>Search Failed</a>;
                    }
                    else if (datas.status == 'CANCELLED') {
                        tempObj['results'] = <span>Search cancelled</span>;
                    }
                    else {
                        if (datas.type == 'DlPhysicalSeqdb' || datas.type == 'DlVirtualSeqdb') {
                            type = 'Sequences';
                            typeUrl = process.env.REACT_APP_API_URL + url.browseSeqDB.replace('**', id);
                        }
                        // tempObj['results'] = <a href={typeUrl} target="_blank">{datas.results} {type}</a>
                        if (datas.results && datas.results > 0) {
                            tempObj['results'] = <a href={typeUrl} target="_blank" rel="noreferrer">{datas.results} {type}</a>
                        } else {
                            tempObj['results'] = <span>{datas.results ? datas.results + ' ' + type : ''}</span>
                            // tempObj['results'] = <span></span>
                        }
                    }
                } else {
                    let folderLabel = '';
                    if (datas.results > 0) {
                        folderLabel = datas.results + ' Search Results';
                    }
                    tempObj['results'] = <a href="#" onClick={(e) => getInfoIconData(e, tempObj, null)}>{folderLabel}</a>;
                }
            } else {
                tempObj['results'] = <a href="#" onClick={(e) => e.preventDefault()} />;
            }

            let mostRecentClassicUrl = url.mostRecentClassicUrl
            mostRecentClassicUrl = mostRecentClassicUrl.replace('**', id);
            let classicLink = process.env.REACT_APP_API_URL + mostRecentClassicUrl
            if (datas.status == 'FAILED') {
                tempObj["report"] = '';
            } else {
                if (datas.type != '' && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED')) {
                    if (datas.results.props.children && datas.results.props.children[0] > 0) {
                        if (datas.type == "GqWfABIpSearch") {
                            let mostRecentReportUrl = url.mostRecentReportUrl
                            mostRecentReportUrl = mostRecentReportUrl.replace('**', id);
                            let reportLink = process.env.REACT_APP_BASE_URL + mostRecentReportUrl
                            tempObj["report"] = <Fragment><a href={reportLink} target="_blank" rel="noreferrer">Report</a>
                                <span className="mx-2">|</span>
                                <a href={classicLink} target="_blank" rel="noreferrer">Classic</a>
                            </Fragment>
                        } else if (datas.type !== "GqFolder" && datas.type !== "DlPhysicalSeqdb" && datas.type !== "DlVirtualSeqdb") {
                            tempObj["report"] = <Fragment>
                                <a href={classicLink} target="_blank" rel="noreferrer">Classic</a>
                            </Fragment>
                        } else {
                            tempObj["report"] = '';
                        }
                    }
                    else {
                        tempObj["report"] = '';
                    }
                } else {
                    tempObj["report"] = '';
                }
            }
            tempObj['type'] = Constant['searchType'][datas.type] ? Constant['searchType'][datas.type] : datas.type;
            if (pagetype === "searchmanagement" || pagetype === "searchfolder" || pagetype === 'sharedResults') {
                tempObj["info"] = <Fragment>

                    {/* {datas.type === "Folder" && <a href="#" className="infoIcon" onClick={(e) => getInfoIconData(e, tempObj, null)}><InfoIcon className={"mr-2 appLink pe-none " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></a>} */}
                    {datas.type !== "Folder" && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED') && <Link to={"/searchresseq/" + datas.id} className="infoIcon appLink"><InfoIcon className={"mr-2 appLink " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></Link>}
                    {datas.type === "Folder" && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED') && <Link to={"/report/folder/" + datas.id} className="infoIcon appLink"><InfoIcon className={"mr-2 appLink " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></Link>}

                    {datas.type === "IP Sequence" && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED') && <Link to={"/ipseqsearch/" + datas.id} ><RedoIcon className="mr-2 appLink" /></Link>}
                    {datas.type === "Variation" && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED') && <Link to={"/ipseqvariation/" + datas.id}><RedoIcon className="mr-2 appLink" /></Link>}
                    {datas.type === "Antibody" && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED') && <Link to={"/searchresantibody/" + datas.id}><RedoIcon className="mr-2 appLink" /></Link>}

                    {/* {datas.type === "IP Sequence" && <Link  ><RedoIcon className="mr-2 appLink" /></Link>}
                    {datas.type === "Variation" && <Link ><RedoIcon className="mr-2 appLink" /></Link>} */}
                    {datas.is_schedulable && datas.is_scheduled && <AccessAlarmIcon className="appLink" />}

                    {/* <a href="#" onClick={(e) => e.preventDefault()}><AccessAlarmIcon className="appLink" /></a> */}
                </Fragment>
            }
            tempArr.push(tempObj);
        })
        return tempArr;
    }
    async function getSearchResultArr(data) {
        let tempArr = [];
        let resultData = data.response_content.results;
        resultData.forEach(datas => {
            let tempObj = datas;
            // tempObj.description = datas.text_label;
            tempObj['type'] = Constant['searchType'][datas.class] ? Constant['searchType'][datas.class] : datas.class;
            tempObj.name = datas.text_label;
            tempObj.icon = <Fragment>
                {/* {datas.type === "Folder" && <a href="#" className="infoIcon" onClick={(e) => getInfoIconData(e, tempObj, datas.text_label)}><InfoIcon className={"appLink pe-none " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></a>} */}
                {datas.type === "Folder" && <Link to={"/report/folder/" + datas.id} className="infoIcon appLink"><InfoIcon className={"mr-2 appLink " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></Link>}
                {datas.type !== "Folder" && datas.type !== "Merge Result" && <Link to={"/searchresseq/" + datas.id} className="infoIcon appLink"><InfoIcon className={"appLink " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></Link>}</Fragment>
            tempObj.description = datas.description;
            tempObj.owner = datas._owner_full_name;
            tempObj.location = datas._absolute_path;
            tempObj.updateTime = datas.update_time;
            tempArr.push(tempObj);
        });

        return tempArr;
    }
    async function getFolderResultData() {
        const folderData = await SearchManagementService.getProjectFolders(history);
        if (folderData && folderData.response_content) {
            let getParentFolderId = folderData.response_content.id;
            const getResult = await SearchManagementService.getProjectFolderData(getParentFolderId, history);
            if (getResult && getResult.response_content) {
                if (getResult.response_content.items && getResult.response_content.items.length > 0) {
                    let res = getResult.response_content.items[0];
                    setParentFolderId(res.id);
                    const ids = [];
                    JSON.stringify(res, (key, value) => {
                        if (key === 'id') ids.push(value);
                        return value;
                    });
                    // setFolderIds(["4086079","4087563","4087579"]);
                    setFolderIds(ids);
                    // setInfoFolderIds([res.id]);
                    // Setting Level for Disable Add Folder Button
                    res.children.forEach(child1 => {
                        if (child1.child_status == "yes") {
                            child1.level = 1;
                            child1.children.forEach(child2 => {
                                if (child2.child_status == "yes") {
                                    child2.level = 2;
                                    child2.children.forEach(child3 => {
                                        if (child3.child_status == "yes") {
                                            child3.level = 3;
                                            child3.children.forEach(child4 => {
                                                child4.level = 4;
                                            });
                                        } else {
                                            child3.level = 3;
                                        }
                                    });
                                } else {
                                    child2.level = 2;
                                }
                            });
                        } else {
                            child1.level = 1;
                        }
                    });
                    // Getting All Array and map to find parent Object
                    mapIt(res);
                    setFolderDetail(res);
                }
            }
        }
    }
    const updateDefaultValue = (type) => {
        setDefaultTitle(type);
        setDefaultTitleId('')
        getDefaultSearchResult('defaultText', '');
        setShowNewFolder(false);
        setIsSearchDone(false);
        setSearchResSet('');
        setClearCheckedRow(!clearCheckedRow);
        setCurrentPage(1);
        setDisableMergeBtn(true);
    }
    // const deleteRecord = () => {
    // NO ACTION AVAILABLE
    // };
    const closeModal = () => {
        setModalShow(false);
        setTermsDisable(false);
        setConfirmContent(true);
    }
    const closeFolderModal = () => {
        setFolderModalShow(false);
        setAddFolderModalShow(false)
        setTermsDisable(false);
        setConfirmFolderContent(true);
    }
    const closeMoveFolderModal = () => {
        setMoveFolderModalShow(false);
        setMoveFolderId('');
    }
    const openModal = () => {
        setModalShow(true);
        setConfirmContent(true);
        setDelLoaderContent(false);
        setErrorContent(false);
    }
    const openFolderModal = () => {
        setFolderModalShow(true);
        setConfirmFolderContent(true);
        setFolderDelLoaderContent(false);
        setFolderErrorContent(false);
    }

    async function getSelection() {
        var getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
        var moveableTo = await SearchManagementService.getMoveSelection(getIds, history);
        setMoveSelection(moveableTo.response_content.selection);
        openMoveFolderModal()
    }
    function openMoveFolderModal() {
        setMoveFolderId('');
        setMoveFolderModalShow(true);
    }
    const changeTitle = (event) => {
        //clear check box
        setClearCheckedRow(!clearCheckedRow);

        setDefaultTitle(event.text_label);
        setDefaultTitleId(event.id);
        setParentFolderId(event.id);
        // Finding Parent Object to display in Popup While Delete
        findParentObj(event);
        if (event.level == 3) {
            setAddFolderText(false);
            setShowNewFolder(false);
        } else {
            setAddFolderText(true);
        }
        // setTimeout(() => {
        if (event.text_label != "Recent Search Results") {
            setInfoFolderIds([]);
        }
        // let start = 1;
        // let stop = pageCount;
        getDefaultSearchResult('folder', event.id, null);
        // } else {
        //     getDefaultSearchResult('folder', event.id);
        // }
        // getDefaultSearchResult('folder', event.id);
        setDisableDelete(true);
        setDisableFolderDelete(false);
        if (!_.includes(infoFolderIds, parentFolderId)) {
            infoFolderIds.push(parentFolderId)
        }
        infoFolderIds.push(event.id)
        setInfoFolderIds(infoFolderIds);
        if (event.text_label == "My Searches") {

            setDisableFolderDelete(true);
        }
        setIsSearchDone(false);
        setSearchResSet('');
        setCurrentPage(1);
        setDisableMergeBtn(true);
        // }, 1000);
    };

    function mapIt(node) {
        lookup[node.id] = node;
        //recursive on all the children
        node.children && node.children.forEach(mapIt);
    }
    async function findParentObj(obj) {
        let parentObj = await findAncestors(obj.id);
        parentObj.push(obj.id);
        setParentTreeObj(...[parentObj]);
    }
    async function findAncestors(nodeId) {
        var ancestors = [];
        // ancestors.unshift(nodeId);
        var parentId = lookup[nodeId] && lookup[nodeId].parent_gq_folder_id;
        var desc = lookup[parentId] && lookup[parentId].description;
        var regex = new RegExp('home folder for', "i");
        var checkRootFolder = regex.test(desc);
        while (parentId !== undefined && parentId != '2') {
            ancestors.unshift(parentId)
            parentId = lookup[parentId] && lookup[parentId].parent_gq_folder_id;
        }
        return ancestors;
    }
    const selectedFolder = (event) => {
        setMoveFolderId(event.id);
    }
    async function moveToFolder() {
        var getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
        setMoveFolderModalShow(false);
        const getResponse = await SearchManagementService.moveToFolder(moveFolderId, getIds, history);
        if (getResponse.response_status == 0) {
            setClearCheckedRow(!clearCheckedRow);
            // if (getResponse && getResponse.response_content && getResponse.response_content.success.length > 0) { 
            if (defaultTitle === 'Recent Search Results') {
                getDefaultSearchResult('defaultText', '');
            } else {
                getDefaultSearchResult('folder', defaultTitleId);
            }
            // getDefaultSearchResult('folder', defaultTitleId);
            getFolderResultData();
            toast.success('Folder Moved Successfully');
            // }
        } else {
            // getDefaultSearchResult('folder', defaultTitleId);
            toast.error(getResponse.response_content.message);
        }


    }
    const addNewFolder = (e) => {
        e.preventDefault();
        setShowNewFolder(true);
        setAddFolderText(!addFolderText);
    }
    const getFolderName = async (e) => {
        if (e.keyCode == 13) {
            var regex = new RegExp(Constant.folderRestrictNames.join("|"), "i");
            var isAvailable = regex.test(e.target.value);
            if (isAvailable) {
                setAddFolderModalShow(true);
            } else if (e.target.value.length > 200) {
                setAddFolderModalShow(true);
            } else {
                const addResp = await SearchManagementService.addFolder(parentFolderId, e.target.value, history);
                if (addResp.response_status == 0) {
                    // if (getResponse && getResponse.response_content && getResponse.response_content.success.length > 0) { 
                    getDefaultSearchResult('folder', defaultTitleId);
                    getFolderResultData();
                    e.target.value = '';
                    setShowNewFolder(false);
                    setAddFolderText(true);
                    toast.success('Folder Added Successfully');
                    // }
                } else {
                    // getDefaultSearchResult('folder', defaultTitleId);
                    toast.error(addResp.response_content.message);
                }
            }
        }
    }
    async function getInfoIconData(e, data, textLabel) {
        e.preventDefault();
        if (data) {
            setDefaultTitle(textLabel ? textLabel : data.description);
            setDefaultTitleId(data.id);
            let infoFId = [];
            if (infoFolderIds && infoFolderIds.length == 0) {
                infoFolderIds.push(parentFolderId);
            }
            infoFolderIds.push(data.id)
            setInfoFolderIds([...infoFolderIds]);
            getDefaultSearchResult('folder', data.id);
            setIsSearchDone(false);
            // getFolderResultData();
        }
    };

    const getSearchResultSet = async (e) => {
        // Enter or Click
        if (e.keyCode == 13 || e.type == "click") {
            let tempArr = [];
            if (searchResSet || searchResSet == "") {
                setIsSearchDone(true);
                let start = 1;
                let stop = pageCount;
                const getSearchResp = await SearchManagementService.getSearchResultSet(searchResSet, history, start, stop);
                if (getSearchResp && getSearchResp.response_content) {
                    setFolderResultCount(getSearchResp.response_content.totalcount);
                    if (getSearchResp.response_content.results.length > 0) {
                        // tempArr = await UtilsService.mostRecentResCalculation(result, 'searchfolder');
                        tempArr = await getSearchResultArr(getSearchResp, 'searchResults');
                    }
                    setSearchResultData(tempArr);
                    searchResSet != "" ? setDefaultTitle(`All data which contains: "${searchResSet}"`) : setDefaultTitle("All data");
                    setDefaultTitleId('searchResult');
                    setCurrentPage(1);
                }
            }
        }
    }
    const changePage = async (e, page) => {
        let start, stop;
        if (page) {
            start = ((page - 1) * pageCount) + 1;
            stop = page * pageCount;
            setCurrentPage(page)
        }
        if (defaultTitle == "Recent Search Results") {
            getDefaultSearchResult('defaultText', '', start, stop);
        } else {
            getDefaultSearchResult('folder', defaultTitleId, start, stop);
        }
        setClearCheckedRow(!clearCheckedRow);
        setDisableMergeBtn(true);
    }

    function mergeModalFunction(type) {
        setShowMergeModal(!showMergeModal);
        if (type && type == "success") {
            updateDefaultValue('Recent Search Results');
        }
    }
    const [sharedFolderInfo, setSharedFolderInfo] = useState([]);
    async function getFoldersSharedWithMeInfo() {
        const sharedWithMeData = await SearchManagementService.getFoldersSharedWithMe(history)
        setSharedFolderInfo(sharedWithMeData.response_content?.children ? sharedWithMeData.response_content : [])
    }

    useEffect(() => {
        getFolderResultData();
        getFoldersSharedWithMeInfo()
        getDefaultSearchResult('defaultText', '');

        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);
    const handleSharedFolderClick = e => {
        setIsShared(true)
        changeTitle(e)
    }
    const handleFolderClick = e => {
        setIsShared(false)
        changeTitle(e)
    }


    const folderItem = (data, margin) => {
        if (data) {
            return <ListGroup.Item className={classes.projectListItem} key={data.id} >
                <a className={"appTextColor"} style={{ marginLeft: margin }}
                    onClick={() => handleSharedFolderClick(data)}>
                    <img src={FolderIcon} className={classes.folderIcon} />
                    <span className={(defaultTitle === data.text_label) ? classes.selectedTitle : ''} style={{ marginLeft: '5px' }}>{data.text_label}</span>
                </a>
            </ListGroup.Item>
        }
    }
    const handleSharedResultsClick = async e => {
        getDefaultSearchResult('shared results', '', 0, 20)
    }
    return (
        <div className={classes.grow}>
            <Row>
                <Col md="3" sm="3" xs="3">
                    <Col md="12" sm="12" xs="12">
                        <div className="form-group">
                            <TextInput
                                fullWidth
                                variant="outlined"
                                id="searchResSet"
                                name="searchResSet"
                                label={t('searchResSet')}
                                type="text"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment onClick={getSearchResultSet}>
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(e) => setSearchResSet(e.target.value)}
                                onKeyDown={getSearchResultSet}
                                value={searchResSet}
                            />
                        </div>
                    </Col>
                    <Col md="12" className="appTextColor">
                        <h6><b>Projects</b></h6>
                        <ListGroup defaultActiveKey="#link1" className={"projectList"} style={{ maxHeight: '44%', overflow: 'auto' }}>
                            <ListGroup.Item className={classes.projectListItem} key="RecentSearch">
                                <a className="cursorPointer text-decoration-none appTextColor" onClick={() => updateDefaultValue('Recent Search Results')}>
                                    <img src={FolderIcon} className={classes.folderIcon} />
                                    <span className={classes.projectTitle + ' ' + (defaultTitle === 'Recent Search Results' ? classes.projTitleActive : '')}>{t('recentSearchRes')}</span></a>
                            </ListGroup.Item>

                            {/* {folderDetail.map((value, index) => { */}
                            <ListGroup.Item key={123} className={classes.projectListItem}>
                                <FolderTreeMenu items={folderDetail} infoFolderIds={infoFolderIds} selectedTitle={defaultTitle} selectedTitleId={defaultTitleId} type="selectFolder" parentCallback={handleFolderClick} />
                            </ListGroup.Item>

                            {/* })} */}
                            <ListGroup.Item className={classes.projectListItem + " " + classes.addNewText + ' ' + (defaultTitle !== 'Recent Search Results' && showNewFolder ? 'd-block' : 'd-none')} key="addNewFolder">
                                <img src={FolderIcon} className={classes.folderIcon + " float-left mt-2"} />
                                <TextInput
                                    id="addFolder"
                                    name="addFolder"
                                    label={t('newFolder')}
                                    variant="outlined"
                                    className={"float-left ml-2 w-75"}
                                    onKeyDown={getFolderName}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item className={classes.projectListItem + " " + classes.addNewLabel + ' ' + (!isShared && (defaultTitle !== 'Recent Search Results') ? 'd-block' : 'd-none')} key="createNewFolder">
                                <img src={FolderPlusIcon} className={classes.folderIcon} /> <a href="" onClick={addNewFolder} className={"appLink " + classes.projectTitle + (!addFolderText ? ' disabled' : '')}>{t('addFolder')}</a>
                            </ListGroup.Item>
                        </ListGroup>
                        <h6 className="mt-4"><b>{t('resSharedWithMe')}</b></h6>
                        <ListGroup defaultActiveKey="#link1" className={"projectList"} style={{ maxHeight: '44%', overflow: 'auto' }}>
                            <ListGroup.Item className={classes.projectListItem} key={'shared results'}>
                                <a className={classes.sharedFolderText + " appTextColor"} onClick={handleSharedResultsClick} >
                                    <img src={FolderIcon} className={classes.folderIcon} />
                                    <span className={(defaultTitle === 'Shared Results') ? classes.selectedTitle : ''} style={{ marginLeft: '5px' }}>Shared Results</span>
                                </a>
                            </ListGroup.Item>
                            {sharedFolderInfo.children ? sharedFolderInfo.children.map(sharedFolder => {
                                let folderData;
                                if (sharedFolder.data) {
                                    folderData = <>{folderData}{folderItem(sharedFolder.data, 30)}</>
                                }
                                if (sharedFolder.children?.length) {
                                    sharedFolder.children.map(sharedFirstGenChildFolder => {
                                        if (sharedFirstGenChildFolder.data) {
                                            folderData = <>{folderData}{folderItem(sharedFirstGenChildFolder.data, 60)}</>
                                        }
                                        if (sharedFirstGenChildFolder.children?.length) {
                                            sharedFirstGenChildFolder.children.map(shared2ndGenChildFolder => {
                                                folderData = <>{folderData}{folderItem(shared2ndGenChildFolder.data, 90)}</>
                                            })
                                        }
                                    })
                                }
                                return folderData
                            }) : null}
                            {/* <ListGroup.Item key={123} className={classes.projectListItem}>
                                <FolderTreeMenu items={sharedFolderInfo.children ? sharedFolderInfo.children : []} isSharedFolder={true} infoFolderIds={infoFolderIds} selectedTitle={defaultTitle} selectedTitleId={defaultTitleId} type="selectFolder" parentCallback={handleSharedFolderClick} />
                            </ListGroup.Item> */}
                        </ListGroup>
                    </Col>
                </Col>
                <Col md="9" sm="9" xs="9">
                    <h6 className="appTextColor mb-4"><b><img src={FolderIcon} /> <span className={classes.projectTitle}>{defaultTitleId ? defaultTitle : 'Recent Search Results'}</span></b></h6>
                    <DataTable
                        columns={isSearchDone ? searchColumns : columns}
                        // columns={columns}
                        data={searchResultData}
                        defaultSortField="date"
                        defaultSortAsc={false}
                        sortable={false}
                        sortServer={true}
                        // sortIcon={<SortIcon />}
                        onSelectedRowsChange={updateVal}
                        noDataComponent={isShared ? t('noResultShared') : t('noSearchSubmit')}
                        customStyles={customStyles}
                        selectableRowsNoSelectAll
                        selectableRowsComponent={Checkbox}
                        selectableRowsComponentProps={selectableRowsComponentProps}
                        selectableRows
                        noHeader={true}
                        // onRowClicked={getRowData}
                        onRowClicked={getRowData}
                        clearSelectedRows={clearCheckedRow}
                    />
                    {/* {defaultTitle && defaultTitle != "Recent Search Results" && searchResultData.length > 0 && <Row> */}
                    <Col className={'d-flex justify-content-center' + (searchResultData.length > 0 ? ' d-block' : ' d-none')} md="12">
                        <CustomPagination className={"float-right mt-2"} count={folderResultCount ? folderResultCount : 0} changePage={changePage} recordPerPage={pageCount} showFirstButton showLastButton defaultPage={1} page={currentPage} />
                    </Col>
                    {/* </Row> } */}

                    <Col className={"float-left px-0 " + classes.columnPadding + (!isShared && searchResultData.length > 0 ? ' d-block' : ' d-none')} md="6" sm="6" xs="6">

                        <Button color={(disableDelete ? 'default' : 'secondary')} style={{ margin: '4px 10px 4px 0 !important' }} disabled={disableDelete} variant="contained" onClick={openModal} className={"text-capitalize float-left" + ' ' + (disableDelete ? classes.buttonStyle : 'accountInfo ') + ' mr-2'} type="submit">{t('deleteSelected')}</Button>
                        <Button color={(disableDelete ? 'default' : 'secondary')} style={{ margin: '4px 10px 4px 0 !important' }} disabled={disableDelete} variant="contained" onClick={getSelection} className={"text-capitalize float-left" + ' ' + (disableDelete ? classes.buttonStyle : 'accountInfo') + ((defaultTitle == 'Recent Search Results') ? ' d-none' : ' d-block') + ' mr-2'} type="submit">{t('moveToFolder')}</Button>
                        <Button color={(disableMergeBtn ? 'default' : 'secondary')} disabled={disableMergeBtn} variant="contained" onClick={() => { setShowMergeModal(!showMergeModal) }} className={"text-capitalize float-left" + ' ' + (disableMergeBtn ? classes.buttonStyle : 'accountInfo') + ((defaultTitle == 'Recent Search Results' || isSearchDone) ? ' d-none' : ' d-block')} type="submit">{t('mergeResult')}</Button>
                    </Col>

                    <Col className={"float-right " + classes.columnPadding + (!isShared && (defaultTitle !== 'Recent Search Results' && !isSearchDone) ? ' d-block' : ' d-none')} md="6" sm="6" xs="6">
                        {/* <Button color="primary" variant="contained" onClick={openFolderModal} className="loginSubmit text-capitalize mr-2" type="submit">{t('deleteEntireFolder')}</Button>&nbsp;&nbsp;&nbsp; */}
                        <Button variant="contained" onClick={addNewFolder} color={(!addFolderText ? 'default' : 'primary')} disabled={!addFolderText} className={"text-capitalize " + (!addFolderText ? classes.buttonStyle : 'accountInfo ') + ' mr-2'} type="submit">{t('createSubFolder')}</Button>
                        <Button color="primary" style={{ margin: '4px 10px 4px 0 !important' }} variant="contained" disabled={disableFolderDelete} onClick={openFolderModal} className={(defaultTitle == 'My Searches' ? classes.buttonStyle : 'accountInfo') + ' mr-2'} type="submit">{t('deleteEntireFolder')}</Button>&nbsp;&nbsp;&nbsp;


                    </Col>
                    {/* <Col className={classes.columnPadding} md="12"> */}

                    {/* </Col> */}
                </Col>

            </Row>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcente"
                centered
                contentClassName={classes.modalClassConDSI}
                className={classes.modalBoxContent}

            >
                {/* <Modal.Header className={classes.modalHeader}>
                    <Link href="#" onClick={(e) => e.preventDefault()} className={classes.modaltext}>
                        <CloseIcon onClick={closeModal} />
                    </Link>
                </Modal.Header> */}
                <Link href="#" onClick={(e) => e.preventDefault()} className={classes.modaltext}>
                    <CloseIcon onClick={closeModal} />
                </Link>
                <div className={classes.modal_body_selected + " appTextColor"}>
                    <div className={classes.colorConDSI}>
                        <div className={(confirmContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3"><b>{t('deleteSelItems')}</b></p>
                            <p className="mb-3">{t('deleteSelItemContent')}.<b>{t('deleteSelItemContent1')}</b>.</p>
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
                                <Button onClick={closeModal} className={classes.loginSubmitCancel} >{t('cancel')}</Button>

                                <Button onClick={() => deleteSearch('record')} color={(!termsDisable ? 'default' : 'secondary')} disabled={!termsDisable} className={"text-capitalize mr-2 " + ' ' + (!termsDisable ? 'cancelButtonDisable' : 'accountInfo')} variant="contained">{t('deleteSelItems')}</Button>
                            </div>
                        </div>
                        <div className={"text-center " + (delLoaderContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3">{t('deletingItems')}</p>
                            <p className="mb-3">{t('takeTimeText')}</p>
                        </div>
                        <div className={(errorContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3">{t('errorDeletTitle')}</p>
                            <p className="mb-3">{t('contactText1')} <a href="support@gqlifesciences.com" onClick={(e) => e.preventDefault()}>support@gqlifesciences.com</a> {t('contactText2')}</p>
                            <div className={" float-right"}>
                                <Button onClick={closeModal} className="text-capitalize float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('close')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={folderModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcente"
                centered
                contentClassName={classes.modalClassConEF}
                className={classes.modalBoxContent}
            >
                {/* <Modal.Header closeButton className={classes.modalHeader}>
              </Modal.Header> */}

                {/* <Modal.Header className={classes.modalHeader}>
                    <Link href="#" onClick={(e) => e.preventDefault()} className={classes.modaltext}>
                        <CloseIcon onClick={closeFolderModal} />
                    </Link>
                </Modal.Header> */}
                <Link href="#" onClick={(e) => e.preventDefault()} className={classes.modaltext + "  appTextColor"}><CloseIcon onClick={closeFolderModal} /></Link>
                <div className={classes.modalBody + " appTextColor"}>
                    <div className={classes.colorConDSIEF}>
                        <div className={(confirmFolderContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3"><b>{t('deleteSelFolder')}</b></p>
                            <div className="ml-4">
                                {parentTreeObj.length > 0 && parentTreeObj.map((value, index) => {
                                    let i = 0;
                                    if (index > 0) {
                                        i = index + 2;
                                    }
                                    return (
                                        <p key={index} className={"mb-1 " + "ml-" + i}><img src={FolderIcon} className={classes.popupFolderIcon} /><span className={"ml-1 " + (parentTreeObj.length == index + 1 ? classes.projTitleActive : '')}>{lookup[value] && lookup[value].text_label}</span></p>
                                    )
                                })}
                            </div>
                            <p className="mb-3">{t('deleteSelFolderContent')}.<b>{t('deleteSelItemContent1')}</b>.</p>
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
                                <Button onClick={closeFolderModal} className={classes.loginSubmitCancel} >{t('cancel')}</Button>

                                <Button onClick={() => deleteSearch('folder')} color={(!termsDisable ? 'default' : 'secondary')} disabled={!termsDisable} className={"text-capitalize mr-2 " + ' ' + (!termsDisable ? 'cancelButtonDisable' : 'accountInfo')} variant="contained">{t('deleteSelFolder')}</Button>
                            </div>
                        </div>
                        <div className={"text-center " + (delFolderLoaderContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3">{t('deletingFolder')}</p>
                            <p className="mb-3">{t('takeTimeText')}</p>
                        </div>
                        <div className={(errorFolderContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3">{t('errorDeleteFolderTitle')}</p>
                            <p className="mb-3">{t('contactText1')} <a href="support@gqlifesciences.com" onClick={(e) => e.preventDefault()}>support@gqlifesciences.com</a> {t('contactText2')}</p>
                            <div className={classes.footerDivDSI + " float-right"}>
                                <Button onClick={closeFolderModal} className="text-capitalize float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('close')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={moveFolderModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcente"
                centered
                contentClassName={classes.modalClassConMTF}
                className={classes.modalBoxContent}
            >
                <div className={classes.modalHeaderConMTF}>
                    <a href="#" onClick={(e) => e.preventDefault()} className={classes.modaltext}>
                        <CloseIcon onClick={closeMoveFolderModal} />
                    </a>
                </div>

                <Modal.Body className={classes.modal_body}>
                    <div className={classes.colorConMTF}>
                        <div className={(confirmFolderContent ? 'd-block' : 'd-none')}>
                            <p className="mb-3"><b>{t('moveToFolder')}</b></p>

                            <div className='scrollMoveItem'>
                                <p className="mb-3">{t('selFolderToMove')}</p>
                                <div className="mb-3 h-100">
                                    <FolderTreeMenu items={moveSelection} expandedIds={folderIds} moveFolderId={moveFolderId} moveFolderCallback={selectedFolder} type="moveFolder" />
                                </div>
                            </div>

                            <div className={classes.footerDivMTF + " float-right"}>
                                <Button onClick={closeMoveFolderModal} className={classes.loginSubmitCancel}  >{t('cancel')}</Button>

                                <Button onClick={moveToFolder} color={(moveFolderId === '' ? 'default' : 'primary')} disabled={(moveFolderId === '' ? true : false)} className={"text-capitalize mr-2 " + ' ' + (moveFolderId === '' ? 'cancelButtonDisable' : 'accountInfo')} variant="contained">{t('moveResult')}</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <FolderNameAlertModal showModal={addFolderModalShow} closeModal={closeFolderModal} />
            <MergeResults
                show={showMergeModal}
                selectData={selectData}
                close={(type) => mergeModalFunction(type)} />
        </div>

    );
}
export default SearchManagement;