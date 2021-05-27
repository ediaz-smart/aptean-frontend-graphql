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
import { useFormik } from 'formik';
import { RadioGroup, FormControlLabel, FormLabel, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

//components
import TextInput from '../../shared/Fields/TextInput';
import CheckBox from '../../shared/Fields/CheckBox';
import SelectBox from '../../shared/Fields/SelectBox';
import DatePicker from '../../shared/Fields/DatePicker';
import RadioButton from '../../shared/Fields/RadioButton';
import { getSeqSearchResults } from '../../services/seqSearchService';
import FolderTreeStructure from '../../shared/FolderTreeStructure/FolderTreeStructure';


import * as yup from 'yup';
// import { submitLogin } from '../../reducers/slice/loginSlice';
import Validate from '../../helpers/validate';
import Button from '@material-ui/core/Button';



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
        margin: '10px'
    },
    smallTextBox: {
        width: "60px"
    },
    marginLeftCancel: {
        marginLeft: "10px"
    },
    checkBoxContent: {
        fontSize: "14px",
        width: "80%",
        textAlign: "initial",
        marginLeft: "10px",
        marginBottom: "10px !important"
    },
    checkBox: {
        marginTop: "3px",
        width: "20px",
        height: "20px"
    },
    theseAreText: {
        margin: "7px 20px 10px 0px"
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
        },
        arrowIcon: {
            fontSize: '2.5rem',
            marginTop: '-2px'
        },
        arrowIconTitle: {
            marginLeft: '-8px',
            fontSize: '16px'
        }
    },
    '@media (min-width: 768px)': {
        desktopHelpLink: {
            display: 'block'
        },
        mobileHelpLink: {
            display: 'none'
        }
    },
    '@media (min-width: 900px)': {
        blastMargin: {
            marginLeft: "190px"
        },
        processHsps: {
            marginLeft: "150px"
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
        padding: '0 35px',
        margin: '12px 0',
        display: 'block'
    },
}))(MuiAccordionDetails);
const data = [
    {
        name: "GQ-Pat Gold Plus Protein - Patent Sequences",
        result: "pass"
    },
    {
        name: "GQ-Pat Platinum Protein - Patent Sequences",
        result: "pass"
    },
    {
        name: "CAS BiosequencesTM - Proteins from Patents",
        result: "pass"
    },
    {
        name: "GENESEQ Protein Sequences",
        result: "pass"
    },

];
const data1 = [
    {
        name: "GQ-Pat Gold Plus Nucleotide – Patent Sequences",
        result: "pass"
    },
    {
        name: "GQ-Pat Platinum Nucleotide – Patent Sequences",
        result: "pass"
    },
    {
        name: "CAS BiosequencesTM - Nucleotide from Patents",
        result: "pass"
    },
    {
        name: "GENESEQ Nucleotide Sequences",
        result: "pass"
    },

];
const data2 = [
    {
        name: "Ref Seq mRNA Sequences",
        result: "pass"
    },
    {
        name: "ENSEMBL mRNA Sequences",
        result: "pass"
    },
    {
        name: "PDB Nucleotide Sequences",
        result: "pass"
    },
    {
        name: "CAS BioSequencesTM - Journals and Proceedings",
        result: "pass"
    },

];
const data3 = [
    {
        name: "PDB Protein Sequences",
        result: "pass"
    },
    {
        name: "GenPept Translated GenBank",
        result: "pass"
    },
    {
        name: "ENSEMBL Protein Sequences",
        result: "pass"
    },
    {
        name: "CAS BioSequencesTM - Journals and Proceedings",
        result: "pass"
    },
    {
        name: "SwissProt from Expasy",
        result: "pass"
    },
    {
        name: "Ref Seq Protein Sequences",
        result: "pass"
    },
    {
        name: "Translated EMBL from Expasy",
        result: "pass"
    },

];


function IpSeqSearch() {
    const { t, i18n } = useTranslation('common');

    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            searchDetails: '',
            querySequence: '',
            alignments: 5000,
            genePastPercentage: 80,
            expectCutoff: 10,
            fragmentStretch: 50,
            fragmentAminoAcid: 96,
            docPublicSel: "before",
            publishGQSel: "before",
            patientDocSel:"islessthan"
        },
        validationSchema: Validate.IpSeqSearchValidate(),
        onSubmit: async (values) => {
            // dispatch(submitLogin({GQUSERID: values.userName, GQPASSWORD: values.password}));
            // history.push('/home');
        },
    });



    const [seqDBFilter, setSeqDBFilter] = React.useState(true);
    const [specificDBFilter, setSpecificDBFilter] = React.useState(true);
    const maxResidues = '100,000';

    const [formCheck1, setformCheck1] = React.useState(true);
    const [formCheck2, setformCheck2] = React.useState(true);
    const [formCheck3, setformCheck3] = React.useState(true);
    const [formCheck4, setformCheck4] = React.useState(true);
    const [formCheck5, setformCheck5] = React.useState(false);
    const [formCheck6, setformCheck6] = React.useState(false);
    const [formCheck7, setformCheck7] = React.useState(false);

    const [allChecked, setAllChecked] = useState(false);
    // using an array to store the checked items
    const [isChecked, setIsChecked] = useState([]);
    const [proPatentData, setProPatentData] = useState([]);
    const [proReferenceData, setProReferenceData] = useState([]);
    const [proPersonalData, setProPersonalData] = useState([]);

    const [nucPatentData, setNucPatentData] = useState([]);
    const [nucReferenceData, setNucReferenceData] = useState([]);
    const [nucPersonalData, setNucPersonalData] = useState([]);

    const [searchAlgorithmValue, setSearchAlgorithm] = useState("genepastSearch");
    const [scoringMatrixValue, setScoringMatrix] = useState("NUC3.1");
    const [sequenceTypeValue, setSequenceType] = useState("nucleotideSequence");
    const [wordSizeValue, setWordSize] = useState("11");
    const [nucleotideData, setNucleotideData] = useState();
    const [proteinData, setProteinData] = useState();
    const [files, setFiles] = useState([]);
    // const [querySequenceValue, setQuerySequencyValue] = useState();
    const [genePastValue, setGenePastValue] = useState("myQuery");
    const [personalDataValue, setPersonalDataValue] = useState();

    console.log('personalDataValue', personalDataValue)

    // reset login status
    useEffect(() => {
        (async () => {
            //dispatch(userActions.logout()); 
            const resp = await getSeqSearchResults();
            console.log('respqokweflwef', resp);
            if (resp && resp.response_content && resp.response_content.sdb_nuc_tree && resp.response_content.sdb_nuc_tree.length > 0) {
                let nucData = resp.response_content.sdb_nuc_tree;
                let nucleotidePatent = [], nucleotideReferenceData = [], nucDataShardWithMe = [];
                console.log('nuc', resp.response_content.sdb_nuc_tree.length)
                let nucFormattedData = await list_to_tree(nucData);
                console.log('nucFormattedData', nucFormattedData);
                let getNucChild=[];
                if(nucFormattedData && nucFormattedData.length > 0 ) {
                    getNucChild = nucFormattedData[0].children;
                }
                getNucChild && getNucChild.length > 0 && getNucChild.map((item, index) => {
                    if (item && item.id == ':Patents') {
                        nucleotidePatent = item.children;
                    } else if (item && item.id == ':Reference Data') {
                        nucleotideReferenceData = item.children ;
                    } else if (item && item.id == ':Data Shared With Me') {
                        nucDataShardWithMe = item;
                    }
                })
                setNucleotideData(resp.response_content.sdb_nuc_tree);
                
                setNucPatentData(nucleotidePatent);
                setNucReferenceData(nucleotideReferenceData);
                setNucPersonalData(nucDataShardWithMe);
            }
            if (resp && resp.response_content && resp.response_content.sdb_pro_tree && resp.response_content.sdb_pro_tree.length > 0) {
                let proteinData = resp.response_content.sdb_pro_tree;
                let proteinPatent = [], proteinReferenceData = [], proDataShardWithMe = [];
                console.log('pro', resp.response_content.sdb_pro_tree.length)
                let proFormattedData = await list_to_tree(proteinData);
                console.log('proFormattedData', proFormattedData);
                let getProChild=[];
                if(proFormattedData && proFormattedData.length > 0 ) {
                    getProChild = proFormattedData[0].children;
                }
                getProChild && getProChild.length > 0 && getProChild.map((item, index) => {
                    if (item && item.id == ':Patents') {
                        proteinPatent = item.children;
                    } else if (item && item.id == ':Reference Data') {
                        proteinReferenceData = item.children;
                    } else if (item && item.id == ':Data Shared With Me') {
                        proDataShardWithMe = item;
                    }
                })
                setProteinData(resp.response_content.sdb_pro_tree);
                
                setProPatentData(proteinPatent);
                setProReferenceData(proteinReferenceData);
                setProPersonalData(proDataShardWithMe);
            }

        })()
    }, []);
    console.log('nucPatentData', nucPatentData);
    console.log('nucrefereData', nucReferenceData);
    console.log('nucsharedData', nucPersonalData)
    console.log('proPatentData', proPatentData);
    console.log('prorefereData', proReferenceData);
    console.log('prosharedData', proPersonalData)


    function list_to_tree(list) {
        var map = {}, node, roots = [], i;
        
        for (i = 0; i < list.length; i += 1) {
          map[list[i].id] = i; // initialize the map
          list[i].children = []; // initialize the children
        }
        
        for (i = 0; i < list.length; i += 1) {
          node = list[i];
        //   console.log('node', node)
          if (node.parent !== null) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parent]].children.push(node);
          } else {
            roots.push(node);
          }
        }
        return roots;
      }

//    if(nucleotideData && nucleotideData.length > 0) {
//     console.log(list_to_tree(nucleotideData));
   
//    }

    console.log('nucleotideData', nucleotideData);
    console.log('proteinData', proteinData);
    // let nucleotidePatent = [], nucleotideReferenceData = [], nucDataShardWithMe = [];
    // if (nucleotideData && nucleotideData.length > 0) {
    //     nucleotideData.map((item, index) => {
    //         // if(item && item.children) {

    //         // }
    //         if (item && item.parent == ':Patents') {
    //             nucleotidePatent.push(item);
    //         } else if (item && item.parent == ':Reference Data') {
    //             nucleotideReferenceData.push(item);
    //         } else if (item && item.parent == ':Data Shared With Me') {
    //             nucDataShardWithMe.push(item);
    //         }
    //     });
    //     setFormData1(nucleotidePatent);
    //     setFormData2(nucleotideReferenceData);
    // }



    const handleSearchAlgorithm = (event) => {
        console.log('vent.target.value', event.target.value)
        setSearchAlgorithm(event.target.value);
    };

    let scoringMatrixItems = [], wordSizeItems = [];

    const handleSequenceType = (event) => {
        console.log('vent.target.value', event.target.value)
        setSequenceType(event.target.value);
        // setQuerySequencyValue('');
        formik.setFieldValue("querySequence", '');

        if (event.target.value == "nucleotideSequence") {
            setScoringMatrix('NUC3.1');
            setWordSize('11');
        } else {
            setScoringMatrix('BLOSUM62');
            setWordSize('3');
        }
    };

    const handleSingleCheck = e => {
        const { name } = e.target;
        if (isChecked.includes(name)) {
            setIsChecked(isChecked.filter(checked_name => checked_name !== name));
            return setAllChecked(false);
        }
        isChecked.push(name);
        setIsChecked([...isChecked]);
        setAllChecked(isChecked.length === proPatentData.length)
    };
    console.log('isChecked', isChecked)

    function handleDbChange(newDbValue) {
        console.log('dbValue', newDbValue)
        setPersonalDataValue(newDbValue);
    }
    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: "0.5px"
            }}
        />
    );
    const docPublicSel = [
        {
            value: "before",
            label: "Before",
            id: "BEF"
        },
        {
            value: "beforeempty",
            label: "Before or is empty",
            id: "BEF_IE"
        },
        {
            value: "after",
            label: "After",
            id: "AFT"
        },
        {
            value: "afterempty",
            label: "Aftre or is empty",
            id: "AFT_IE"
        }
    ];
    const GQSpecificSel = [
        {
            value: "islessthanequal",
            label: "is less than or equal to",
            id: "LTE"
        },
        {
            value: "islessthan",
            label: "is less than",
            id: "LT"
        },
        {
            value: "equals",
            label: "equals",
            id: "EQ"
        },
        {
            value: "doesnotequal",
            label: "does not equal",
            id: "NEQ"
        },
        {
            value: "isgreaterthan",
            label: "is greater than",
            id: "GT"
        },
        {
            value: "isgreaterthanequal",
            label: "is greater than or equal to",
            id: "GTE"
        }
    ];
    const searchAlgorithmItems = [
        {
            value: "genepastSearch",
            label: "GenePast Search"
        },
        {
            value: "blastSearch",
            label: "BLAST Search"
        },
        {
            value: "fragmentSearch",
            label: "Fragment Search"
        },
        {
            value: "motifSearch",
            label: "MOTIF Search"
        }
    ];

    const genePastItems = [
        {
            value: "myQuery",
            label: "my query"
        },
        {
            value: "anySubject",
            label: "any subject"
        },
        {
            value: "queryOrSubject",
            label: "query or subject"
        }
    ];

    const nucleotideMatrixItems = [
        {
            value: "NUC3.1",
            label: "NUC3.1"
        },
        {
            value: "NUC2.2",
            label: "NUC2.2"
        },
        {
            value: "NUC4.4",
            label: "NUC4.4"
        }];
    const nucleotidewordSizeItems = [
        {
            value: "7",
            label: "7"
        },
        {
            value: "11",
            label: "11"
        },
        {
            value: "15",
            label: "15"
        }];

    const proteinMatrixItems = [
        {
            value: "BLOSUM62",
            label: "BLOSUM62"
        },
        {
            value: "PAM30",
            label: "PAM30"
        },
        {
            value: "PAM70",
            label: "PAM70"
        },
        {
            value: "BLOSUM80",
            label: "BLOSUM80"
        },
        {
            value: "BLOSUM45",
            label: "BLOSUM45"
        }
    ];
    const proteinwordSizeItems = [
        {
            value: "2",
            label: "2"
        },
        {
            value: "3",
            label: "3"
        }
    ];
    console.log('formik.errors', formik)


    return (
        <div className={classes.grow}>
            <form name="ipSequenceSearchForm" onSubmit={formik.handleSubmit}>
                {/* viswes changes starts */}
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
                </Row>
                <hr />
                <Row>
                    <Col sm="12" md="12">
                        <p className="loginTitle w-75 mb-10 float-left">{t('querySequences')}</p>
                        <Link className={"appTextFont appLinkColor float-right"} to="/help">{t('help')}</Link>
                    </Col>
                    {/* <Col sm="3" md="3" className={"rightAlign"}>
                        <Link className={"appTextFont appLinkColor"} to="/help">{t('help')}</Link>
                    </Col> */}
                </Row>
                <Row>
                    <Col sm="12" md="10">
                        <div className="form-group">
                            <TextInput
                                rowsMax="8"
                                rows="8"
                                multiline={true}
                                fullWidth
                                id="querySequence"
                                name="querySequence"
                                label={t('querySequencesPlaceHolder')}
                                variant="outlined"
                                value={formik.values.querySequence}
                                onChange={formik.handleChange}
                                error={formik.touched.querySequence && formik.errors.querySequence}
                                helperText={formik.errors.querySequence}
                            />
                        </div>
                    </Col>
                    <Col md="2"></Col>
                </Row>
                <Row>
                    <Col md="9">
                        {/* <p> */}
                        <FormControl component="fieldset">

                            <RadioGroup row aria-label="These are" name="customized-radios" value={sequenceTypeValue} onChange={handleSequenceType}>
                                <span className={classes.theseAreText}>These are</span>
                                <FormControlLabel value="nucleotideSequence" control={<RadioButton />} label="Nucleotide Sequences" />
                                <FormControlLabel value="proteinSequence" control={<RadioButton />} label="Protein Sequences" />
                            </RadioGroup>
                            {/* </span> */}
                        </FormControl>
                        {/* </p> */}
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm="12" md="12">
                        <p className="loginTitle w-75 mb-10 float-left">{t('searchAlgorithmAndSetting')}</p>
                        <Link className={"appTextFont appLinkColor float-right"} to="/help">{t('help')}</Link>
                    </Col>
                    {/* <Col sm="12" md="3" className={"rightAlign"}>
                        <Link className={"appTextFont appLinkColor"} to="/help">{t('help')}</Link>
                    </Col> */}
                </Row>
                <Row>
                    <AccordionDetails>
                        <Col md="12">
                            <SelectBox
                                margin="normal"
                                variant="outlined"
                                name="searchType"
                                id="searchType"
                                value={searchAlgorithmValue}
                                items={searchAlgorithmItems}
                                // defaultValue={searchAlgorithm}
                                onChange={handleSearchAlgorithm}
                                className={"float-left"}
                            />
                            {searchAlgorithmValue && searchAlgorithmValue == 'genepastSearch' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    Find atleast&nbsp;&nbsp;&nbsp;
                            </Typography>
                                <TextInput
                                    fullWidth={false}
                                    id="genePastPercentage"
                                    name="genePastPercentage"
                                    label={''}
                                    variant="outlined"
                                    className={classes.smallTextBox + " float-left"}
                                    value={formik.values.genePastPercentage}
                                    onChange={formik.handleChange} 
                                    error={formik.touched.genePastPercentage && Boolean(formik.errors.genePastPercentage)}
                                    helperText={formik.touched.genePastPercentage && formik.errors.genePastPercentage}
                                />
                                <Typography className={"float-left " + classes.seqText}>
                                    &nbsp;&nbsp;% Identity over the &nbsp;&nbsp;
                            </Typography>
                                <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="searchType"
                                    id="searchType"
                                    value={genePastValue}
                                    items={genePastItems}
                                    // defaultValue={searchAlgorithm}
                                    // onChange={handleAlgorithm}
                                    className={"float-left"}
                                />
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'blastSearch' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    Scoring Matrix&nbsp;&nbsp;&nbsp;
                            </Typography>
                                {sequenceTypeValue == 'nucleotideSequence' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="scoringMatrix"
                                    id="scoringMatrix"
                                    value={scoringMatrixValue}
                                    items={nucleotideMatrixItems}
                                    // defaultValue={searchAlgorithm}
                                    // onChange={handleAlgorithm}
                                    className={"float-left"}
                                />
                                }
                                {sequenceTypeValue == 'proteinSequence' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="scoringMatrix"
                                    id="scoringMatrix"
                                    value={scoringMatrixValue}
                                    items={proteinMatrixItems}
                                    // defaultValue={searchAlgorithm}
                                    // onChange={handleAlgorithm}
                                    className={"float-left"}
                                />
                                }
                                <Typography className={"float-left " + classes.seqText}>
                                    &nbsp;&nbsp;Word Size &nbsp;&nbsp;
                            </Typography>
                                {sequenceTypeValue == 'nucleotideSequence' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="wordSize"
                                    id="wordSize"
                                    value={wordSizeValue}
                                    items={nucleotidewordSizeItems}
                                    // defaultValue={searchAlgorithm}
                                    // onChange={handleAlgorithm}
                                    className={"float-left " + classes.smallTextBox}
                                />
                                }
                                {sequenceTypeValue == 'proteinSequence' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="wordSize"
                                    id="wordSize"
                                    value={wordSizeValue}
                                    items={proteinwordSizeItems}
                                    // defaultValue={searchAlgorithm}
                                    // onChange={handleAlgorithm}
                                    className={"float-left " + classes.smallTextBox}
                                />
                                }
                                <div className={classes.blastMargin}>
                                    <Typography className={"float-left " + classes.seqText}>
                                        Expect Cutoff&nbsp;&nbsp;&nbsp;
                            </Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="expectCutoff"
                                        name="expectCutoff"
                                        label={''}
                                        variant="outlined"
                                        className={classes.smallTextBox + ' float-left'}
                                        value={formik.values.expectCutoff}
                                        onChange={formik.handleChange} 
                                        error={formik.touched.expectCutoff && Boolean(formik.errors.expectCutoff)}
                                        helperText={formik.touched.expectCutoff && formik.errors.expectCutoff}
                                    />
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        className={"float-left ml-20 " + classes.processHsps}
                                        name="processHsps"
                                        id="processHsps"
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Process HSPs &nbsp;&nbsp;&nbsp;
                                    </Typography>
                                </div>
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'fragmentSearch' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    Find a stretch of at least&nbsp;&nbsp;&nbsp;
                            </Typography>
                                <TextInput
                                    fullWidth={false}
                                    id="fragmentStretch"
                                    name="fragmentStretch"
                                    label={''}
                                    variant="outlined"
                                    className={classes.smallTextBox + ' float-left'}
                                    value={formik.values.fragmentStretch}
                                    onChange={formik.handleChange} 
                                    error={formik.touched.fragmentStretch && Boolean(formik.errors.fragmentStretch)}
                                    helperText={formik.touched.fragmentStretch && formik.errors.fragmentStretch}
                                />
                                <Typography className={"float-left mt-2"}>
                                    &nbsp;&nbsp;Amino Acids with &nbsp;&nbsp;
                            </Typography>
                                <TextInput
                                    fullWidth={false}
                                    id="fragmentAminoAcid"
                                    name="fragmentAminoAcid"
                                    label={''}
                                    variant="outlined"
                                    className={classes.smallTextBox + ' float-left'}
                                    value={formik.values.fragmentAminoAcid}
                                    onChange={formik.handleChange} 
                                // error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                // helperText={formik.touched.minResidues && formik.errors.minResidues}
                                />
                                <Typography className={"float-left mt-2"}>
                                    &nbsp;&nbsp;% Identity or more
                                </Typography>
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'motifSearch' && <Fragment>
                                <Link className={"float-left " + classes.seqText}>
                                    Examples of valid MOTIF queries&nbsp;&nbsp;&nbsp;
                            </Link>
                            </Fragment>
                            }
                        </Col>
                    </AccordionDetails>
                    <AccordionDetails className="appTextColor">
                        <Col md="12">
                            <Typography className={"float-left " + classes.seqText}>
                                Report&nbsp;&nbsp;&nbsp;
                                    </Typography>
                            <TextInput
                                fullWidth={false}
                                id="alignments"
                                name="alignments"
                                label={''}
                                variant="outlined"
                                value={formik.values.alignments}
                                onChange={formik.handleChange} 
                                error={formik.touched.alignments && Boolean(formik.errors.alignments)}
                                helperText={formik.touched.alignments && formik.errors.alignments}
                                className={"float-left"}
                            />
                            <Typography className={"float-left " + classes.seqText}>
                                &nbsp;&nbsp;best Alignments per Query Sequence&nbsp;&nbsp;
                            </Typography>
                        </Col>
                    </AccordionDetails>
                </Row>
                {/* viswes changes ends */}
                <hr />

                <Row>
                    <Col md="11">
                        <Accordion square expanded={seqDBFilter} onChange={() => setSeqDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="loginTitle p-0">
                                <p className="loginTitle m-0">
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
                                        className={"float-left"}
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
                                        className={"float-left"}
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
                                        className={"float-left"}
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
                                        value={formik.values.docPublicSel}
                                        onChange={formik.handleChange}
                                        items={docPublicSel}
                                        className={"float-left"}
                                    />
                                    <DatePicker
                                        margin="normal"
                                        id="docPublicDate"
                                        name="docPublicDate"
                                        format="dd/MM/yyyy"
                                        label="Date picker inline"
                                        value={formik.values.docPublicDate}
                                        inputVariant="outlined"
                                        className={"float-left m-0 ml-4"}
                                        onChange={val => {
                                            console.log("___", val);
                                            formik.setFieldValue("docPublicDate", val);
                                       }}      
                                       />
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        className={"float-left mx-2"}
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
                        <Link className="appTextFont appLinkColor float-right mr-2">Help</Link>
                    </Col>
                    <Col md="12">
                        <Accordion square expanded={specificDBFilter} onChange={() => setSpecificDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="loginTitle p-0">
                                <p className="loginTitle m-0">
                                    {specificDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!specificDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>GQ-Pat specific Database Filters​</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails className="loginTitle">
                                <Col md="12">
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        className={"float-left"}
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
                                        value={formik.values.publishGQSel}
                                        onChange={formik.handleChange}
                                        items={docPublicSel}
                                        className={"float-left"}
                                    />
                                    <DatePicker
                                        margin="normal"
                                        id="publishGQDate"
                                        name="publishGQDate"
                                        format="dd/MM/yyyy"
                                        value={formik.values.publishGQDate}
                                        inputVariant="outlined"
                                        className={"float-left m-0 ml-4"}
                                        allowKeyboardControl={false}
                                        onChange={val => {
                                            console.log("___", val);
                                            formik.setFieldValue("publishGQDate", val);
                                       }}        
                                       />
                                    <CheckBox
                                        defaultChecked
                                        color="primary"
                                        className={"float-left mx-2"}
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
                                        className={"float-left"}
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
                                        value={formik.values.patientDocSel}
                                        onChange={formik.handleChange}
                                        items={GQSpecificSel}
                                        className={"float-left"}
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
                                        className={"float-left mx-4"}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        Sequences
                                </Typography>
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="12" className={classes.mobileHelpLink}>
                        <Link className="appTextFont appLinkColor float-right mr-2">Help</Link>
                    </Col>
                </Row>
                {/* <ColoredLine color="black" /> */}
                <hr />

                <div>
                <Row>
                    <Col sm="12" md="12">
                        <Link className={"appTextFont appLinkColor float-right"} to="/help">{t('help')}</Link>
                    </Col>
                </Row>
                    <Row>
                        <Col md="6">
                            <Accordion expanded={formCheck1} onChange={() => setformCheck1(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="loginTitle p-0">

                                    <p className="loginTitle m-0">

                                        {formCheck1 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck1 && <ArrowRightIcon className={classes.arrowIcon} />}

                                        <b className={classes.arrowIconTitle}>​Nucleotide Patent Databases</b>

                                    </p>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <Col >

                                        {/* <input
                                      name="checkall"
                                      type="checkbox"
                                      checked={allChecked}
                                      onChange={handleAllCheck}
                                    /> */}
                                        {nucPatentData.map((test, index) => (
                                           <div className="relativePosition"
                                           key={index}
                                       >
                                           <input
                                               type="checkbox"
                                               name={test.label}
                                               checked={isChecked.includes(test.label)}
                                               onChange={handleSingleCheck}
                                               className={"absolutePosition "+ classes.checkBox}
                                           />
                                           &nbsp; &nbsp;
                                           <label className={classes.checkBoxContent}>{test.label}</label>
                                       </div>
                                        ))
                                        }

                                    </Col>
                                </AccordionDetails>
                            </Accordion>

                        </Col>
                        <Col md="6">
                            <Accordion expanded={formCheck2} onChange={() => setformCheck2(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                    <p className="loginTitle m-0">
                                        {formCheck2 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck2 && <ArrowRightIcon className={classes.arrowIcon} />}

                                        <b className={classes.arrowIconTitle}>Protein Patent Databases</b>

                                    </p>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <Col >

                                        {/* <input
                                  name="checkall"
                                  type="checkbox"
                                  checked={allChecked}
                                  onChange={handleAllCheck}
                                /> */}
                                        {proPatentData.map((test, index) => (
                                           <div className="relativePosition"
                                           key={index}
                                       >
                                           <input
                                               type="checkbox"
                                               name={test.label}
                                               checked={isChecked.includes(test.label)}
                                               onChange={handleSingleCheck}
                                               className={"absolutePosition "+ classes.checkBox}
                                           />
                                           &nbsp; &nbsp;
                                           <label className={classes.checkBoxContent}>{test.label}</label>
                                       </div>
                                        ))
                                        }

                                    </Col>
                                </AccordionDetails>
                            </Accordion>

                        </Col>
                        {/* <Col md="1">
                            <Link className="appTextFont appLinkColor float-right mr-2">Help</Link>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col md="6">
                            <Accordion expanded={formCheck3} onChange={() => setformCheck3(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">

                                    <p className="loginTitle m-0">
                                        {formCheck3 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck3 && <ArrowRightIcon className={classes.arrowIcon} />}

                                        <b className={classes.arrowIconTitle}>Reference ​Nucleotide Databases</b>

                                    </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Col >

                                        {/* <input
                                      name="checkall"
                                      type="checkbox"
                                      checked={allChecked}
                                      onChange={handleAllCheck}
                                    /> */}
                                        {nucReferenceData.map((test, index) => (
                                            <div className="relativePosition"
                                                key={index}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={test.label}
                                                    checked={isChecked.includes(test.label)}
                                                    onChange={handleSingleCheck}
                                                    className={"absolutePosition "+ classes.checkBox}
                                                />
                                                &nbsp; &nbsp;
                                                <label className={classes.checkBoxContent}>{test.label}</label>
                                            </div>
                                        ))
                                        }

                                    </Col>  
                                </AccordionDetails>
                            </Accordion>

                        </Col>
                        <Col md="6">
                            <Accordion expanded={formCheck4} onChange={() => setformCheck4(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                    <p className="loginTitle m-0">
                                        {formCheck4 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck4 && <ArrowRightIcon className={classes.arrowIcon} />}

                                        <b className={classes.arrowIconTitle}>Reference Protein Databases</b>

                                    </p>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <Col >

                                        {/* <input
                                    name="checkall"
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={handleAllCheck}
                                  /> */}
                                        {proReferenceData.map((test, index) => (
                                           <div className="relativePosition"
                                           key={index}
                                       >
                                           <input
                                               type="checkbox"
                                               name={test.label}
                                               checked={isChecked.includes(test.label)}
                                               onChange={handleSingleCheck}
                                               className={"absolutePosition "+ classes.checkBox}
                                           />
                                           &nbsp; &nbsp;
                                           <label className={classes.checkBoxContent}>{test.label}</label>
                                       </div>
                                        ))
                                        }

                                    </Col>
                                </AccordionDetails>
                            </Accordion>

                        </Col>

                    </Row>
                    <Row>
                        <Col md="6">
                            <Accordion expanded={formCheck5} onChange={() => setformCheck5(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">

                                    <p className="loginTitle m-0">
                                        {formCheck5 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck5 && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <b className={classes.arrowIconTitle}>GenBank ​Nucleotide Databases</b>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Col md='6'>

                                        <p>No Data</p>

                                    </Col>
                                </AccordionDetails>
                            </Accordion>

                        </Col>
                        <Col md="6">
                            <Accordion expanded={formCheck6} onChange={() => setformCheck6(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                    <p className="loginTitle m-0">
                                        {formCheck6 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck6 && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <b className={classes.arrowIconTitle}>Personal Protein Databases</b>
                                    </p>

                                </AccordionSummary>
                                {/* <AccordionDetails>
                                    <Col md='6'>

                                        <p>No Data</p>

                                    </Col>
                                </AccordionDetails> */}
                                <FolderTreeStructure treeData={proPersonalData} parentCallBack={handleDbChange} />
                            </Accordion>

                        </Col>

                    </Row>
                    <Row>
                        <Col md="6">
                            <Accordion expanded={formCheck7} onChange={() => setformCheck7(prevState => !prevState)}>
                                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">

                                    <p className="loginTitle m-0">
                                        {formCheck7 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                        {!formCheck7 && <ArrowRightIcon className={classes.arrowIcon} />}
                                        <b className={classes.arrowIconTitle}>Personal ​Nucleotide Databases</b>
                                    </p>
                                </AccordionSummary>
                                {/* <AccordionDetails>
                                    <Col md='6'>

                                        <p>No Data</p>

                                    </Col>
                                </AccordionDetails> */}
                                <FolderTreeStructure treeData={nucPersonalData}/>
                            </Accordion>

                        </Col>


                    </Row>


                </div>

                <ColoredLine color="#f3f2f2" />
                <div>
                    <Row>
                        <Col md="11">
                            <p className="ml-3">Executing this search will incur the following charges:</p>
                            <p className={"loginTitle ml-5"}>
                                <b>
                                    TOTAL 2 Credits
                            </b>
                            </p>

                        </Col>
                        <Col md="1" className={classes.desktopHelpLink}>
                            <Link className="appTextFont appLinkColor float-right mr-2">Help</Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <CheckBox
                                defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="check"
                                id="check"
                            />
                            <Typography className={"float-left mt-2"}>
                                By checking this box, I acknowledge and agree to these terms
                            </Typography>
                        </Col>
                    </Row>
                    <ColoredLine color="#f3f2f2" />
                    <Row>
                        <Col md="12">
                            <CheckBox
                                defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="check"
                                id="check"
                            />
                            <Typography className={"float-left mt-2"}>
                                Send email when the search is done
                        </Typography>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='4' className="">
                            <CheckBox
                                defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="check"
                                id="check"
                            />
                            <Typography className={"float-left mt-2"}>
                                Save this form for later use as
                        </Typography>
                        </Col>
                        <Col md='6'>
                            <TextInput
                                id="saveforlater"
                                name="saveforlater"
                                label='Name the form'
                                variant="outlined"
                                onChange={formik.handleChange}
                                fullWidth={true}
                            />
                        </Col>



                    </Row>
                </div>
                <br></br>
                <Row >
                    <Col>
                        <Button color="primary" variant="contained" className={"float-right  text-capitalize " + classes.marginLeftCancel} type="submit">
                            Cancel
             </Button>

                        <Button color="primary" variant="contained" className="float-right loginSubmit text-capitalize" type="submit">
                            Submit
             </Button>
                    </Col>
                </Row>
            </form>
        </div>
    );
}

export default IpSeqSearch;