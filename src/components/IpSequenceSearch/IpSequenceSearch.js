import React, { useState, useEffect } from 'react';
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
        fontSize: '14px'
    },
    seqText:{
        margin:'14px 0'
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
        width: '28%',
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
        margin: '12px 0'
    },
}))(MuiAccordionDetails);

function MostUsedPanel() {
    const { t, i18n } = useTranslation('common');

    const classes = useStyles();

    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);
    const [seqDBFilter, setSeqDBFilter] = React.useState(true);
    const maxResidues = '100,000';
    return (
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
                            <Col>
                                    <Typography className={"float-left "+classes.seqText}>
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
                                <Typography className={"float-left "+classes.seqText}>
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
                                    <Typography className={"float-left "+classes.seqText}>
                                        &nbsp;&nbsp;&nbsp;Residues in length
                                    </Typography>
                                </Col>
                        </AccordionDetails>
                    </Accordion>
                </Col>
                <Col md="1">
                    <Link className="float-right mr-2">Help</Link>
                </Col>
            </Row>
        </div>

    );
}

export default MostUsedPanel;