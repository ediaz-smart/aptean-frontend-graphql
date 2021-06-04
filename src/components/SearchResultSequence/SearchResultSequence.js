import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DataTable from "react-data-table-component";
import Button from '@material-ui/core/Button';


import seqSearchImg from '../../assets/image/seqSearch.png';
import resultshareImg from '../../assets/image/resultshare.png';
import alertImg from '../../assets/image/alert.png';
import searchResultImg from '../../assets/image/searchResult.png';
import notesImg from '../../assets/image/notes.png';
import TextInput from '../../shared/Fields/TextInput';



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
    // reset login status
    useEffect(async () => {

        //dispatch(userActions.logout()); 
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
                    <h6 className={"appTextColor loginTitle"}>Immunoglobulin variations for Steve​</h6>
                    <Row>
                        {/* <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={seqSearchImg} alt="Immunoglobulin variations for Steve​"  />
                        </Col> */}
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Typography>
                                <img className="float-left mx-3" src={seqSearchImg} alt="Immunoglobulin variations for Steve​" />
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /><span>This search was launched on 18-Feb-2021 by Heather Leeman.​</span></Typography>
                            <Typography>
                                <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> <span>It is shared with Steve Allen, Henk Heus, and Vijaya Gorla (share settings).</span></Typography>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col lg="12" md="12" sm="12" className="pr-0 content">
                            <h6 className={"appTextColor loginTitle"}>Query​</h6>
                            <Typography className="appTextFont ml-3"><Link className={"appLinkColor"} href="#" onClick={(e) => e.preventDefault()}>These 4 protein sequences</Link> have been used in this search.​</Typography>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>Subject Databases</h6>
                            <Row className="ml-1">
                                <Col lg="8" md="8" className="pr-0 content">
                                    <Typography>
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> GQ-Pat Gold Plus Nucleotide – Patent Sequences​.</Typography>
                                </Col>
                                <Col lg="2" md="2" className="pr-0 content">
                                    <Typography>5-Feb-2021​​</Typography>
                                </Col>
                                <Col lg="2" md="2" className="pr-0 content">
                                    <Typography>Current Version​​</Typography>
                                </Col>
                            </Row>
                            <Row className="ml-1">
                                <Col lg="8" md="8" className="pr-0 content">
                                    <Typography >
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> GQ-Pat Gold Plus Nucleotide – Patent Sequences​.</Typography>
                                </Col>
                                <Col lg="2" md="2" className="pr-0 content">
                                    <Typography >5-Feb-2021​​</Typography>
                                </Col>
                                <Col lg="2" md="2" className="pr-0 content">
                                    <Typography >Current Version​​</Typography>
                                </Col>
                            </Row>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>Search Strategy</h6>
                            <Col lg="12" md="12" className="pr-0 content">
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> The sequence comparison algorithm used is GenePAST.​</Typography>
                            </Col>
                            <br />
                            <h6 className={"appTextColor loginTitle"}>Technical Data</h6>
                            <Col lg="12" md="12" className="pr-0 content">
                                <Typography >
                                    <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> Search Id 4512653 consumes 15.90 Mb of server disk space​.​</Typography>
                            </Col>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"}>Result sharing​</h6>
                    <Row>
                        <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={resultshareImg} alt="Result sharing" />
                        </Col>
                        <Col lg="8" md="9" sm="12" className="p-0 content">
                            <Row>
                                {/* <img className="float-left mx-3" src={resultshareImg} alt="Result sharing"  /> */}
                                <Typography className="mb-2">
                                    The following people have access to this result. <Link className={"appLinkColor"} href="#" onClick={(e) => e.preventDefault()}>Add more …​</Link></Typography>
                            </Row>
                            <Row>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography >
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> Steve Allen</Typography>
                                </Col>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography ><Link className={"failedTextColor"} href="#" onClick={(e) => e.preventDefault()}>Remove</Link></Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography >
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" /> Steve Allen</Typography>
                                </Col>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography ><Link className={"failedTextColor"} href="#" onClick={(e) => e.preventDefault()}>Remove</Link></Typography>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className={"appTextColor loginTitle"}>Alert Settings​</h6>
                    <Row>
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Row>
                                <Col lg="8" md="8" className="pr-0 content">
                                    <img className="float-left mx-3" src={alertImg} alt="Alert Settings" />
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
                    <h6 className={"appTextColor loginTitle"}>Search History</h6>
                    <Row>
                        {/* <Col lg="1" md="1" sm="12" className="pr-0">
                            <img src={searchResultImg} alt="Search History"  />
                        </Col> */}
                        <Col lg="10" md="9" sm="12" className="p-0 content">
                            <Row>
                                <Col lg="8" md="8" className="pr-0 content">
                                    <img className="float-left mx-3" src={searchResultImg} alt="Search History" />
                                    <Typography >
                                        The following previous versions of this search are stored on our servers. Please consider deleting results that you no longer need.​​</Typography>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="12" md="12" className="pr-0 content float-right mt-3 ml-3">
                            <h6 className={"appTextColor loginTitle"}>Alerts</h6>
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
                            <h6 className={"appTextColor loginTitle"}>Redo's</h6>
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
