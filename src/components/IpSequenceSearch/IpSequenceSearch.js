import React, { useState, useEffect, Fragment } from 'react';
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
        padding: '23px 0 5px'
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

function MostUsedPanel() {
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
    return (
        <Fragment>
            {/* viswes changes starts */}
            <Container className="mt-100">
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

                </form>

            </Container>
            {/* viswes changes ends */}
            <div className={classes.grow}>
                <Row>
                    <Col md="11">
                        <Accordion square expanded={seqDBFilter} onChange={() => setSeqDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <p className="appTextColor m-0">
                                    {seqDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!seqDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>General Sequence Database Filters​</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails>
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
                                    />
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="1">
                        <Link className="float-right mr-2">Help</Link>
                    </Col>
                </Row>
            </div>
        </Fragment>

    );
}

export default MostUsedPanel;