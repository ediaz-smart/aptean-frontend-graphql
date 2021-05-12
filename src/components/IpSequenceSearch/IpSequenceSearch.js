import React, { useState, useEffect,Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, useHistory } from 'react-router-dom';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TextInput from '../../shared/Fields/TextInput';
import Typography from '@material-ui/core/Typography';
import CheckBox from '../../shared/Fields/CheckBox';
import SelectBox from '../../shared/Fields/SelectBox';
import DatePicker from '../../shared/Fields/DatePicker';
import TextArea from '../../shared/Fields/TextArea';
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { submitLogin } from '../../reducers/slice/loginSlice';
import Validate from '../../helpers/validate';



const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '135px auto 28px',
        minHeight: '260px',
        borderBottom: '1px solid #cec7c7',
        padding: '23px 13px 5px'
    },
    arrowIcon: {
        fontSize: '2.5rem',
        marginTop: '-2px'
    },
    arrowIconTitle: {
        marginLeft: '-8px',
        fontSize: '16px'
    },
    seqText: {
        margin: '16px 10px'
    },
    '@media (min-width: 768px)': {
        desktopHelpLink: {
            display: 'block'
        },
        mobileHelpLink: {
            display: 'none'
        }
    },
    '@media (max-width: 760px)': {
        desktopHelpLink: {
            display: 'none'
        },
        mobileHelpLink: {
            display: 'block'
        }
    }
}));

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
        width: '32%',
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
        padding: '0 35px',
        margin: '12px 0',
        display: 'block'
    },
}))(MuiAccordionDetails);

function IpSeqSearch() {
    const { t, i18n } = useTranslation('common');

    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            searchDetails: '',
        },
        // validationSchema: Validate.LoginValidate(),
        onSubmit: async (values) => {
            // dispatch(submitLogin({GQUSERID: values.userName, GQPASSWORD: values.password}));
            // history.push('/home');
        },
    });
    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);
    const [seqDBFilter, setSeqDBFilter] = React.useState(true);
    const [specificDBFilter, setSpecificDBFilter] = React.useState(true);
    const maxResidues = '100,000';
    const docPublicSel = [
        {
            value: "before",
            label: "Before"
        },
        {
            value: "beforeempty",
            label: "Before or is empty"
        },
        {
            value: "after",
            label: "After"
        },
        {
            value: "afterempty",
            label: "Aftre or is empty"
        }
    ];
    const GQSpecificSel = [
        {
            value: "islessthanequal",
            label: "is less than or equal to"
        },
        {
            value: "islessthan",
            label: "is less than"
        },
        {
            value: "equals",
            label: "equals"
        },
        {
            value: "doesnotequal",
            label: "does not equal"
        }
    ];
    return (
            <div className={classes.grow}>
                <form name="ipSequenceSearchForm" onSubmit={formik.handleSubmit}>
                 <Row>
                        <Col md="6">
                            <p className="loginTitle">{t('searchDetails')}</p>
                            <div className="form-group">
                                <TextInput
                                    fullWidth
                                    id="searchDetails"
                                    name="searchDetails"
                                    label={t('nameYourSearch')}
                                    variant="outlined"
                                    value={formik.values.searchDetails}
                                    onChange={formik.handleChange}
                                    error={formik.touched.searchDetails && Boolean(formik.errors.searchDetails)}
                                    helperText={formik.touched.searchDetails && formik.errors.searchDetails}
                                />
                            </div>
                        </Col>
                        <hr />
                        <Col md="12">
                            <Row>
                                <Col sm="12" md="9">
                                    <p className="loginTitle">{t('querySequences')}</p>
                                </Col>
                                <Col sm="12" md="3" className={"rightAlign"}>
                                    <Link className={"appTextFont appLinkColor"} to="/help">{t('help')}</Link>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md="10">
                                    <div className="form-group">
                                        <TextArea
                                            rowsMax="8"
                                            rowsMin="8"
                                            fullWidth
                                            id="querySequences"
                                            name="querySequences"
                                            placeholder={t('querySequencesPlaceHolder')}
                                            variant="outlined"
                                            value={formik.values.querySequences}
                                            onChange={formik.handleChange}
                                            error={formik.touched.querySequences && Boolean(formik.errors.querySequences)}
                                            helperText={formik.touched.querySequences && formik.errors.querySequences}
                                        />
                                    </div>
                                </Col>
                                <Col md="2"></Col>
                            </Row>

                        </Col>
                    </Row>

                <Row>
                    <Col md="11">
                        <Accordion square expanded={seqDBFilter} onChange={() => setSeqDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="appTextColor">
                                <p className="appTextColor m-0">
                                    {seqDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!seqDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>General Sequence Database Filters​</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails className="appTextColor">
                                <Col md="12">
                                    <Typography className={"float-left " + classes.seqText}>
                                        Search Only Sequence Between&nbsp;&nbsp;&nbsp;
                                    </Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="minResidues"
                                        name="minResidues"
                                        label={6}
                                        variant="outlined"
                                        // value={formik.values.minResidues}
                                        // onChange={formik.handleChange} 
                                        // error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                        // helperText={formik.touched.minResidues && formik.errors.minResidues}
                                        class={"float-left"}
                                    />
                                    <Typography className={"float-left " + classes.seqText}>
                                        &nbsp;&nbsp;and&nbsp;&nbsp;
                                    </Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="maxResidues"
                                        name="maxResidues"
                                        label={maxResidues}
                                        variant="outlined"
                                        // value={formik.values.minResidues}
                                        // onChange={formik.handleChange} 
                                        // error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                        // helperText={formik.touched.minResidues && formik.errors.minResidues}
                                        class={"float-left"}
                                    />
                                    <Typography className={"float-left " + classes.seqText}>
                                        &nbsp;&nbsp;&nbsp;Residues in length
                                    </Typography>
                                </Col>
                                <br clear="all"></br>
                                <br clear="all"></br>
                                <Col md="12">
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        class={"float-left"}
                                        name="isDocumentPublic"
                                        id="isDocumentPublic"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Document Publication Date is &nbsp;&nbsp;&nbsp;
                                    </Typography>
                                    <SelectBox
                                        margin="normal"
                                        variant="outlined"
                                        name="docPublicSel"
                                        id="docPublicSel"
                                        value=""
                                        items={docPublicSel}
                                        class={"float-left"}
                                    />
                                    <DatePicker
                                        margin="normal"
                                        id="docPublicDate"
                                        name="docPublicDate"
                                        format="dd/MM/yyyy"
                                        label="Date picker inline"
                                        value
                                        inputVariant="outlined"
                                        class={"float-left m-0 ml-4"}
                                    />
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        class={"float-left mx-2"}
                                        name="includeGenUnknownDate"
                                        id="includeGenUnknownDate"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Include unknown dates
                                </Typography>
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="1" className={classes.desktopHelpLink}>
                        <Link className="float-right mr-2">Help</Link>
                    </Col>
                    <Col md="12">
                        <Accordion square expanded={specificDBFilter} onChange={() => setSpecificDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="appTextColor">
                                <p className="appTextColor m-0">
                                    {specificDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!specificDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>GQ-Pat specific Database Filters​</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails className="appTextColor">
                                <Col md="12">
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        class={"float-left"}
                                        name="publishGenomeQuest"
                                        id="publishGenomeQuest"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Published in GenomeQuest &nbsp;&nbsp;&nbsp;
                                    </Typography>
                                    <SelectBox
                                        margin="normal"
                                        variant="outlined"
                                        name="publishGQSel"
                                        id="publishGQSel"
                                        value=""
                                        items={docPublicSel}
                                        class={"float-left"}
                                    />
                                    <DatePicker
                                        margin="normal"
                                        id="publishGQDate"
                                        name="publishGQDate"
                                        format="dd/MM/yyyy"
                                        value
                                        inputVariant="outlined"
                                        class={"float-left m-0 ml-4"}
                                    />
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        class={"float-left mx-2"}
                                        name="includeGQSpecificDate"
                                        id="includeGQSpecificDate"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Include unknown dates
                                </Typography>
                                </Col>
                                <br clear="all"></br>
                                <br clear="all"></br>
                                <Col md="12">
                                    <CheckBox
                                        color="primary"
                                        class={"float-left"}
                                        name="isPatientDoc"
                                        id="isPatientDoc"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Patient Document contains &nbsp;&nbsp;&nbsp;
                                </Typography>
                                    <SelectBox
                                        margin="normal"
                                        variant="outlined"
                                        name="patientDocSel"
                                        id="patientDocSel"
                                        value=""
                                        items={GQSpecificSel}
                                        class={"float-left"}
                                    />
                                    <TextInput
                                        fullWidth={false}
                                        id="patientDocInp"
                                        name="patientDocInp"
                                        label={maxResidues}
                                        variant="outlined"
                                        // value={formik.values.minResidues}
                                        // onChange={formik.handleChange} 
                                        // error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                        // helperText={formik.touched.minResidues && formik.errors.minResidues}
                                        class={"float-left mx-4"}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Sequences
                                </Typography>
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="12" className={classes.mobileHelpLink}>
                        <Link className="float-right mr-2">Help</Link>
                    </Col>
                </Row>

                </form>
            </div>
    );
}

export default IpSeqSearch;