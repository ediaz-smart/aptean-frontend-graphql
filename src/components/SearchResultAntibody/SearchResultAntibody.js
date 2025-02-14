import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import _ from "lodash";
import moment from 'moment';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FolderTreeStructure from '../../shared/FolderTreeStructure/FolderTreeStructure';


import TextInput from '../../shared/Fields/TextInput';
import SelectBox from '../../shared/Fields/SelectBox';
import Constant from '../../helpers/constant';
import CheckBox from '../../shared/Fields/CheckBox';
import Validate from '../../helpers/validate';
import SearchPrompt from '../../shared/Modal/SearchPromptModal'
import searchResAntibody from '../../services/searchResAntibody';
import UtilsService from '../../helpers/utils';
import SavedSearch from '../../services/savedsearch';
import SeqVIModal from '../../shared/Modal/SeqVIModal';
import { containerWidth } from '../../shared/constants'

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        minHeight: 30,
        width: '102%',
        margin: 0,
        '&$expanded': {
            minHeight: 30,
            margin: 0,
        },
    },
    content: {
        '&$expanded': {
            margin: '0',
        },
    },
    expanded: {},
    '@media (max-width: 780px)': {
        root: {
            width: '100%',
        }
    }
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: '0 20px',
        margin: '12px 0',
        display: 'block'
    },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '0 auto 28px',
        minHeight: '260px',
        maxWidth: containerWidth,
        // borderBottom: '1px solid #cec7c7',
        padding: '23px 16px 14px',
    },
    loginSubmitCancel: {
        backgroundColor: '#0182C5',
        borderColor: '#1F4E79',
        border: '1px solid #1F4E79',
        color: 'white',
        margin: "4px",
        float: 'right',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: '#0182C5',
            boxShadow: 'none',
        },
    },
    headerPipe: {
        margin: '0 10px'
    },
    searchInput: {
        width: '30%'
    },
    antibodyNumInput: {
        width: '12%'
    }
}));

function list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent !== null) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parent]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

function SearchResultAntibody() {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const history = useHistory();
    const [selectData, setSelectData] = useState();
    const [searchModal, setSearchModal] = useState(false);
    const [showDBRequiredError, setShowDBRequiredError] = useState(false);
    // const [strategy, setStrategy] = useState('genepast');
    const [authInfo, setAuthInfo] = useState();
    // const [workflowId, setWorkflowId] = useState();
    const [patientDBData, setPatientDBData] = useState(Constant.patientSearchDatabases);
    const [disableSearch, setDisableSearch] = React.useState(false);
    const [formdata, setFormData] = useState({});
    const [saveFormValue, setSaveFormValue] = useState(false);

    const [proPersonalData, setProPersonalData] = useState({});
    const [formCheck6, setformCheck6] = React.useState(false);
    const [sequenceTypeValue, setSequenceType] = useState("nucleotide");
    const [proDb, setProDb] = useState([]);
    const [formSubmit, setFromSubmit] = useState(false);

    const [initialData, setInitialData] = useState({});

    const { workflowId } = useParams();
    const { tempname } = useParams();

    useEffect(async () => {
        let initialData = {};
        if (formdata && formdata.savedRedo) {
            initialData = {
                searchName: formdata && formdata.searchName ? formdata.searchName : `AB ${moment().format('YYYY-MM-DD h:mm:ss')}`,
                cdrhcseq1: formdata && formdata.hc_cdr1 ? formdata.hc_cdr1 : '',
                cdrhcseq2: formdata && formdata.hc_cdr2 ? formdata.hc_cdr2 : '',
                cdrhcseq3: formdata && formdata.hc_cdr3 ? formdata.hc_cdr3 : '',
                cdrlcseq1: formdata && formdata.lc_cdr1 ? formdata.lc_cdr1 : '',
                cdrlcseq2: formdata && formdata.lc_cdr2 ? formdata.lc_cdr2 : '',
                cdrlcseq3: formdata && formdata.lc_cdr3 ? formdata.lc_cdr3 : '',
                hcOption1: formdata && formdata.hc_cdr1_mismatches ? formdata.hc_cdr1_mismatches : 0,
                hcOption2: formdata && formdata.hc_cdr2_mismatches ? formdata.hc_cdr2_mismatches : 0,
                hcOption3: formdata && formdata.hc_cdr3_mismatches ? formdata.hc_cdr3_mismatches : 0,
                lcOption1: formdata && formdata.lc_cdr1_mismatches ? formdata.lc_cdr1_mismatches : 0,
                lcOption2: formdata && formdata.lc_cdr2_mismatches ? formdata.lc_cdr2_mismatches : 0,
                lcOption3: formdata && formdata.lc_cdr3_mismatches ? formdata.lc_cdr3_mismatches : 0,
                strategy: formdata && formdata.strat_name ? formdata.strat_name : 'genepast',
                percId: formdata && formdata.strat_genepast_perc_id ? formdata.strat_genepast_perc_id : 80,
                expectCutoff: formdata && formdata.strat_blast_eval_cutoff ? formdata.strat_blast_eval_cutoff : 10,
                wordSize: formdata && formdata.strat_blast_word_size_pro ? formdata.strat_blast_word_size_pro : 3,
                hcFullSeq: formdata && formdata.qdb_seq_hc ? formdata.qdb_seq_hc : '',
                lcFullSeq: formdata && formdata.qdb_seq_lc ? formdata.qdb_seq_lc : '',
                formName: formdata && formdata.formName ? formdata.formName : '',
            }
        } else {
            initialData = {
                searchName: formdata && formdata.searchName ? formdata.searchName : `AB ${moment().format('YYYY-MM-DD h:mm:ss')}`,
                cdrhcseq1: formdata && formdata.cdrhcseq1 ? formdata.cdrhcseq1 : '',
                cdrhcseq2: formdata && formdata.cdrhcseq2 ? formdata.cdrhcseq2 : '',
                cdrhcseq3: formdata && formdata.cdrhcseq3 ? formdata.cdrhcseq3 : '',
                cdrlcseq1: formdata && formdata.cdrlcseq1 ? formdata.cdrlcseq1 : '',
                cdrlcseq2: formdata && formdata.cdrlcseq2 ? formdata.cdrlcseq2 : '',
                cdrlcseq3: formdata && formdata.cdrlcseq3 ? formdata.cdrlcseq3 : '',
                hcOption1: formdata && formdata.hcOption1 ? formdata.hcOption1 : 0,
                hcOption2: formdata && formdata.hcOption2 ? formdata.hcOption2 : 0,
                hcOption3: formdata && formdata.hcOption3 ? formdata.hcOption3 : 0,
                lcOption1: formdata && formdata.lcOption1 ? formdata.lcOption1 : 0,
                lcOption2: formdata && formdata.lcOption2 ? formdata.lcOption2 : 0,
                lcOption3: formdata && formdata.lcOption3 ? formdata.lcOption3 : 0,
                strategy: formdata && formdata.strategy ? formdata.strategy : 'genepast',
                percId: formdata && formdata.percId ? formdata.percId : 80,
                expectCutoff: formdata && formdata.expectCutoff ? formdata.expectCutoff : 10,
                wordSize: formdata && formdata.wordSize ? formdata.wordSize : 3,
                hcFullSeq: formdata && formdata.hcFullSeq ? formdata.hcFullSeq : '',
                lcFullSeq: formdata && formdata.lcFullSeq ? formdata.lcFullSeq : '',
                formName: formdata && formdata.formName ? formdata.formName : '',
            }
        }
        setInitialData(initialData);


        const getResponse = await searchResAntibody.getAuthInfoAB(workflowId);
        if (getResponse && getResponse.response_status == 0) {
            setAuthInfo(getResponse.response_content);
            updateFormData(getResponse.response_content);
            setDisableSearch(true);
            if (getResponse.response_content.dbs && getResponse.response_content.dbs.length > 0) {
                getResponse.response_content.dbs.forEach(function (value) {
                    if (value.startsWith("CAS") || value.startsWith("REG")) {
                        patientDBData[3].ticked = true;
                        // patientDBData[3].selected = true;
                    }
                    if (value.startsWith("GEAA") || value.startsWith("GENA")) {
                        patientDBData[2].ticked = true;
                        patientDBData[2].selected = true;
                    }
                    setPatientDBData([...patientDBData]);
                });
            }

            if (getResponse.response_content.ppuType > 0) {
                setDisableSearch(false);

                if (getResponse.response_content.ppuType == 2 && getResponse.response_content.redo) { // Bundle Redo
                    setDisableSearch(true);
                }
                if (!getResponse.response_content.syscontrol_search_submit && getResponse.response_content.className == "adminium") {
                    setDisableSearch(false);
                }
            }

            if (getResponse && getResponse.response_content && getResponse.response_content.pdbs?.sdb_pro_tree && getResponse.response_content.pdbs.sdb_pro_tree.length > 0) {
                let proteinData = getResponse.response_content.pdbs.sdb_pro_tree;
                let proteinPatent = [], proDefaultPatentDb = [], proMyData = [];
                let proFormattedData = await list_to_tree(proteinData);
                let getProChild = [];
                if (proFormattedData && proFormattedData.length > 0) {
                    getProChild = proFormattedData[0].children;
                }
                getProChild && getProChild.length > 0 && getProChild.map((item, index) => {
                    if (item && item.id == ':Patents') {
                        proteinPatent = item.children;
                        item.children.filter(i => {
                            if (i.label.includes("Patent sequences")) {
                                proDefaultPatentDb.push(i.id);
                            }
                        });
                    } else if (item && item.id == ':My Data') {
                        proMyData = item;
                    }
                })
                setProPersonalData(proMyData);
            }


        }
        let tempparam = decodeURI(tempname);
        tempparam = tempparam.toString().replace(/~~GQSF~~/g, '%');

        if (tempparam) {
            let getResponse = await SavedSearch.getParticularTemplate(tempparam, 'Antibody');
            if (getResponse && getResponse.response_status == 0) {
                let data = getResponse.response_content.map;
                data.savedRedo = true;
                let finalData = {}
                finalData.formData = data;
                finalData.savedRedo = true;
                updateFormData(finalData);
            }
        }
        //dispatch(userActions.logout()); 
    }, []);

    const formik = useFormik({
        initialValues: initialData,
        enableReinitialize: true,
        validationSchema: Validate.AntibodySearchValidation(saveFormValue),
        onSubmit: async (values) => {
            let { searchName, cdrhcseq1, cdrhcseq2, cdrhcseq3, cdrlcseq1, cdrlcseq2, cdrlcseq3, hcOption1, hcOption2, hcOption3, lcOption1, lcOption2, lcOption3, strategy, percId, expectCutoff, wordSize, hcFullSeq, lcFullSeq, formName } = values;
            if (cdrhcseq1 == '' && cdrhcseq2 == '' && cdrhcseq3 == '' && cdrlcseq1 == '' && cdrlcseq2 == '' && cdrlcseq3 == '') {
                toast.error(t('CDRSeqValidation'));
                return false;
            }
            // let selectDB = _.filter(patientDBData, function(user) {
            //     return user.selected;
            // });
            let selectDB = [];
            selectDB = _.filter(patientDBData, { selected: true }).map(v => "p:" + v.value);
            if (selectDB.length == 0) {
                setShowDBRequiredError(true)
                return false;
            }

            proDb.forEach(element => {
                //console.log(element);
                selectDB.push(element);
            });

            let strategyItem = _.find(Constant['strategies'], function (obj) {
                return obj.value == strategy;
            });
            setSearchModal(true);
            let parentId = '';
            let postData = {
                qdb_seq_type: 'protein',
                hc_cdr1: cdrhcseq1,
                hc_cdr1_mismatches: hcOption1,
                hc_cdr2: cdrhcseq2,
                hc_cdr2_mismatches: hcOption2,
                hc_cdr3: cdrhcseq3,
                hc_cdr3_mismatches: hcOption3,
                lc_cdr1: cdrlcseq1,
                lc_cdr1_mismatches: lcOption1,
                lc_cdr2: cdrlcseq2,
                lc_cdr2_mismatches: lcOption2,
                lc_cdr3: cdrlcseq3,
                lc_cdr3_mismatches: lcOption3,
                qdb_seq_hc: hcFullSeq,
                qdb_seq_lc: lcFullSeq,
                searchtype: 'FTO',
                title: searchName,
                strat_name: strategyItem['val'],
                strat_genepast_perc_id: percId,
                strat_genepast_perc_id_over: 'QUERY',
                strat_blast_word_size_pro: wordSize,
                strat_blast_eval_cutoff: expectCutoff,
                strat_blast_scoring_matrix_pro: 'BLOSUM62',
                protdbs: selectDB,
                protdb_type: 'multiple',
                parent_id: parentId,
                template_name: saveFormValue ? (formName).trim() : '', // Set this value when selecting "Save this form for later use as"

            }
            const getResponse = await searchResAntibody.submitAnitbodySearch(postData, history, t);
            setSearchModal(false);
            if (getResponse && getResponse.response_status == 0) {
                history.push('/home');
            } else {
                toast.error('Error in Search');
            }
        },
    });

    function handleDbChange(id) {
        if (proDb.includes(id)) {
            setProDb(proDb.filter(dbName => dbName !== id));
        } else {
            proDb.push(id.toString());
            setProDb([...proDb]);
        }
    }

    function setFormValue() {
        setSaveFormValue(!saveFormValue);
        formik.setFieldValue("formName", '');
    }

    if (formSubmit && formik && formik.errors && Object.keys(formik.errors).length > 0) {
        document.getElementById(Object.keys(formik.errors)[0]).scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
        setFromSubmit(false);
    }

    function submitForm() {
        formik.handleSubmit();
        setFromSubmit(true);
    }

    function updateFormData(data) {
        if (data.redo || data.savedRedo) {
            if (data.formData) {
                data.formData['searchName'] = data.formData['title'];
                let strategyName = data.savedRedo ? data.formData.strat_name : data.formData['strategy'];
                let strategyData = _.find(Constant['strategies'], function (obj) {
                    return obj.val == strategyName;
                });
                data.formData['strategy'] = strategyData['value'];
                patientDBData[0].selected = false;
                patientDBData[1].selected = false;
                patientDBData[2].selected = false;
                patientDBData[3].selected = false;
                let dbData = data.redo ? data.formData.selectedDbs : data.formData.protdbs;
                dbData && dbData.length > 0 && dbData.forEach(function (value) {
                    if (value == 'p:GQPAT_PRT') {
                        patientDBData[0].selected = true;
                    } else if (value == 'p:GQPAT_PREMIUM_PRT') {
                        patientDBData[1].selected = true;
                    } else if (value == 'p:GEAA') {
                        patientDBData[2].selected = true;
                    } else if (value == 'p:CASPAT_PRT') {
                        patientDBData[3].selected = true;
                    }
                });
                if (data.formData['template_name']) {
                    setSaveFormValue(true);
                    data.formData['formName'] = data.formData['template_name'];
                }
                setPatientDBData([...patientDBData]);
                setFormData(data.formData);
            }
        }
        var expiredTime = data.expiredTime;
        if (expiredTime && expiredTime.date) {
            var expiredTimeInSecs = Math.round(new Date(expiredTime.date).getTime() / 1000);
            // Sets the session timeout based on the user expired time in database, -90 for timeout 60 secs and 30 more buffer
            expiredTimeInSecs = expiredTimeInSecs - Math.round(new Date().getTime() / 1000) - 90;
            // Idle.setIdle(expiredTimeInSecs < 0 ? (30 * 59) : expiredTimeInSecs);
            //Idle.watch();
        }
    }
    const handleCheckbox = (event, i) => {
        patientDBData[i]['selected'] = event.target.checked;
        // patientDBData[i]['ticked'] = event.target.checked;
        setPatientDBData([...patientDBData]);
        if (event.target.checked) {
            if (showDBRequiredError) setShowDBRequiredError(false)
        }
    }
    function homePage() {
        history.push('/home');
    }
    function closeSaveModal() {
        setSearchModal(false);
        homePage();
    }

    return (
        <div className={classes.grow}>
            <form name="antibodySearchForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>

                <Row>
                    <Col lg="12" md="12" sm='12' xs='12' className={"mb-2 " + (authInfo && !authInfo.syscontrol_search_submit ? 'd-block' : 'd-none')}>
                        <Typography className="text-danger">
                            {t('ABsearchDisableText')}
                            {authInfo && authInfo.syscontrol_search_submit_txt}
                            {t('patienceThanksText')}</Typography>
                    </Col>
                    <Col lg="12" md="12" sm='12' xs='12'>
                        <h6 className={"appTextColor loginTitle"}>{t('searchDetails')}​</h6>
                        <Row>
                            {/* <Col lg="1" md="1"  className="pr-0">
                            <img src={seqSearchImg} alt="Immunoglobulin variations for Steve​"  />
                        </Col> */}
                            <Col lg="12" md="12" className="p-0 content">
                                <div className="form-group ml-3">
                                    <TextInput
                                        fullWidth={false}
                                        id="searchName"
                                        name="searchName"
                                        label={t('searchName')}
                                        variant="outlined"
                                        onChange={formik.handleChange}
                                        className={classes.searchInput}
                                        value={formik.values.searchName}
                                        error={formik.touched.searchName && Boolean(formik.errors.searchName)}
                                        helperText={formik.touched.searchName && formik.errors.searchName}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <hr />
                    </Col>
                    <Col lg="12" md="12" sm='12' xs='12' className="mb-2">
                        <h6 className={"appTextColor loginTitle"}>{t('cdrhHeavyChain')}</h6>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
                                <TextInput
                                    id="cdrhcseq1"
                                    name="cdrhcseq1"
                                    label={t('cdrhcseq1')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrhcseq1}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrhcseq1 && Boolean(formik.errors.cdrhcseq1)}
                                    helperText={formik.errors.cdrhcseq1}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="hcOption1"
                                    name="hcOption1"
                                    variant="outlined"
                                    type="number"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    className={classes.antibodyNumInput + (" float-left")}
                                    value={formik.values.hcOption1}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.hcOption1 && Boolean(formik.errors.hcOption1)}
                                    helperText={formik.errors.hcOption1}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <TextInput
                                    id="cdrhcseq2"
                                    name="cdrhcseq2"
                                    label={t('cdrhcseq2')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrhcseq2}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrhcseq2 && Boolean(formik.errors.cdrhcseq2)}
                                    helperText={formik.errors.cdrhcseq2}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="hcOption2"
                                    name="hcOption2"
                                    variant="outlined"
                                    type="number"
                                    className={classes.antibodyNumInput + (" float-left")}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formik.values.hcOption2}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.hcOption2 && Boolean(formik.errors.hcOption2)}
                                    helperText={formik.errors.hcOption2}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <TextInput
                                    id="cdrhcseq3"
                                    name="cdrhcseq3"
                                    label={t('cdrhcseq3')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrhcseq3}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrhcseq3 && Boolean(formik.errors.cdrhcseq3)}
                                    helperText={formik.errors.cdrhcseq3}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="hcOption3"
                                    name="hcOption3"
                                    variant="outlined"
                                    type="number"
                                    className={classes.antibodyNumInput + (" float-left")}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formik.values.hcOption3}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.hcOption3 && Boolean(formik.errors.hcOption3)}
                                    helperText={formik.errors.hcOption3}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <h6 className={"appTextColor loginTitle"}>{t('cdrhLightChain')}</h6>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <TextInput
                                    id="cdrlcseq1"
                                    name="cdrlcseq1"
                                    label={t('cdrlcseq1')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrlcseq1}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrlcseq1 && Boolean(formik.errors.cdrlcseq1)}
                                    helperText={formik.errors.cdrlcseq1}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="lcOption1"
                                    name="lcOption1"
                                    variant="outlined"
                                    type="number"
                                    className={classes.antibodyNumInput + (" float-left")}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formik.values.lcOption1}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lcOption1 && Boolean(formik.errors.lcOption1)}
                                    helperText={formik.errors.lcOption1}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <TextInput
                                    id="cdrlcseq2"
                                    name="cdrlcseq2"
                                    label={t('cdrlcseq2')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrlcseq2}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrlcseq2 && Boolean(formik.errors.cdrlcseq2)}
                                    helperText={formik.errors.cdrlcseq2}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="lcOption2"
                                    name="lcOption2"
                                    variant="outlined"
                                    type="number"
                                    className={classes.antibodyNumInput + (" float-left")}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formik.values.lcOption2}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lcOption2 && Boolean(formik.errors.lcOption2)}
                                    helperText={formik.errors.lcOption2}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <TextInput
                                    id="cdrlcseq3"
                                    name="cdrlcseq3"
                                    label={t('cdrlcseq3')}
                                    variant="outlined"
                                    className={classes.searchInput + (" float-left ml-3 mr-2")}
                                    value={formik.values.cdrlcseq3}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cdrlcseq3 && Boolean(formik.errors.cdrlcseq3)}
                                    helperText={formik.errors.cdrlcseq3}
                                    disabled={authInfo && authInfo.redo}
                                />
                                <TextInput
                                    fullWidth={false}
                                    id="lcOption3"
                                    name="lcOption3"
                                    variant="outlined"
                                    type="number"
                                    className={classes.antibodyNumInput + (" float-left")}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formik.values.lcOption3}
                                    onKeyDown={UtilsService.restrictCharacter}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lcOption3 && Boolean(formik.errors.lcOption3)}
                                    helperText={formik.errors.lcOption3}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>

                        <hr />
                    </Col>
                    <Col lg="12" md="12" sm='12' xs='12' className="mb-2">
                        <h6 className={"appTextColor loginTitle"}>{t('heavyLightChain')}</h6>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0 content">
                                <Col lg="3" md="3" sm='3' xs='3' className="p-0 float-left">
                                    <SelectBox
                                        margin="normal"
                                        variant="outlined"
                                        name="strategy"
                                        id="strategy"
                                        items={Constant['strategiesAB']}
                                        value={formik.values.strategy}
                                        onChange={formik.handleChange}
                                        className={"float-left ml-3"}
                                        disabled={authInfo && authInfo.redo}
                                    />
                                </Col>
                                <Col lg="9" md="9" sm='9' xs='9' className={"p-0 content " + (formik.values.strategy == "genepast" ? 'd-block' : 'd-none')}>
                                    <Typography className="ml-5 mr-1 mt-2 float-left">Require</Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="percId"
                                        name="percId"
                                        variant="outlined"
                                        type="number"
                                        className={(" w-12 float-left")}
                                        value={formik.values.percId}
                                        InputProps={{ inputProps: { min: 65, max: 100 } }}
                                        onKeyDown={UtilsService.restrictCharacter}
                                        onChange={formik.handleChange}
                                        error={formik.touched.percId && Boolean(formik.errors.percId)}
                                        helperText={formik.errors.percId}
                                        disabled={authInfo && authInfo.redo}
                                    />
                                    <Typography className="mx-2 mt-2 float-left">% Identity over the Chain Sequence</Typography>
                                </Col>
                                <Col lg="9" md="9" sm='9' xs='9' className={"p-0 content " + (formik.values.strategy == "blast" ? 'd-block' : 'd-none')}>
                                    <Typography className="ml-5 mr-1 mt-2 float-left">Expect Cutoff</Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="expectCutoff"
                                        name="expectCutoff"
                                        variant="outlined"
                                        type="text"
                                        className={classes.antibodyNumInput + (" float-left")}
                                        value={formik.values.expectCutoff}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                        onChange={formik.handleChange}
                                        error={formik.touched.expectCutoff && Boolean(formik.errors.expectCutoff)}
                                        helperText={formik.errors.expectCutoff}
                                        disabled={authInfo && authInfo.redo}
                                    />
                                    <Typography className="mx-2 mt-2 float-left">Word Size</Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="wordSize"
                                        name="wordSize"
                                        variant="outlined"
                                        type="number"
                                        className={classes.antibodyNumInput + (" float-left")}
                                        value={formik.values.wordSize}
                                        InputProps={{ inputProps: { min: 2, max: 3 } }}
                                        onKeyDown={UtilsService.restrictCharacter}
                                        onChange={formik.handleChange}
                                        error={formik.touched.wordSize && Boolean(formik.errors.wordSize)}
                                        helperText={formik.errors.wordSize}
                                        disabled={authInfo && authInfo.redo}
                                    />
                                </Col>
                                <Col lg="12" md="12" sm='12' xs='12' className="p-0 content float-left">
                                    <div className="form-group px-3 ">
                                        <TextInput
                                            rowsMax="4"
                                            rows="4"
                                            multiline={true}
                                            fullWidth
                                            id="hcFullSeq"
                                            name="hcFullSeq"
                                            label={t('hcFullSeq')}
                                            variant="outlined"
                                            value={formik.values.hcFullSeq}
                                            onChange={formik.handleChange}
                                            error={formik.touched.hcFullSeq && Boolean(formik.errors.hcFullSeq)}
                                            helperText={formik.errors.hcFullSeq}
                                            disabled={authInfo && authInfo.redo}
                                        />
                                    </div>
                                    <div className="form-group px-3">
                                        <TextInput
                                            rowsMax="4"
                                            rows="4"
                                            multiline={true}
                                            fullWidth
                                            id="lcFullSeq"
                                            name="lcFullSeq"
                                            label={t('lcFullSeq')}
                                            variant="outlined"
                                            value={formik.values.lcFullSeq}
                                            onChange={formik.handleChange}
                                            error={formik.touched.lcFullSeq && Boolean(formik.errors.lcFullSeq)}
                                            helperText={formik.errors.lcFullSeq}
                                            disabled={authInfo && authInfo.redo}
                                        />
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <hr />
                    </Col>
                    <Col lg="12" md="12" sm='12' xs='12' className="mb-2">
                        <span className={showDBRequiredError ? 'd-block' : 'd-none'} style={{ color: '#f44336', fontSize: '13px', fontStyle: 'italic', marginBottom: '5px' }}>
                            {t('dbMandatoryErr')}
                        </span>
                        <h6 className={"appTextColor loginTitle mb-2 "}>{t('patientDBSearch')}</h6>
                        <Row className="mb-2">
                            <Col lg="4" md="4" sm='4' xs='4' className="p-0 content">
                                {patientDBData.map((values, i) => {
                                    // Return the element. Also pass key     
                                    return (<div className="float-left w-100 content" key={"id-" + values.value}>
                                        <CheckBox
                                            // defaultChecked
                                            // checked={true}
                                            checked={values.selected}
                                            color="primary"
                                            className={"float-left mx-2 " + (values.ticked ? 'd-block' : 'd-none')}
                                            name={values.value}
                                            id={values.value}
                                            key={values.value}
                                            onChange={(e) => handleCheckbox(e, i)}
                                        // onChange={() => { setIspublishGQUnknownDates(!ispublishGQUnknownDates) }}
                                        />
                                        <Typography className={"float-left mt-1 w-75 " + (values.ticked ? 'd-block' : 'd-none')}>
                                            {values.label}
                                        </Typography>
                                    </div>)
                                })}
                            </Col>
                        </Row>

                        {proPersonalData && _.size(proPersonalData) > 0 && <div>
                            <Accordion expanded={formCheck6} onChange={() => setformCheck6(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                    <p className="subHeading m-0">
                                        {formCheck6 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck6 && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("personalProDb")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FolderTreeStructure treeData={proPersonalData} parentCallBack={handleDbChange} dataArray={proDb} seQValue={sequenceTypeValue == "nucleotide" ? "nuc" : "pro"} pageType="ipseq" />
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        }
                        <hr />
                    </Col>
                    <Col lg="12" md="12" xs="12" sm='12' className={"mb-2 " + (authInfo && (authInfo.ppuType == 1 || (authInfo.ppuType == 2 && !authInfo.redo) ? 'd-block' : 'd-none'))}>
                        <div className={(authInfo && (authInfo.ppuType == 1) ? 'd-block' : 'd-none')}>
                            <h6 className={"appTextColor loginTitle"}>{t('ppuuserSearchTitle')}</h6>
                            <h6 className={"appTextColor loginTitle ml-4 "}>{t('ppuuserCreditPrice')}</h6>
                        </div>
                        <div className={(authInfo && (authInfo.ppuType == 2 && !authInfo.redo) ? 'd-block' : 'd-none')}>
                            <h6 className={"appTextColor loginTitle"}>{t('ppuuserSearchTitle')}</h6>
                            <h6 className={"appTextColor loginTitle ml-4 "}>{t('ppubundleCreditPrice')}</h6>
                        </div>
                        <Row className="mb-2">
                            <Col lg="12" md="12" sm='12' xs='12' className="p-0">
                                <CheckBox
                                    // checked={values.selected}
                                    color="primary"
                                    className={"float-left mx-2"}
                                    name="ackSearch"
                                    id="ackSearch"
                                    onChange={() => { setDisableSearch(!disableSearch) }}
                                />
                                <Typography className={"float-left mt-1 w-75"}>
                                    {t('ackAntibodySearch')}
                                </Typography>
                            </Col>
                        </Row>

                        <hr />
                    </Col>
                    {/* <Col lg="12" md="12" className="p-0">
                        <Row>
                            <Col md='4' sm="4" xs="4" className="">
                                <CheckBox
                                    // defaultChecked
                                    color="primary"
                                    className={"float-left ml-2"}
                                    name="saveForm"
                                    id="saveForm"
                                    onChange={setFormValue}
                                    checked={saveFormValue}
                                />
                                <label className={"checkBoxContent" + " bodyText cursorPointer float-left mt-1 mx-2 ml-0 mr-3"} for="saveForm">{t("SaveFormForlaterUse")}</label>
                            </Col>
                            <Col md='6' sm="6" xs="6" >
                                <TextInput
                                    id="formName"
                                    name="formName"
                                    label='Name the form'
                                    variant="outlined"
                                    onChange={formik.handleChange}
                                    fullWidth={true}
                                    disabled={!saveFormValue}
                                    value={formik.values.formName ? formik.values.formName : ""}
                                    error={saveFormValue && Boolean(formik.errors.formName)}
                                    helperText={saveFormValue && formik.errors.formName}
                                />
                            </Col>
                        </Row>
                        <hr />
                    </Col> */}

                    <Col lg="12" md="12" sm='12' xs='12' style={{ display: 'flex', flexDirection: 'row-reverse' }} className="float-right mb-3">
                        <Button variant="contained" className={!disableSearch ? 'cancelButtonDisable' : 'accountInfo'} disabled={!disableSearch} onClick={submitForm}>{t('Search')}</Button>&nbsp;
                        <Button variant="contained" color={'default'} className={classes.loginSubmitCancel} onClick={homePage} type="submit">{t('cancel')}</Button>
                    </Col>
                </Row>

            </form>
            {/* <SearchPrompt searchModal={searchModal} /> */}
            <SeqVIModal
                show={searchModal}
                onMessage={t('searchSubmitted')}
                type="seqSearch"
                saveCallBack={closeSaveModal}
            />
        </div>

    )

}

export default SearchResultAntibody;