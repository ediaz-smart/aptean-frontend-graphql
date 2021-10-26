import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Col } from 'react-bootstrap';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useParams, useHistory } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import DataTable from "react-data-table-component";

import Footer from '../../shared/footer';
import fullTextService from '../../services/fulltextsearch';
import { property } from 'lodash';
import {usBaseUrl, ipcBaseUrl, ipcrBaseUrl, cpcBaseUrl } from '../../config';

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
    const history = useHistory();
    //state
    const [isAbstractOpen, setIsAbstractOpen] = useState(true);
    const [isClaimsOpen, setIsClaimsOpen] = useState(true);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isClassificaitonOpen, setIsClassificationOpen] = useState(true);
    const [isLegalEventsOpen, setIsLegalEventsOpen] = useState(true);
    const [isUsPairOpen, setUsPairOpen] = useState(true);
    const [isCitationsOpen, setIsCitationsOpen] = useState(true);
    const [docContent, setDocContent] = useState({});
    const [classificationData, setClassificationData] = useState([]);

    //substate
    //usPair
    const [isbilboDataOpen, setIsBilboDataOpen] = useState(false);
    const [istransactionHistoryOpen, setIsTrasactionHistoryOpen] = useState(false);
    const [isPTAOpen, setIsPTAOpen] = useState(false); //Patent Term Adjustments
    const [iscontinuityDataOpen, setIsContinuityDataOpen] = useState(false);
    const [isPTEOpen, setIsPTEOPen] = useState(false); //patent Term Extensions
    //citations
    const [isPatentCitationOpen, setIsPatentCitationOpen] = useState(false);
    const [isNonPatentCitationOpen, setIsNonPatentCitationOpen] = useState(false);
    const [isforwardCitationsOpen, setIsforwardCitationsOpen] = useState(false);

    //summary
    const [legalStatus, setLegalStatus] = useState();
    const [pubDate, setPubDate] = useState();
    const [filingDate, setFilingDate] = useState();
    const [appNum, setAppNum] = useState();
    const [appAssignees, setAppAssignees] = useState([]);
    const [inventors, setInventors] = useState([]);
    const [latestLegal, setLatestLegal] = useState([]);
    const [linkouts, setLinkouts] = useState();
    const [priorities, setPriorities] = useState([]);
    const [simFamMembers, setSimFamMembers] = useState([]);
    const [extenFamMembers, setExtenFamMembers] = useState([]);

    //legal
    const [legalEvents, setLegalEvents] = useState([]);

    useEffect(async () => {
        let getResponse;
        if (patentId) {
            getResponse = await fullTextService.fullDocViewService(null, patentId);
        }
        if (getResponse && getResponse.response_status == 0) {
            setDocContent(getResponse.response_content);

            setLegalEvents(formatLegal(getResponse.response_content.legalEvents));

            //setSummaryBlock(getResponse.response_content);
            setLegalStatus(getResponse.response_content.publicationType ? getResponse.response_content.publicationType : 'Not Available');
            setPubDate(getResponse.response_content.publicationDate ? formatDate(getResponse.response_content.publicationDate) : 'Not Available');
            setFilingDate(getResponse.response_content.applicationDate ? formatDate(getResponse.response_content.applicationDate) : 'Not Available');
            setAppNum(getResponse.response_content.applicationDocNum ? getResponse.response_content.applicationCountry + "" + getResponse.response_content.applicationDocNum : 'Not Available');
            setAppAssignees(getResponse.response_content.applicants ? formatAssignees(getResponse.response_content.applicants)[0] : ['Not Available']);
            setInventors(getResponse.response_content.inventors ? formatInventors(getResponse.response_content.inventors) : ['Not Available']);
            setLatestLegal(getResponse.response_content.legalEvents ? formatLatestLgal(getResponse.response_content.legalEvents) : 'Not Available');
            setLinkouts(getResponse.response_content.legalStatus ? getResponse.response_content.legalStatus : 'Not Available');
            setPriorities(getResponse.response_content.priorityClaims ? formatPriorities(getResponse.response_content.priorityClaims) : 'Not Available');
            setSimFamMembers(getResponse.response_content.patentFamily.simpleFamilyMbrs ? getResponse.response_content.patentFamily.simpleFamilyMbrs : 'None');
            setExtenFamMembers(getResponse.response_content.legalStatus ? getResponse.response_content.legalStatus : 'None');

            const { internationalClasses, cooperativeClasses, nationalMainClass, nationalFurtherClasses, ipcMainClass, ipcFurtherClasses } = getResponse.response_content;
                setClassification(internationalClasses, cooperativeClasses, nationalMainClass, nationalFurtherClasses, ipcMainClass, ipcFurtherClasses);
        }
    }, []);

    function formatDate(dateString) {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let date = new Date(dateString);
        let strDate = date.toLocaleDateString("en-US", options) + "";

        return strDate;
    }

    function formatAssignees(assigneesObject) {
        let assignees = [];
        assigneesObject.forEach((object) => {
            object.addressBooks.forEach((names) => {
                assignees.push(names.nameOrgName);
            });
        });

        return assignees;
    }

    function formatInventors(inventorsObject) {
        let inventors = [];
        inventorsObject.forEach((object) => {
            if (object.format == null) {
                object.addressBooks.forEach((names) => {
                    if ((names.nameFirstName != null || names.nameLastName)) {

                        let fName = names.nameFirstName ? names.nameFirstName : "";
                        let mName = names.nameMiddleName ? names.nameMiddleName : "";
                        let lName = names.nameLastName ? names.nameLastName : "";

                        inventors.push(fName + " " + mName + " " + lName + ", ");
                    } else {
                        if (names.name) {
                            inventors.push(names.name + ", ");
                        }
                    }
                });
            }
        });

        return inventors;
    }

    function formatLegal(eventsObject) {
        let legalEvents = [];
        eventsObject.forEach((object) => {
            let data = {};
            data['code'] = object.eventCode1;
            data['date'] = formatDate(object.pubDate);
            data['desc'] = object.legalDesc;
            legalEvents.push(data);
        });

        return legalEvents;
    }

    function formatLatestLgal(theseLegalEvents) {
        return formatDate(theseLegalEvents.at(-1).pubDate) + " " + theseLegalEvents.at(-1).legalDesc;
    }

    function formatPriorities(prioritiesObject) {
        let priorities = [];
        prioritiesObject.forEach((object) => {
            priorities.push(object.docNum + " " + formatDate(object.date));
        });

        return priorities;
    }

    function formatFamily(familyObject) {
        let family = [];
        familyObject.forEach((object) => {
            object.docRefs.forEach((object) => {

            });
        });

        return family;
    }


    function setClassification(ipcr, cpc, usMain, usFurther, ipcMain, ipcFurther) {
        let classificationArray = [], ipcrLinkout = "", cpcLinkout = "", usMainLinkout = "", usFurtherLinkout = "", usMainObj={};
       
        // setClassificationData(classificationArray);

        //US
        if (usMain && usMain.classCode && usMain.subClassCode) {
            // uspc435/defs435.htm#C435S320100
            let isDecimal = usMain.subClassCode.includes('.') ? true : false;
            let convertedSubClass = usMain.subClassCode > 100
            let usMainLink = `${usBaseUrl}/uspc${usMain.classCode}/defs${usMain.classCode}.htm#c${usMain.classCode}s${usMain.subClassCode}`;
            let usMainLabel = `${usMain.text}`;
            usMainLinkout += `<a class="mr-2" href=${usMainLink} target="_blank" rel="noreferrer">${usMainLabel}</a>`
            usMainObj = {
                label: "US",
                link: ReactHtmlParser(usMainLinkout)
            }
        }

        // setClassificationData(classificationArray);

        //usFurther
        usFurther && usFurther.length > 0 && usFurther.map((item, index) => {
            // uspc435/defs435.htm#C435S320100
            let isDecimal = item.subClassCode.includes('.') ? true : false;
            let convertedSubClass = item.subClassCode > 100
            let usFurtherLink = `${usBaseUrl}/uspc${item.classCode}/defs${item.classCode}.htm#c${item.classCode}s${item.subClassCode}`;
            let usFurtherLabel = `${item.text}`;
            usFurtherLinkout += `<a class="mr-2" href=${usFurtherLink} target="_blank" rel="noreferrer">${usFurtherLabel}</a>`
        });
        let usFurtherObj = {
            label: "US",
            link: ReactHtmlParser(usMainLinkout + usFurtherLinkout)
        }
        console.log('usFurtherObj', usFurtherObj)
        classificationArray.push(usFurtherObj);

        //ipc
        // if (ipcMain && ipcMain.classCode && ipcMain.subClassCode) {
        //     // uspc435/defs435.htm#C435S320100
        //     let isDecimal = usMain.subClassCode.includes('.') ? true : false;
        //     let convertedSubClass = usMain.subClassCode > 100
        //     let usMainLink = `${ipcBaseUrl}/uspc${usMain.classCode}/defs${usMain.classCode}.htm#c${usMain.classCode}s${usMain.subClassCode}`;
        //     let usMainLabel = `${usMain.text}`;
        //     usMainLinkout += `<a class="mr-2" href=${usMainLink} target="_blank" rel="noreferrer">${usMainLabel}</a>`
        //     usMainObj = {
        //         label: "US",
        //         link: ReactHtmlParser(usMainLinkout)
        //     }
        // }

        //ipcr
        ipcr && ipcr.length > 0 && ipcr.map((item, index) => {
            let ipcrLink = `${ipcrBaseUrl}${item.section}${item.classCode}${item.subClassCode}${item.mainGroup}${item.subGroup}`;
            let ipcrLabel = `${item.section}${item.classCode}${item.subClassCode}${item.mainGroup}/${item.subGroup}`;
            ipcrLinkout += `<a class="mr-2" href=${ipcrLink} target="_blank" rel="noreferrer">${ipcrLabel}</a>`
        });
        let ipcrObj = {
            label: "IPCR",
            link: ReactHtmlParser(ipcrLinkout)
        }
        classificationArray.push(ipcrObj);

        //cpc
        cpc && cpc.length > 0 && cpc.map((item, index) => {
            let cpcLink = `${cpcBaseUrl}${item.section}${item.classCode}${item.subClassCode}${item.mainGroup}/${item.subGroup}`;
            let cpcLabel = `${item.section}${item.classCode}${item.subClassCode}${item.mainGroup}/${item.subGroup}`;
            cpcLinkout += `<a class="mr-2" href=${cpcLink} target="_blank" rel="noreferrer">${cpcLabel}</a>`
        });
        let cpcObj = {
            label: "CPC",
            link: ReactHtmlParser(cpcLinkout)
        }
        classificationArray.push(cpcObj);
        setClassificationData(classificationArray);
    }

    const classificationColumn = [
        {
            // name: "name",
            selector: "label",
            sortable: false,
            center: true,
            style: {
                maxWidth: '25%'
            }
        },
        {
            // name: "name",
            selector: "link",
            sortable: false,
            center: true,
            style: {
                width: '75%'
            }
        }
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
                // width: "80%"
            }
        },
        headRow: {
            style: {
                border: '0 !important',
                display: 'none',
            }
        },
        // headCells: {
        //     style: {
                // paddingLeft: '8px', // override the cell padding for head cells
                // paddingRight: '8px',
                // borderLeft: '1px solid #0606061f',
                // '&:first-child, &:first-child div': {
                //     border: 'none !important'
                // },
                // '&:last-child ,&:last-child div': {
                //     border: 'none !important'
                // },
                // fontWeight: '700',
                // color: '#777777',
                // justifyContent: 'start !important'
        //     },
        // },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                borderLeft: '1px solid #0606061f',
                borderBottom: '1px solid #0606061f',
                wordWrap: 'break-word',
                // borderTop: "0px",
                '&:first-child,&:first-child div': {
                    borderLeft: '0',
                    borderBottom: '0',
                    whiteSpace: "break-spaces !important",
                },
                '&:last-child ,&:last-child div': {
                    // borderLeft: '0',
                    borderBottom: '0',
                    whiteSpace: "break-spaces !important",
                    wordWrap: "break-word",
                    overflowWrap: "break-word"
                },
                display: 'grid',
                justifyContent: 'start !important'
            },

        },
    };

    const handleScroll = (e, id) => {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }
    const { abstracts, claims, descriptions } = docContent;
    console.log('abstracts', abstracts)

    function showString(str) {
        let string = str.trim();
        string = string.split('.');
        string = string[1] + ".";
        return string;
    }


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
                                    {/* <p>Sample abstract</p> */}
                                    {abstracts && abstracts.length > 0 && abstracts.map((item, index) => {
                                        if (item.langCode == "en" && item.abstractText && item.abstractText.length > 0) {
                                            return (
                                                item.abstractText.map((data, subIndex) => {
                                                    return (
                                                        <p key={subIndex}>{ReactHtmlParser(data.html)}</p>
                                                    )
                                                })
                                            )
                                        }
                                    })}
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
                                    {/* <p>Sample claims</p> */}
                                    {claims && claims.length > 0 && claims.map((item, index) => {
                                        if (item.langCode == "en" && item.claims && item.claims.length > 0) {
                                            return (
                                                item.claims.map((data, subIndex) => {
                                                    return (
                                                        <p key={subIndex}>
                                                            <span className="bold">{data.num + "."}</span>
                                                            <span>{ReactHtmlParser(showString(data.claimTexts[0].html))}</span>
                                                            {data.claimTexts && data.claimTexts.length > 1 && data.claimTexts.map((record, recordIndex) => {
                                                                if (recordIndex > 0) {
                                                                    return (
                                                                        <p key={recordIndex}>{ReactHtmlParser(record.html)}</p>
                                                                    )
                                                                }
                                                            })}
                                                        </p>
                                                    )
                                                })
                                            )

                                        }
                                    })}
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
                                    {/* <p>Sample deacription</p> */}
                                    {descriptions && descriptions.length > 0 && descriptions.map((item, index) => {
                                        if (item.langCode == "en" && item.textParts && item.textParts.length > 0) {
                                            return (
                                                item.textParts.map((data, subIndex) => {
                                                    return (
                                                        <p key={subIndex}>{ReactHtmlParser(data.html)}</p>
                                                    )
                                                })
                                            )
                                        }
                                    })}
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
                                    {/* <p>Sample classification</p> */}
                                    <DataTable
                                        columns={classificationColumn}
                                        data={classificationData}
                                        // defaultSortField="date"
                                        // defaultSortAsc={false}
                                        // sortable={false}
                                        // sortServer={true}
                                        noDataComponent="Loading."
                                        // sortIcon={<SortIcon />}
                                        customStyles={customStyles}
                                        noHeader={true}
                                    />
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
                                    <table rules="all">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Code
                                                </th>
                                                <th>
                                                    Date
                                                </th>
                                                <th>
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {legalEvents.reverse().map((events) => (
                                                <tr>
                                                    <td>{events.code}</td>
                                                    <td>{events.date}</td>
                                                    <td>{events.desc}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                                    {/* ------------------------------------------------------------------------------------------------------------------------------visual seporator comment*/}
                                    <Accordion square expanded={isbilboDataOpen} onChange={() => setIsBilboDataOpen(prevState => !prevState)} id="classifications">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isbilboDataOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isbilboDataOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("biblioGraphicData")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <table rules="all">
                                                <tr>
                                                    <td>Application Number:</td>
                                                    <td>{docContent.applicationDocNum ? docContent.applicationDocNum : ""}</td>
                                                    <td>Status:</td>
                                                    <td>{docContent.applStatus ? docContent.applStatus : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td>Filing or 371 (c) Date:</td>
                                                    <td>{docContent.usPairApplicationDate ? formatDate(docContent.usPairApplicationDate) : ""}</td>
                                                    <td>Status Date:</td>
                                                    <td>{docContent.applStatusDate ? docContent.applStatusDate : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td>Application Type:</td>
                                                    <td>{docContent.usPairApplicationType ? docContent.usPairApplicationType : ""}</td>
                                                    <td>Earliest Publication No:</td>
                                                    <td>{docContent.publicationDocNum ? docContent.publicationDocNum : "Not Available​" /* incorrect */}</td>
                                                </tr>
                                                <tr>
                                                    <td>Entity Status:</td>
                                                    <td>{docContent.entityStatus ? docContent.entityStatus : ""}</td>
                                                    <td>Earliest Publication Date:</td>
                                                    <td>{docContent.publicationDate ? formatDate(docContent.publicationDate) : "" /* incorrect */}</td>
                                                </tr>
                                                <tr>
                                                    <td>AIA (First Inventor to File):</td>
                                                    <td>{inventors[0] ? inventors[0] : ""}</td>
                                                    <td>Patent Number:</td>
                                                    <td>{docContent.publicationDocNum ? docContent.publicationDocNum : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td>Issue Date of Patent</td>
                                                    <td>{docContent.publicationDate ? formatDate(docContent.publicationDate) : ""}</td>
                                                </tr>
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>


                                    <Accordion square expanded={istransactionHistoryOpen} onChange={() => setIsTrasactionHistoryOpen(prevState => !prevState)} id="classifications">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {istransactionHistoryOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!istransactionHistoryOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Transaction History​")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <table rules="all">
                                                {docContent.usPairTransactionHistory && docContent.usPairTransactionHistory.map((events) => (
                                                    <tr>
                                                        <td>{formatDate(events.tranDate)}</td>
                                                        <td>{events.tranText}</td>
                                                    </tr>
                                                ))}
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion square expanded={isPTAOpen} onChange={() => setIsPTAOpen(prevState => !prevState)} id="classifications">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isPTAOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isPTAOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Patent Term Adjustments​")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <p>Patent Term Adjustment</p>
                                            <table rules="all">
                                                <tr>
                                                    <td>Filing or 371(c) Date:​</td>
                                                    <td>{docContent.fileOr371cDate ? docContent.fileOr371cDate : "" /* possibly incorrect*/}</td>
                                                    <td>Overlapping Days Between &#123; A and B &#125; or &#123; A and C &#125;:​</td>
                                                    <td>something</td>
                                                </tr>
                                                <tr>
                                                    <td>Issue Date of Patent:​</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>Non-Overlapping USPTO Delays:​</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>A Delays:​</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>PTO Manual Adjustments:​</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>B Delays:</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>Applicant Delays:​</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>C Delays:</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>Total PTA Adjustments:​</td>
                                                    <td></td>
                                                </tr>
                                            </table>

                                            <p>Patent Term Adjustment History</p>
                                            <table rules="all">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Number
                                                        </th>
                                                        <th>
                                                            Date
                                                        </th>
                                                        <th>
                                                            Contents Description
                                                        </th>
                                                        <th>
                                                            PTO (Days)
                                                        </th>
                                                        <th>
                                                            APPL (days)
                                                        </th>
                                                        <th>
                                                            Start
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {docContent.adjustmentHistory && docContent.adjustmentHistory.map((events) => ( /* incorrect? no test data */
                                                        <tr>
                                                            <td>{events.number ? events.number : ""}</td>
                                                            <td>{events.date ? events.date : ""}</td>
                                                            <td>{events.desc ? events.desc : ""}</td>
                                                            <td>{events.pto ? events.pto : ""}</td>
                                                            <td>{events.appl ? events.appl : ""}</td>
                                                            <td>{events.start ? events.start : ""}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion square expanded={iscontinuityDataOpen} onChange={() => setIsContinuityDataOpen(prevState => !prevState)} id="classifications">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {iscontinuityDataOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!iscontinuityDataOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Continuity Data")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <p>Parent Continuity Data​</p>
                                            <table rules="all">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Description
                                                        </th>
                                                        <th>
                                                            Parent Number
                                                        </th>
                                                        <th>
                                                            Parent Filing or 371(c) Date
                                                        </th>
                                                        <th>
                                                            AIA(First Inventor to File)
                                                        </th>
                                                        <th>
                                                            Parent Status
                                                        </th>
                                                        <th>
                                                            Patent Number
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {docContent.adjustmentHistory && docContent.adjustmentHistory.map((events) => ( /* incorrect? no test data */
                                                        <tr>
                                                            <td>{events.number ? events.desc : ""}</td>
                                                            <td>{events.date ? events.number : ""}</td>
                                                            <td>{events.desc ? events.filing : ""}</td>
                                                            <td>{events.pto ? events.aia : ""}</td>
                                                            <td>{events.appl ? events.status : ""}</td>
                                                            <td>{events.start ? events.pn : ""}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>


                                            <p>Child Continuity Data​</p>
                                            <table rules="all">
                                                {docContent.childContinuity && docContent.childContinuity.map((events) => (
                                                    <tr>
                                                        <td>{events}</td>
                                                    </tr>
                                                ))}
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion square expanded={isPTEOpen} onChange={() => setIsPTEOPen(prevState => !prevState)} id="classifications">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isPTEOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isPTEOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Patent Term Extensions")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <p>Patent Term Extension</p>
                                            <table rules="all">
                                                <tr>
                                                    <td>Filing or 371(c) Date:​</td>
                                                    <td>{docContent.fileOr371cDate ? docContent.fileOr371cDate : "" /* possibly incorrect*/}</td>
                                                    <td>USPTO Delay (PTO) Delay (days):​</td>
                                                    <td>something</td>
                                                </tr>
                                                <tr>
                                                    <td>USPTO Adjustment (days):​</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>Corrections (APPL) Delay (days):​</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Explanation Of Calculations​</td>
                                                    <td>{docContent.publicationDate ? docContent.publicationDate : "" /* incorrect*/}</td>
                                                    <td>Total Patent Term Extension (days):​</td>
                                                    <td></td>
                                                </tr>
                                            </table>

                                            <p>Patent Term Extension History</p>
                                            <table rules="all">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Date
                                                        </th>
                                                        <th>
                                                            Contents Description
                                                        </th>
                                                        <th>
                                                            PTO (Days)
                                                        </th>
                                                        <th>
                                                            APPL (days)
                                                        </th>
                                                        <th>
                                                            Start
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {docContent.extensionHistory && docContent.extensionHistory.map((events) => ( /* incorrect? no test data */
                                                        <tr>
                                                            <td>{events.number ? events.number : ""}</td>
                                                            <td>{events.date ? events.date : ""}</td>
                                                            <td>{events.desc ? events.desc : ""}</td>
                                                            <td>{events.pto ? events.pto : ""}</td>
                                                            <td>{events.appl ? events.appl : ""}</td>
                                                            <td>{events.start ? events.start : ""}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* ------------------------------------------------------------------------------------------------------------------------------visual seporator comment*/}
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
                                    {/* ------------------------------------------------------------------------------------------------------------------------------visual seporator comment*/}

                                    <Accordion square expanded={isPatentCitationOpen} onChange={() => setIsPatentCitationOpen(prevState => !prevState)} id="citations">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isPatentCitationOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isPatentCitationOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Patent Citations​")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <table rules="all">
                                                {docContent.patentCitations && docContent.patentCitations.map((events) => (
                                                    <tr>
                                                        <td>{events.dnum ? events.dnum : ""}</td>
                                                        <td>{events.docRef.name ? events.docRef.name : ""}</td>
                                                        <td>{events.docRef.date ? formatDate(events.docRef.date) : ""}</td>
                                                    </tr>
                                                ))}
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion square expanded={isNonPatentCitationOpen} onChange={() => setIsNonPatentCitationOpen(prevState => !prevState)} id="citations">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isNonPatentCitationOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isNonPatentCitationOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Non-Patent Citations​")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <table rules="all">
                                                {docContent.nonPatentCitations && docContent.nonPatentCitations.map((events) => (
                                                    <tr>
                                                        <td>{events.text ? events.text : ""}</td>
                                                    </tr>
                                                ))}
                                            </table>

                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion square expanded={isforwardCitationsOpen} onChange={() => setIsforwardCitationsOpen(prevState => !prevState)} id="citations">
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="subHeading p-0">
                                            <p className="subHeading m-0">
                                                {isforwardCitationsOpen && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                                {!isforwardCitationsOpen && <ArrowRightIcon className={classes.arrowIcon} />}
                                                <span className={classes.arrowIconTitle}>{t("Patent Citations​")}</span>
                                            </p>
                                        </AccordionSummary>
                                        <AccordionDetails className="appTextColor">
                                            <table rules="all">
                                                {docContent.forwardCitations && docContent.forwardCitations.map((events) => (
                                                    <tr>
                                                        <td>{events.docRef.docNumber ? events.docRef.docNumber : ""}</td>
                                                        <td>{events.docRef.date ? formatDate(events.docRef.date) : ""}</td>
                                                    </tr>
                                                ))}
                                            </table>
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* ------------------------------------------------------------------------------------------------------------------------------visual seporator comment*/}

                                </AccordionDetails>
                            </Accordion>
                        </Col>
                        <Col lg="3">
                            <p className="subHeading">{t("fullDocSummary")}</p>
                            <table>
                                <tr><td>Legeal Status</td>​<td>{legalStatus}</td></tr>

                                <tr><td>Pub. Date​</td><td>{pubDate}</td></tr>

                                <tr><td>Filing Date​</td><td>{filingDate}</td></tr>

                                <tr><td>Application Number​</td><td>{appNum}</td></tr>

                                <tr><td>Applicants and Assignees​</td><td>{appAssignees}</td></tr>

                                <tr><td>Inventors​</td><td>{inventors && inventors.map((inven) => (<tr>{inven ? inven : ""}</tr>))}</td></tr>

                                <tr><td>Latest Legal Event​</td><td>{latestLegal}</td></tr>

                                <tr><td>Simple Family Members ({simFamMembers.length})​</td><td>{simFamMembers && simFamMembers.map((sfm) => (<tr>{sfm ? sfm : ""}</tr>))}</td></tr>

                                <tr><td>Simple Family Members ({simFamMembers.length})​</td><td>{simFamMembers && simFamMembers.map((sfm) => (<tr>{sfm ? sfm : ""}</tr>))}</td></tr>
                            </table>
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