import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Col } from 'react-bootstrap';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useParams } from 'react-router-dom';

import Footer from '../../shared/footer';
import fulltextsearch from '../../services/fulltextsearch';
import fullTextService from '../../services/fulltextsearch';

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
        margin: '0',
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
    arrowIcon: {
        fontSize: '2.5rem',
        marginTop: '-2px'
    },
    arrowIconTitle: {
        marginLeft: '-8px'
    },
    fixBottom: {
        position: "fixed",
        bottom: "0",
        margin: "0 auto",
        maxWidth: "1024px",
        background: "#fff",
        zIndex: "1",
        width: "100%",
        textAlign: "center"
    },
    paddingBottom: {
        paddingBottom: "60px !important"
    },
    parentDiv: {
        height: "100%",
        width: "100%",
        overflow: "hidden"
    },
    childDiv: {
        width: "100%",
        paddingRight: "15px",
        boxSizing: "content-box"
    },
    // centerFix: {
    //     margin: "auto",
    //     width: "79%",
    //     fontSize: "10px"
    // },
    bottomContent: {
        fontSize: "13px",
        fontFamily: "Arial, Helvetica, sans-serif, Helvetica Neue",
        color: "#337AB7",
        fontWeight: "400",
        textDecoration: "none",
        cursor: "pointer"
    }

}));

function FullDocumentView() {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const { patentId } = useParams();
    //state
    const [isAbstractOpen, setIsAbstractOpen] = useState(true);
    const [isClaimsOpen, setIsClaimsOpen] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isClassificaitonOpen, setIsClassificationOpen] = useState(true);
    const [isLegalEventsOpen, setIsLegalEventsOpen] = useState(true);
    const [isUsPairOpen, setUsPairOpen] = useState(true);
    const [isCitationsOpen, setIsCitationsOpen] = useState(true);
    const [docContent, setDocContent] = useState({});

    useEffect(async () => {
        let getResponse;
        if (patentId) {
            getResponse = await fullTextService.fullDocViewService(null, patentId);
        }
        if (getResponse && getResponse.response_status && getResponse.response_status == 0) {
            setDocContent(getResponse.response_content);
        }
    });

    const handleScroll = (e, id) => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }
    const { abstracts } = docContent;
    return (
        <div className="mt-4 pl-5 pr-5">
            <div className={classes.parentDiv}>
                <div className={classes.childDiv}>
                    <p className="subHeading" id="title">{t('fullDocViewTitle')}</p>
                    <Row>
                        <Col lg="9">
                            <Accordion square expanded={isAbstractOpen} onChange={() => setIsAbstractOpen(prevState => !prevState)} id="abstract">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isAbstractOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isAbstractOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("abstract")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample abstract</p>
                                    {/* {abstracts && abstracts.length >0 && abstracts.forEach(item => {
                                    // {item.langCode == "en" && <p>{item.</p>}
                                })} */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion square expanded={isClaimsOpen} onChange={() => setIsClaimsOpen(prevState => !prevState)} id="claims">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isClaimsOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isClaimsOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("claims")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample claims</p>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion square expanded={isDescriptionOpen} onChange={() => setIsDescriptionOpen(prevState => !prevState)} id="description">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isDescriptionOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isDescriptionOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("description")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample deacription</p>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion square expanded={isClassificaitonOpen} onChange={() => setIsClassificationOpen(prevState => !prevState)} id="classifications">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isClassificaitonOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isClassificaitonOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("classifications")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample classification</p>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion square expanded={isLegalEventsOpen} onChange={() => setIsLegalEventsOpen(prevState => !prevState)} id="legalEvents">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isLegalEventsOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isLegalEventsOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("legalEvents")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample legal events</p>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion square expanded={isUsPairOpen} onChange={() => setUsPairOpen(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0" id="usPair">
                                    <p className="subHeading m-0">
                                        {isUsPairOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isUsPairOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("usPair")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample us pair</p>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion square expanded={isCitationsOpen} onChange={() => setIsCitationsOpen(prevState => !prevState)} id="citations">
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                    <p className="subHeading m-0">
                                        {isCitationsOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!isCitationsOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <span className={classes.arrowIconTitle}>{t("citations")}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails className="appTextColor">
                                    <p>Sample citations</p>
                                </AccordionDetails>
                            </Accordion>
                        </Col>
                        <Col lg="3">
                            <p className="subHeading">{t("fullDocSummary")}</p>
                            <p>Sample summary</p>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className={classes.fixBottom}>
                <hr />
                <p className={classes.centerFix}>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'title')}>{t('titleFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'abstract')}>{t('abstractFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'claims')}>{t('claimsFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'description')}>{t('descriptionFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'classifications')}>{t('classificationsFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'legalEvents')}>{t('legalEventsFooter')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'usPair')}>{t('usPair')}</span>
                    <span className="m-1">|</span>
                    <span className={"m-1 " + classes.bottomContent} onClick={(e) => handleScroll(e, 'citations')}>{t('citationsFooter')}</span>
                </p>
                <Footer hideMarginTop={true} />
            </div>
        </div>
    )
}

export default FullDocumentView;