import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory, useParams } from 'react-router-dom';
import _ from "lodash";
import DataTable from "react-data-table-component";
import AccountService from '../../services/accountInfo';
import TextInput from '../../shared/Fields/TextInput';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { useFormik } from 'formik';
import { RadioGroup, FormControlLabel, FormLabel, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import Validate from '../../helpers/validate';
import { toast } from 'react-toastify';
import AccountInfoModal from '../../shared/Modal/AccountInfoModal'
import SaveContentModal from '../../shared/Modal/SaveContentModal'
import searchResSequence from '../../services/searchResSequence';
import Typography from '@material-ui/core/Typography';
import resultshareImg from '../../assets/image/resultshare.png';
import ShareResultsModal from '../../shared/Modal/ShareResultsModal';
import ShareResultsRemoveModal from '../../shared/Modal/ShareResultsRemoveModal';
import { useSelector } from 'react-redux';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SortIcon from "@material-ui/icons/ArrowDownward";
import RenameContainer from '../../shared/components/RenameContainer'
import SharedWith from '../Sharing/SharedWith.js';
import { containerWidth } from '../../shared/constants';
import personaldb from '../../services/personaldb';
import Checkbox from "@material-ui/core/Checkbox";
import CustomPagination from '../../shared/CustomPagination';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        maxWidth: containerWidth,
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
        paddingTop: '11px',
        paddingRight: '4px',
        marginTop: '-7px',
    },
    modalBody: {
        paddingBottom: '20px'
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

    modalClassConMTF: {
        position: 'absolute',
        width: '96%',
        height: 'auto',
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)'
    },
    colorConMTF: {
        backgroundColor: 'gainsboro',
        marginTop: '-31px',
        padding: '26px',
        paddingTop: '28px',
        paddingBottom: '65px',
        marginLeft: '7px',
        marginRight: '7px',
        paddingRight: '10px',
        borderRadius: '5px',
    },
    footerDivMTF: {
        padding: '0 30px',
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
        selector: "Type",
        center: true
    },
    {
        name: "",
        selector: "Name",
        cell: row => <div data-tag="allowRowEvents"><a>{row.info}</a></div>,

    }
];

function PersonalDatabases() {

    //userInfo
    const userInfo = useSelector(state => state.setUserInfo);
    const { folderId } = useParams();

    //page defaults
    const [defaultTitle, setDefaultTitle] = useState('Personal Datases');
    const [disableCancel, setDisableCancel] = useState(true);
    const [disableUpload, setDisableUpload] = useState(true);
    const [disableDelete, setDisableDelete] = useState(true);
    const { t, i18n } = useTranslation('common');

    //databases
    const [searchResultData, setSearchResultData] = useState([]);
    const [clearCheckedRow, setClearCheckedRow] = useState(false);

    const isIndeterminate = indeterminate => indeterminate;
    const selectableRowsComponentProps = { indeterminate: isIndeterminate, color: 'primary' };
    const [selectData, setSelectData] = useState();

    //paging
    const [currentPage, setCurrentPage] = useState(1);
    const pageCount = useSelector(state => state.setCommon["Paging size"]);
    const [folderResultCount, setFolderResultCount] = useState();


    //css
    const classes = useStyles();

    useEffect(
        async () => {
            const data = {};
            const result = await personaldb.getPersonalData(folderId)
            if (result && result.response_content && result.status == 0) {

            }
            

        }, []
    );

    const changePage = async (e, page) => {
        let start, stop;
        if (page) {
            start = ((page - 1) * pageCount) + 1;
            stop = page * pageCount;
            setCurrentPage(page)
        }
        setClearCheckedRow(!clearCheckedRow);
    }

    const getRowData = (event) => {
    };

    function updateVal(state) {
        setSelectData(state)
    }

    return (
        <div>
            <DataTable
                columns={columns}
                // columns={columns}
                data={searchResultData}
                defaultSortField="date"
                defaultSortAsc={false}
                sortable={false}
                sortServer={true}
                // sortIcon={<SortIcon />}
                onSelectedRowsChange={updateVal}
                noDataComponent={t('noUploads')}
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

            <Col className={"float-right" + classes.columnPadding + (searchResultData.length > 0 ? ' d-block' : ' d-none')} md="6" sm="6" xs="6">
                <Button color={(disableCancel ? 'default' : 'secondary')} disabled={disableCancel} variant="contained" /*onClick={}*/ className={"text-capitalize mr-2 float-left" + ' ' + (disableCancel ? 'cancelButtonDisable' : 'accountInfo') + ((defaultTitle == 'Recent Search Results') ? ' d-none' : ' d-block')} type="submit">{t('cancel')}</Button>
                <Button color={(disableUpload ? 'default' : 'secondary')} disabled={disableUpload} variant="contained" /*onClick={}*/ className={"text-capitalize mr-2 float-left" + ' ' + (disableUpload ? 'cancelButtonDisable' : 'accountInfo') + ((defaultTitle == 'Recent Search Results') ? ' d-none' : ' d-block')} type="submit">{t('uploadNewDb')}</Button>
                <Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" /*onClick={}*/ className={"text-capitalize mr-2 float-left" + ' ' + (disableDelete ? 'cancelButtonDisable' : 'accountInfo')} type="submit">{t('deleteDatabses')}</Button>
            </Col>
        </div>
    )
}

export default PersonalDatabases;
