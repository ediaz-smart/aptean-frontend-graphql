import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import _ from "lodash";
import Modal from 'react-bootstrap/Modal'


import TextInput from '../../shared/Fields/TextInput';
import SelectBox from '../../shared/Fields/SelectBox';
import Constant from '../../helpers/constant';
import CheckBox from '../../shared/Fields/CheckBox';
import Validate from '../../helpers/validate';
import SearchPrompt from '../../shared/Modal/SearchPromptModal'
import searchResAntibody from '../../services/searchResAntibody';




const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '115px auto 28px',
        minHeight: '260px',
        // borderBottom: '1px solid #cec7c7',
        padding: '23px 16px 14px',
    },
    headerPipe: {
        margin: '0 10px'
    },
    searchInput: {
        width: '30%'
    },
    antibodyNumInput: {
        width: '8%'
    }
}));

function SearchResultAntibody() {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const history = useHistory();
    const [selectData, setSelectData] = useState();
    const [searchModal, setSearchModal] = useState(false);
    // const [strategy, setStrategy] = useState('genepast');
    const [authInfo, setAuthInfo] = useState();
    const [workflowId, setWorkflowId] = useState();
    const [patientDBData, setPatientDBData] = useState(Constant.patientSearchDatabases);
    const [disableSearch, setDisableSearch] = React.useState(false);

    useEffect(async () => {

        const getResponse = await searchResAntibody.getAuthInfoAB(workflowId);
        if(getResponse && getResponse.response_status == 0)
        {
            setAuthInfo(getResponse.response_content);
            setDisableSearch(true);
            if(getResponse.response_content.dbs && getResponse.response_content.dbs.length > 0)
            {
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
                if(!getResponse.response_content.syscontrol_search_submit && getResponse.response_content.className == "adminium")
                {
                    setDisableSearch(false);
                }
            }
            console.log(disableSearch,'disableSearch');
        }
        //dispatch(userActions.logout()); 
    }, []);

    const handleCheckbox = (event, i) => {
        // console.log(event, value); 
        patientDBData[i]['selected'] = event.target.checked;
        // patientDBData[i]['ticked'] = event.target.checked;
        setPatientDBData([...patientDBData]);
    }
    // reset login status

    const formik = useFormik({
        initialValues: {
            searchName: '',
            cdrhcseq1: '',
            cdrhcseq2: '',
            cdrhcseq3: '',
            cdrlcseq1: '',
            cdrlcseq2: '',
            cdrlcseq3: '',
            hcOption1: 0,
            hcOption2: 0,
            hcOption3: 0,
            lcOption1: 0,
            lcOption2: 0,
            lcOption3: 0,
            strategy: 'genepast',
            percId: 80,
            expectCutoff: 10,
            wordSize: 3,
            hcFullSeq: '',
            lcFullSeq: ''
        },
        validationSchema: Validate.AntibodySearchValidation(),
        onSubmit: async (values) => {
            console.log(values, 'values');
            let { searchName, cdrhcseq1, cdrhcseq2, cdrhcseq3, cdrlcseq1, cdrlcseq2, cdrlcseq3, hcOption1, hcOption2, hcOption3, lcOption1, lcOption2, lcOption3, strategy, percId, expectCutoff, wordSize, hcFullSeq, lcFullSeq } = values;
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
                toast.error(t('dbMandatoryErr'));
                return false;
            }
            let strategyItem = _.find(Constant['strategies'], function (obj) {
                return obj.value == strategy;
            });
            // console.log(strategyItem,'strategyItem');
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
                parent_id: parentId
            }
            // console.log(postData, 'postData');
            const getResponse = await searchResAntibody.submitAnitbodySearch(postData, history, t);
            setSearchModal(false);
            if (getResponse && getResponse.response_status == 0) {
                history.push('/home');
            } else {
                toast.error('Error in Search');
            }

            // console.log(getResponse, 'getResponse');
            // history.push('/home');
        },
    });
    return (
        <div className={classes.grow}>
            <form name="antibodySearchForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>

                <Row>
                    <Col lg="12" md="12" className={"mb-2 "+(authInfo && !authInfo.syscontrol_search_submit ? 'd-block':'d-none') }>
                        <Typography className="text-danger">
                            {t('ABsearchDisableText')}
                            {authInfo && authInfo.syscontrol_search_submit_txt}
                            {t('patienceThanksText')}</Typography>
                    </Col>
                    <Col lg="12" md="12">
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
                    <Col lg="12" md="12" className="mb-2">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('hcOption1', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.hcOption1 && Boolean(formik.errors.hcOption1)}
                                    helperText={formik.errors.hcOption1}

                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('hcOption2', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.hcOption2 && Boolean(formik.errors.hcOption2)}
                                    helperText={formik.errors.hcOption2}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('hcOption3', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.hcOption3 && Boolean(formik.errors.hcOption3)}
                                    helperText={formik.errors.hcOption3}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <h6 className={"appTextColor loginTitle"}>{t('cdrhLightChain')}</h6>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('lcOption1', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.lcOption1 && Boolean(formik.errors.lcOption1)}
                                    helperText={formik.errors.lcOption1}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('lcOption2', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.lcOption2 && Boolean(formik.errors.lcOption2)}
                                    helperText={formik.errors.lcOption2}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col lg="12" md="12" className="p-0 content">
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
                                    onChange={e => {
                                        if (!Number.isNaN(Number(e.target.value))) {
                                            formik.setFieldValue('lcOption3', Number(e.target.value))
                                        }
                                    }}
                                    error={formik.touched.lcOption3 && Boolean(formik.errors.lcOption3)}
                                    helperText={formik.errors.lcOption3}
                                />
                                <Typography className="mx-2 mt-2 float-left">{t('missmatchAllow')}</Typography>
                            </Col>
                        </Row>

                        <hr />
                    </Col>
                    <Col lg="12" md="12" className="mb-2">
                        <h6 className={"appTextColor loginTitle"}>{t('heavyLightChain')}</h6>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0 content">
                                <Col lg="2" md="2" className="p-0 float-left">
                                    <SelectBox
                                        margin="normal"
                                        variant="outlined"
                                        name="strategy"
                                        id="strategy"
                                        items={Constant['strategies']}
                                        value={formik.values.strategy}
                                        onChange={formik.handleChange}
                                        className={"float-left ml-3"}
                                    />
                                </Col>
                                <Col lg="7" md="7" className={"p-0 content " + (formik.values.strategy == "genepast" ? 'd-block' : 'd-none')}>
                                    <Typography className="ml-4 mr-1 mt-2 float-left">Require</Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="percId"
                                        name="percId"
                                        // value={hcOption1}
                                        variant="outlined"
                                        type="number"
                                        className={(" w-12 float-left")}
                                        value={formik.values.percId}
                                        InputProps={{ inputProps: { min: 65, max: 100 } }}
                                        onChange={e => {
                                            if (!Number.isNaN(Number(e.target.value))) {
                                                formik.setFieldValue('percId', Number(e.target.value))
                                            }
                                        }}
                                        error={formik.touched.percId && Boolean(formik.errors.percId)}
                                        helperText={formik.errors.percId}
                                    />
                                    <Typography className="mx-2 mt-2 float-left">% Identity over the Chain Sequence</Typography>
                                </Col>
                                <Col lg="9" md="9" className={"p-0 content " + (formik.values.strategy == "blast" ? 'd-block' : 'd-none')}>
                                    <Typography className="ml-4 mr-1 mt-2 float-left">Expect Cutoff</Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="expectCutoff"
                                        name="expectCutoff"
                                        variant="outlined"
                                        type="number"
                                        className={classes.antibodyNumInput + (" float-left")}
                                        value={formik.values.expectCutoff}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                        onChange={e => {
                                            if (!Number.isNaN(Number(e.target.value))) {
                                                formik.setFieldValue('expectCutoff', Number(e.target.value))
                                            }
                                        }}
                                        error={formik.touched.expectCutoff && Boolean(formik.errors.expectCutoff)}
                                        helperText={formik.errors.expectCutoff}
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
                                        onChange={e => {
                                            if (!Number.isNaN(Number(e.target.value))) {
                                                formik.setFieldValue('wordSize', Number(e.target.value))
                                            }
                                        }}
                                        error={formik.touched.wordSize && Boolean(formik.errors.wordSize)}
                                        helperText={formik.errors.wordSize}
                                    />
                                </Col>
                                <Col lg="12" md="12" className="p-0 content float-left">
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
                                        />
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <hr />
                    </Col>
                    <Col lg="12" md="12" className="mb-2">
                        <h6 className={"appTextColor loginTitle"}>{t('patientDBSearch')}</h6>
                        <Row className="mb-2">
                            <Col lg="4" md="4" className="p-0 content">
                                {patientDBData.map((values, i) => {
                                    // Return the element. Also pass key     
                                    return (<div className="float-left w-100 content" key={"id-" + values.value}>
                                        <CheckBox
                                            // defaultChecked
                                            // checked={true}
                                            checked={values.selected}
                                            color="primary"
                                            className={"float-left mx-2 "+(values.ticked ? 'd-block':'d-none')}
                                            name={values.value}
                                            id={values.value}
                                            key={values.value}
                                            onChange={(e) => handleCheckbox(e, i)}
                                        // onChange={() => { setIspublishGQUnknownDates(!ispublishGQUnknownDates) }}
                                        />
                                        <Typography className={"float-left mt-2 w-75 "+(values.ticked ? 'd-block':'d-none')}>
                                            {values.label}
                                        </Typography>
                                    </div>)
                                })}
                            </Col>
                        </Row>
                        <hr />
                    </Col>
                    <Col lg="12" md="12" className={"mb-2 "+(authInfo && (authInfo.ppuType == 1 || (authInfo.ppuType == 2 && !authInfo.redo) ? 'd-block':'d-none'))}>
                        <div className={(authInfo && (authInfo.ppuType == 1) ? 'd-block':'d-none')}>
                            <h6 className={"appTextColor loginTitle"}>{t('ppuuserSearchTitle')}</h6>
                            <h6 className={"appTextColor loginTitle ml-4 "}>{t('ppuuserCreditPrice')}</h6>
                        </div>
                        <div className={(authInfo && (authInfo.ppuType == 2 && !authInfo.redo) ? 'd-block':'d-none')}>
                            <h6 className={"appTextColor loginTitle"}>{t('ppuuserSearchTitle')}</h6>
                            <h6 className={"appTextColor loginTitle ml-4 "}>{t('ppubundleCreditPrice')}</h6>
                        </div>
                        <Row className="mb-2">
                            <Col lg="12" md="12" className="p-0">
                                <CheckBox
                                    // checked={values.selected}
                                    color="primary"
                                    className={"float-left mx-2"}
                                    name="ackSearch"
                                    id="ackSearch"
                                    onChange={() => { setDisableSearch(!disableSearch) }}
                                />
                                <Typography className={"float-left mt-2 w-75"}>
                                    {t('ackAntibodySearch')}
                                </Typography>
                            </Col>
                        </Row>
                        <hr />
                    </Col>
                    <Col lg="12" md="12" className="float-right mb-3">
                        <Button color={!disableSearch ? 'default':'primary'} variant="contained" className={" text-capitalize mr-2 float-right "+(!disableSearch ? 'disableBtnBorder' : 'primaryBtn')} type="submit" disabled={!disableSearch}>{t('search')}</Button>&nbsp;&nbsp;&nbsp;
                    <Button variant="contained" color={'default'} className={"text-capitalize mr-2 disableBtnBorder float-right"} type="submit">{t('cancel')}</Button>
                    </Col>
                </Row>

            </form>
            <SearchPrompt searchModal={searchModal} />
        </div>

    )

}

export default SearchResultAntibody;