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
import { RadioGroup, FormControlLabel, FormLabel, FormControl, MenuItem, InputLabel, Checkbox } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { useSelector } from 'react-redux';

//components
import TextInput from '../../shared/Fields/TextInput';
import CheckBox from '../../shared/Fields/CheckBox';
import SelectBox from '../../shared/Fields/SelectBox';
import DatePicker from '../../shared/Fields/DatePicker';
import RadioButton from '../../shared/Fields/RadioButton';
import { getSeqSearchResults, submitSeqSearch } from '../../services/seqSearchService';
import FolderTreeStructure from '../../shared/FolderTreeStructure/FolderTreeStructure';
import SaveContentModal from '../../shared/Modal/SaveContentModal';
import ContactSupportErrorModal from '../../shared/Modal/ContactSupportErrorModal';

//validation
import Validate from '../../helpers/validate';

//service
import AccountInfo from '../../services/accountInfo';

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
        padding: '0 20px',
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
    const history = useHistory();

    const classes = useStyles();

    //using state
    const userInfo = useSelector(state=> state.setUserInfo);


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

    const [searchAlgorithmValue, setSearchAlgorithm] = useState("kerr");
    const [scoringMatrixValue, setScoringMatrix] = useState("NUC3.1");
    const [sequenceTypeValue, setSequenceType] = useState("nucleotide");
    const [wordSizeValue, setWordSize] = useState("11");
    const [nucleotideData, setNucleotideData] = useState();
    const [proteinData, setProteinData] = useState();
    const [files, setFiles] = useState([]);
    // const [querySequenceValue, setQuerySequencyValue] = useState();
    const [genePastValue, setGenePastValue] = useState("QUERY");
    const [personalDataValue, setPersonalDataValue] = useState();
    const [isBothDbSelected, setIsBothDbSelected] = useState("off");
    const [dbTypeArray, setDbTypeArray] = useState([]);
    const [sendMailAfterSearch, setSendMailAfterSearch] = useState(false);
    const [processHsp, setProcessHsp] = useState(false);
    const [nucDb, setNucDb] = useState([]);
    const [proDb, setProDb] = useState([]);
    const [saveFormValue, setSaveFormValue] = useState(false);
    const [isDocPubDate, setIsDocPubDate] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [isPatientDoc, setIsPatientDoc] = useState(false);
    const [sdbFilters, setSdbFilters] = useState([]);
    const [ppuType, setPpuType] = useState();
    const [isSubmitActive, setIsSubmitActive] = useState(false);
    const [isDocPubUnknownDates, setIsDocPubUnknownDates] = useState(false);
    const [ispublishGQUnknownDates, setIspublishGQUnknownDates] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [nucGenBankData, setNucGenBankData] = useState([]);



    console.log('personalDataValue', personalDataValue)

    console.log('sendMailAfterSearch', sendMailAfterSearch)
    console.log('processHsp', processHsp)

    // reset login status
    useEffect(() => {
        (async () => {
            const resp = await getSeqSearchResults(history);
            if (resp && resp.response_content && resp.response_content.sdb_nuc_tree && resp.response_content.sdb_nuc_tree.length > 0) {
                let nucData = resp.response_content.sdb_nuc_tree;
                let nucleotidePatent = [], nucleotideReferenceData = [], nucDataShardWithMe = [], nucGenBank = [];
                let nucFormattedData = await list_to_tree(nucData);
                let getNucChild = [];
                if (nucFormattedData && nucFormattedData.length > 0) {
                    getNucChild = nucFormattedData[0].children;
                }
                getNucChild && getNucChild.length > 0 && getNucChild.map((item, index) => {
                    if (item && item.id == ':Patents') {
                        nucleotidePatent = item.children;
                    } else if (item && item.id == ':Reference Data') {
                        // nucleotideReferenceData = item.children;
                        console.log('item.children', item.children);
                        item.children && item.children.length > 0 && item.children.map((item, index) => {
                            if (item.id.includes("GB_")) {
                                nucGenBank.push(item)
                            } else if (!item.id.includes("GB_")) {
                                nucleotideReferenceData.push(item)
                            }
                        })
                    } else if (item && item.id == ':Data Shared With Me') {
                        nucDataShardWithMe = item;
                    }
                })
                setNucleotideData(resp.response_content.sdb_nuc_tree);
                setNucPatentData(nucleotidePatent);
                setNucReferenceData(nucleotideReferenceData);
                setNucPersonalData(nucDataShardWithMe);
                setNucGenBankData(nucGenBank);
            }
            if (resp && resp.response_content && resp.response_content.sdb_pro_tree && resp.response_content.sdb_pro_tree.length > 0) {
                let proteinData = resp.response_content.sdb_pro_tree;
                let proteinPatent = [], proteinReferenceData = [], proDataShardWithMe = [];
                let proFormattedData = await list_to_tree(proteinData);
                let getProChild = [];
                if (proFormattedData && proFormattedData.length > 0) {
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

            if(userInfo && userInfo.current_user && userInfo.current_user.ppu_type) {
                let userPpu = userInfo.current_user.ppu_type;
                console.log('userData', userInfo)

                setPpuType(userInfo.current_user.ppu_type);
                if (userPpu == "1" || userPpu == "2") {
                    setIsSubmitActive(false);
                } else {
                    setIsSubmitActive(true);
                }
            }
            // const accountData = await AccountInfo.getAccountInfo();
            // if (accountData && accountData.response_content && accountData.response_content.ppu_type) {
            //     let userPpu = accountData.response_content.ppu_type;
            //     setPpuType(accountData.response_content.ppu_type);
            //     if (userPpu == "1" || userPpu == "2") {
            //         setIsSubmitActive(false);
            //     } else {
            //         setIsSubmitActive(true);
            //     }
            // }
        })()
    }, []);

    const formik = useFormik({
        initialValues: {
            searchDetails: '',
            querySequence: '',
            alignments: 5000,
            genePastPercentage: 80,
            expectCutoff: 10,
            fragmentStretch: 50,
            fragmentAminoAcid: 96,
            docPublicSel: "BEF",
            publishGQSel: "BEF",
            patientDocSel: "LTE",
            docPublicDate: moment(),
            publishGQDate: moment(),
            genepastPercentageOver: "QUERY",
            patientDocInp: 100000,
            minResidues: 6,
            maxResidues: 100000
        },
        validationSchema: Validate.IpSeqSearchValidate(sequenceTypeValue),
        onSubmit: async (values) => {
            console.log('formikValues', values)

            let sdbFilterData = [];
            if (isDocPubDate) {
                let docPubStatus;
                if (isDocPubUnknownDates && values.docPublicSel == "BEF") {
                    docPubStatus = "BEF_IE"
                } else if (isDocPubUnknownDates && values.docPublicSel == "AFT") {
                    docPubStatus = "AFT_IE"
                } else {
                    docPubStatus = values.docPublicSel.toString()
                }
                let obj = {
                    "P": "SEQUENCE_D1",
                    "O": docPubStatus,
                    "V": moment(values.docPublicDate).format('YYYYMMDD')
                }
                sdbFilterData.push(obj);
            }
            if (isPublished) {
                let publishedStatus;
                if (ispublishGQUnknownDates && values.docPublicSel == "BEF") {
                    publishedStatus = "BEF_IE"
                } else if (ispublishGQUnknownDates && values.docPublicSel == "AFT") {
                    publishedStatus = "AFT_IE"
                } else {
                    publishedStatus = values.publishGQSel.toString()
                }
                let obj = {
                    "P": "SEQUENCE_D2",
                    "O": publishedStatus,
                    "V": moment(values.publishGQDate).format('YYYYMMDD')
                }
                sdbFilterData.push(obj);
            }
            if (isPatientDoc) {
                let obj = {
                    "P": "SEQUENCE_P9",
                    "O": values.patientDocSel.toString(),
                    "V": values.patientDocInp
                }
                sdbFilterData.push(obj);
            }
            console.log('sdbFilterData.toString()', sdbFilterData)
            let data = {
                qdb_seq: values.querySequence,
                qdb_seq_type: sequenceTypeValue, // nucleotide or protein, query sequence type based on the above query seq.
                qdb_id: "", // will have such value for virtual query database, not included in this release yet
                searchtype: "FTO", // leave it as always "FTO"
                title: values.searchDetails, // Workflow name
                email: sendMailAfterSearch ? localStorage.getItem('userName') : '', // When "Send email when the search is done" is checked, retrieve the email from the user info
                nucandprot: isBothDbSelected, // "on" when selecting both NUC and PRO databases
                strat_name: searchAlgorithmValue, // Genepast -> kerr, Blast -> blast, Fragment Search -> fragment, Motif -> motif
                /*
                strat_sw_scoring_matrix_nuc: "NUC.3.1",
                strat_sw_scoring_matrix_pro: "BLOSUM62",
                strat_sw_gapo_nuc: "1",
                strat_sw_gape_nuc: "1",
                strat_sw_gapo_pro: "1",
                strat_sw_gape_pro: "1",*/
                seqlenrange_low: values.minResidues, // Limit subject length from
                seqlenrange_high: values.maxResidues, // Limit subject length to
                best_hit_keep_max: values.alignments, // Keep a maximum of xxx results
                // sdb_filters example, publication date before 2021/05/27
                //                    & No. of Seq. is less than or equal to 100,000
                //                    & Date of entry before 2021/05/27
                // [{"P":"SEQUENCE_D1","O":"BEF","V":20210527},
                //  {"P":"SEQUENCE_P9","O":"LTE","V":100000},
                //  {"P":"SEQUENCE_D2","O":"BEF","V":20210527}]
                sdb_filters: sdbFilterData && sdbFilterData.length > 0 ? sdbFilterData : "",
                nucdb_type: "multiple", // always multiple
                nucdbs: nucDb,
                // nucdbs: "[\"p:GQPAT_NUC\", \"p:GENA\"]", // string array of databases
                protdb_type: "multiple", // always multiple
                protdbs: proDb, // Similar like nucdbs
                template_name: saveFormValue ? values.formName : '', // Set this value when selecting "Save this form for later use as"
                parent_id: "" // When having the patent workflow, for the "redo" scenario
            };
            if (searchAlgorithmValue == "kerr") {
                // Genepast parameters
                data.strat_genepast_perc_id = values.genePastPercentage;
                data.strat_genepast_perc_id_over = values.genepastPercentageOver;
            } else if (searchAlgorithmValue == "blast") {
                // Blast
                data.strat_blast_word_size_nuc = sequenceTypeValue && sequenceTypeValue == "nucleotide" ? wordSizeValue : ""; // Word Size - Nucleotide
                data.strat_blast_scoring_matrix_nuc = sequenceTypeValue && sequenceTypeValue == "nucleotide" ? scoringMatrixValue : ""; // Scoring matrix - Nucleotide
                data.strat_blast_word_size_pro = sequenceTypeValue && sequenceTypeValue == "protein" ? wordSizeValue : ""; // Word Size - Protein
                data.strat_blast_scoring_matrix_pro = sequenceTypeValue && sequenceTypeValue == "protein" ? scoringMatrixValue : ""; // Scoring matrix - Protein
                data.strat_blast_eval_cutoff = values.expectCutoff; // Expect Cutoff
                data.strat_blast_hsp = processHsp ? "on" : ""; // HSP handling, "on" when the checkbox is selected
            } else if (searchAlgorithmValue == "fragment") {
                // Fragment
                data.strat_fragment_window_length_nuc = sequenceTypeValue && sequenceTypeValue == "nucleotide" ? values.fragmentStretch : ""; // Window Length - Nuc
                data.strat_fragment_perc_id_nuc = sequenceTypeValue && sequenceTypeValue == "nucleotide" ? values.fragmentAminoAcid : ""; // Percentage Identity - Nuc
                data.strat_fragment_window_length_pro = sequenceTypeValue && sequenceTypeValue == "protein" ? values.fragmentStretch : ""; // Window Length - Prt
                data.strat_fragment_perc_id_pro = sequenceTypeValue && sequenceTypeValue == "protein" ? values.fragmentAminoAcid : ""; // Percentage Identity - Prt
            }


            console.log('submitdata', data)
            let resp = await submitSeqSearch(data, null, t);
            if (resp && resp.response_status == 0) {
                setShowSuccessModal(true);
                closeSuccessModal();
            } else {
                let setMessage = resp && resp.response_content && resp.response_content.type ? resp.response_content.type : "Unknown";
                setShowErrorModal(true);
                setErrorMsg(setMessage);
            }
        },
    });


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

    function closeSuccessModal() {
        setTimeout(() => {
            setShowSuccessModal(false);
            history.push('/home')
        }, 5000)
    }

    function handleErrorModal() {
        setShowErrorModal(!showErrorModal);
    }

    const handleSearchAlgorithm = (event) => {
        setSearchAlgorithm(event.target.value);

    };

    const handleSequenceType = (event) => {
        setSequenceType(event.target.value);
        formik.setFieldValue("querySequence", '');
        if (event.target.value == "nucleotide") {
            setScoringMatrix('NUC3.1');
            setWordSize('11');
        } else {
            setScoringMatrix('BLOSUM62');
            setWordSize('3');
        }
    };

    const handleSingleCheck = e => {
        const { name, id } = e.target;
        if (isChecked.includes(id)) {
            setIsChecked(isChecked.filter(checked_name => checked_name !== id));
            const index = dbTypeArray.indexOf(name);
            if (index > -1) {
                dbTypeArray.splice(index, 1);
                setDbTypeArray([...dbTypeArray])
            }
            setTimeout(function () {
                let twoDbSelected = dbTypeArray.includes("nuc") && dbTypeArray.includes("pro") ? "on" : "";
                setIsBothDbSelected(twoDbSelected)
            }, 3000);

            name && name == "nuc" ? setNucDb(nucDb.filter(dbName => dbName !== id)) : setProDb(proDb.filter(dbName => dbName !== id));
            return setAllChecked(false);
        }
        isChecked.push(id);
        setIsChecked([...isChecked]);
        setAllChecked(isChecked.length === proPatentData.length)
        dbTypeArray.push(name)
        setDbTypeArray([...dbTypeArray]);
        if (name && name == "nuc") {
            nucDb.push(id.toString());
            setNucDb([...nucDb]);
        } else if (name && name == "pro") {
            proDb.push(id.toString());
            setProDb([...proDb]);
        }
        setTimeout(function () {
            let twoDbSelected = dbTypeArray.includes("nuc") && dbTypeArray.includes("pro") ? "on" : "";
            setIsBothDbSelected(twoDbSelected)
        }, 3000);
    };

    function handleDbChange(id, name) {
        if (name && name == "nuc") {
            if (nucDb.includes(id)) {
                setNucDb(nucDb.filter(dbName => dbName !== id));
            } else {
                nucDb.push(id.toString());
                setNucDb([...nucDb]);
            }
        } else if (name && name == "pro") {
            if (proDb.includes(id)) {
                setProDb(proDb.filter(dbName => dbName !== id));
            } else {
                proDb.push(id.toString());
                setProDb([...proDb]);
            }
        }
    }


    console.log('isChecked', isChecked)
    // console.log('isnucselecte', isNucSelected)
    // console.log('isproselecte', isProSelected)
    console.log('dbtypearray', dbTypeArray)
    console.log('bothdbselected', isBothDbSelected)
    console.log('nucDb', nucDb)
    console.log('proDb', proDb)



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
            value: "BEF",
            label: "Before",
            id: "BEF"
        },
        {
            value: "BEF_IE",
            label: "Before or is empty",
            id: "BEF_IE"
        },
        {
            value: "AFT",
            label: "After",
            id: "AFT"
        },
        {
            value: "AFT_IE",
            label: "Aftre or is empty",
            id: "AFT_IE"
        }
    ];
    const GQSpecificSel = [
        {
            value: "LTE",
            label: "is less than or equal to",
            id: "LTE"
        },
        {
            value: "LT",
            label: "is less than",
            id: "LT"
        },
        {
            value: "EQ",
            label: "equals",
            id: "EQ"
        },
        {
            value: "NEQ",
            label: "does not equal",
            id: "NEQ"
        },
        {
            value: "GT",
            label: "is greater than",
            id: "GT"
        },
        {
            value: "GTE",
            label: "is greater than or equal to",
            id: "GTE"
        }
    ];
    const searchAlgorithmItems = [
        {
            value: "kerr",
            label: "GenePast Search"
        },
        {
            value: "blast",
            label: "BLAST Search"
        },
        {
            value: "fragment",
            label: "Fragment Search"
        },
        {
            value: "motif",
            label: "MOTIF Search"
        }
    ];

    const genePastItems = [
        {
            value: "QUERY",
            label: "my query"
        },
        {
            value: "SUBJECT",
            label: "any subject"
        },
        {
            value: "SHORTER",
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
    console.log('formik', formik)

    let subjectText = "GenomeQuest: Error updating account information [Error code: " + errorMsg + "]";

    return (
        <div className={classes.grow}>
            <SaveContentModal
                show={showSuccessModal}
                onMessage={t('searchSubmitted')}
                type="seqSearch"
            />
            <ContactSupportErrorModal
                show={showErrorModal}
                errorCode={errorMsg}
                modalCallBack={handleErrorModal}
                subjectText={subjectText}
                errorContent={t("seqSearchErrorOccured")}
            />
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
                </Row>
                <hr />
                <Row>
                    <Col sm="12" md="12">
                        <p className="loginTitle w-75 mb-10 float-left">{t('querySequences')}</p>
                        <Link className={"appTextFont appLinkColor float-right"} to="/help">{t('help')}</Link>
                    </Col>
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
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="These are" name="customized-radios" value={sequenceTypeValue} onChange={handleSequenceType}>
                                <span className={classes.theseAreText}>{t("theseAre")}</span>
                                <FormControlLabel value="nucleotide" control={<RadioButton />} label="Nucleotide Sequences" />
                                <FormControlLabel value="protein" control={<RadioButton />} label="Protein Sequences" />
                            </RadioGroup>
                        </FormControl>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm="12" md="12">
                        <p className="loginTitle w-75 mb-10 float-left">{t('searchAlgorithmAndSetting')}</p>
                        <Link className={"appTextFont appLinkColor float-right"} to="/help">{t('help')}</Link>
                    </Col>
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
                                onChange={handleSearchAlgorithm}
                                className={"float-left"}
                            />
                            {searchAlgorithmValue && searchAlgorithmValue == 'kerr' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    {t("findAtleast")}&nbsp;&nbsp;&nbsp;
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
                                    &nbsp;&nbsp;% {t("identityOver")} &nbsp;&nbsp;
                            </Typography>
                                <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="genepastPercentageOver"
                                    id="genepastPercentageOver"
                                    value={formik.values.genepastPercentageOver}
                                    items={genePastItems}
                                    onChange={formik.handleChange}
                                    className={"float-left"}
                                />
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'blast' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    {t("scoringMatrix")}&nbsp;&nbsp;&nbsp;
                            </Typography>
                                {sequenceTypeValue == 'nucleotide' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="scoringMatrix"
                                    id="scoringMatrix"
                                    value={scoringMatrixValue}
                                    items={nucleotideMatrixItems}
                                    className={"float-left"}
                                />
                                }
                                {sequenceTypeValue == 'protein' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="scoringMatrix"
                                    id="scoringMatrix"
                                    value={scoringMatrixValue}
                                    items={proteinMatrixItems}
                                    className={"float-left"}
                                />
                                }
                                <Typography className={"float-left " + classes.seqText}>
                                    &nbsp;&nbsp;{t("wordSize")} &nbsp;&nbsp;
                            </Typography>
                                {sequenceTypeValue == 'nucleotide' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="wordSize"
                                    id="wordSize"
                                    value={wordSizeValue}
                                    items={nucleotidewordSizeItems}
                                    className={"float-left " + classes.smallTextBox}
                                />
                                }
                                {sequenceTypeValue == 'protein' && <SelectBox
                                    margin="normal"
                                    variant="outlined"
                                    name="wordSize"
                                    id="wordSize"
                                    value={wordSizeValue}
                                    items={proteinwordSizeItems}
                                    className={"float-left " + classes.smallTextBox}
                                />
                                }
                                <div className={classes.blastMargin}>
                                    <Typography className={"float-left " + classes.seqText}>
                                        {t("expectCutOff")}&nbsp;&nbsp;&nbsp;
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
                                        color="primary"
                                        className={"float-left ml-20 " + classes.processHsps}
                                        name="processHsps"
                                        id="processHsps"
                                        onChange={() => setProcessHsp(!processHsp)}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("processHsps")} &nbsp;&nbsp;&nbsp;
                                    </Typography>
                                </div>
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'fragment' && <Fragment>
                                <Typography className={"float-left " + classes.seqText}>
                                    {t("findStretchAtLeast")}&nbsp;&nbsp;&nbsp;
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
                                    &nbsp;&nbsp;{t("aminoAcidWith")} &nbsp;&nbsp;
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
                                />
                                <Typography className={"float-left mt-2"}>
                                    &nbsp;&nbsp;% {t("identityOrMore")}
                                </Typography>
                            </Fragment>
                            }
                            {searchAlgorithmValue && searchAlgorithmValue == 'motif' && <Fragment>
                                <Link className={"float-left " + classes.seqText}>
                                    {t("examplesOfValidMotif")}&nbsp;&nbsp;&nbsp;
                            </Link>
                            </Fragment>
                            }
                        </Col>    
                    </AccordionDetails>a
                    <AccordionDetails className="appTextColor">
                        <Col md="12">
                            <Typography className={"float-left " + classes.seqText}>
                                {t("Report")}&nbsp;&nbsp;&nbsp;
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
                                &nbsp;&nbsp;{t("bestAlignmentsPerQuerySeq")}&nbsp;&nbsp;
                            </Typography>
                        </Col>
                    </AccordionDetails>
                </Row>
                <Row>
                    <AccordionDetails className="appTextColor">
                        <Col md="12">
                            <CheckBox
                                color="primary"
                                className={"float-left"}
                                name="compareboth"
                                id="compareboth"
                                disabled={searchAlgorithmValue && searchAlgorithmValue == 'motif' ? true : false}
                            // onChange={() => setIsDocPubDate(!isDocPubDate)}
                            />
                            <Typography className={"float-left mt-2"}>
                                {t("compareBothNucPro")} &nbsp;&nbsp;&nbsp;
                            </Typography>
                        </Col>
                    </AccordionDetails>
                </Row>
                <hr />
                <Row>
                    <Col md="11">
                        <Accordion square expanded={seqDBFilter} onChange={() => setSeqDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="loginTitle p-0">
                                <p className="loginTitle m-0">
                                    {seqDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!seqDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>{t("generalSeqDbFilter")}</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails className="appTextColor">
                                <Col md="12">
                                    <Typography className={"float-left " + classes.seqText}>
                                        {t("searchOnlySeqBetween")}&nbsp;&nbsp;&nbsp;
                                    </Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="minResidues"
                                        name="minResidues"
                                        // label={6}
                                        variant="outlined"
                                        value={formik.values.minResidues}
                                        onChange={formik.handleChange}
                                        error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                        helperText={formik.touched.minResidues && formik.errors.minResidues}
                                        className={"float-left"}
                                    />
                                    <Typography className={"float-left " + classes.seqText}>
                                        &nbsp;&nbsp;{t("and")}&nbsp;&nbsp;
                                    </Typography>
                                    <TextInput
                                        fullWidth={false}
                                        id="maxResidues"
                                        name="maxResidues"
                                        // label={maxResidues}
                                        variant="outlined"
                                        value={formik.values.maxResidues}
                                        onChange={formik.handleChange}
                                        error={formik.touched.maxResidues && Boolean(formik.errors.maxResidues)}
                                        helperText={formik.touched.maxResidues && formik.errors.maxResidues}
                                        className={"float-left"}
                                    />
                                    <Typography className={"float-left " + classes.seqText}>
                                        &nbsp;&nbsp;&nbsp;{t("residuesInLength")}
                                    </Typography>
                                </Col>
                                <br clear="all"></br>
                                <br clear="all"></br>
                                <Col md="12">
                                    <CheckBox
                                        color="primary"
                                        className={"float-left"}
                                        name="isDocumentPublic"
                                        id="isDocumentPublic"
                                        onChange={() => setIsDocPubDate(!isDocPubDate)}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("docPublicationDate")} &nbsp;&nbsp;&nbsp;
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
                                        disabled={isDocPubDate ? false : true}
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
                                            formik.setFieldValue("docPublicDate", val);
                                        }}
                                        disabled={isDocPubDate ? false : true}
                                    />
                                    <CheckBox
                                        color="primary"
                                        className={"float-left mx-2"}
                                        name="includeGenUnknownDate"
                                        id="includeGenUnknownDate"
                                        onChange={() => { setIsDocPubUnknownDates(!isDocPubUnknownDates) }}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("includeUnknownDates")}
                                    </Typography>
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="1" className={classes.desktopHelpLink}>
                        <Link className="appTextFont appLinkColor float-right mr-2">{t("help")}</Link>
                    </Col>
                    <Col md="12">
                        <Accordion square expanded={specificDBFilter} onChange={() => setSpecificDBFilter(prevState => !prevState)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="loginTitle p-0">
                                <p className="loginTitle m-0">
                                    {specificDBFilter && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                    {!specificDBFilter && <ArrowRightIcon className={classes.arrowIcon} />}
                                    <b className={classes.arrowIconTitle}>{t("GQPatSpecificDbFilters")}</b>
                                </p>
                            </AccordionSummary>
                            <AccordionDetails className="loginTitle">
                                <Col md="12">
                                    <CheckBox
                                        color="primary"
                                        className={"float-left"}
                                        name="publishGenomeQuest"
                                        id="publishGenomeQuest"
                                        onChange={() => setIsPublished(!isPublished)}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("publishedInGenomeQuest")} &nbsp;&nbsp;&nbsp;
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
                                        disabled={isPublished ? false : true}
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
                                            formik.setFieldValue("publishGQDate", val);
                                        }}
                                        disabled={isPublished ? false : true}
                                    />
                                    <CheckBox
                                        color="primary"
                                        className={"float-left mx-2"}
                                        name="includeGQSpecificDate"
                                        id="includeGQSpecificDate"
                                        onChange={() => { setIspublishGQUnknownDates(!ispublishGQUnknownDates) }}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("includeUnknownDates")}
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
                                        onChange={() => setIsPatientDoc(!isPatientDoc)}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {t("patientDocContains")} &nbsp;&nbsp;&nbsp;
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
                                        disabled={isPatientDoc ? false : true}
                                    />
                                    <TextInput
                                        fullWidth={false}
                                        id="patientDocInp"
                                        name="patientDocInp"
                                        // label={maxResidues}
                                        variant="outlined"
                                        value={formik.values.patientDocInp}
                                        onChange={formik.handleChange}
                                        // error={formik.touched.minResidues && Boolean(formik.errors.minResidues)}
                                        // helperText={formik.touched.minResidues && formik.errors.minResidues}
                                        className={"float-left mx-4"}
                                        disabled={isPatientDoc ? false : true}
                                    />
                                    <Typography className={"float-left mt-2"}>
                                        {(t("sequences"))}
                                    </Typography>
                                </Col>
                            </AccordionDetails>
                        </Accordion>
                    </Col>
                    <Col md="12" className={classes.mobileHelpLink}>
                        <Link className="appTextFont appLinkColor float-right mr-2">{t("help")}</Link>
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
                            <div>
                                <Accordion expanded={formCheck1} onChange={() => setformCheck1(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="loginTitle p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck1 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck1 && <ArrowRightIcon className={classes.arrowIcon} />}

                                            <b className={classes.arrowIconTitle}>{t("nucPatentDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>                                            {nucPatentData.map((test, index) => (
                                        <div className="relativePosition"
                                            key={index}
                                        >
                                            <CheckBox
                                                name="nuc"
                                                id={test.id}
                                                checked={isChecked.includes(test.id)}
                                                onChange={handleSingleCheck}
                                                className={"absolutePosition " + classes.checkBox}
                                                color="primary"
                                            />
                                            <label className={classes.checkBoxContent}>{test.label}</label>
                                        </div>
                                    ))
                                    }
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion expanded={formCheck3} onChange={() => setformCheck3(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck3 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck3 && <ArrowRightIcon className={classes.arrowIcon} />}

                                            <b className={classes.arrowIconTitle}>{t("referenceNucDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {nucReferenceData.map((test, index) => (
                                            <div className="relativePosition"
                                                key={index}
                                            >
                                                <Checkbox
                                                    name="nuc"
                                                    id={test.id}
                                                    checked={isChecked.includes(test.id)}
                                                    onChange={handleSingleCheck}
                                                    className={"absolutePosition " + classes.checkBox}
                                                    color="primary"
                                                />
                                                <label className={classes.checkBoxContent}>{test.label}</label>
                                            </div>
                                        ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion expanded={formCheck5} onChange={() => setformCheck5(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck5 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck5 && <ArrowRightIcon className={classes.arrowIcon} />}
                                            <b className={classes.arrowIconTitle}>{t("genBankNucDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {nucGenBankData.map((test, index) => (
                                            <div className="relativePosition"
                                                key={index}
                                            >
                                                <Checkbox
                                                    name="nuc"
                                                    id={test.id}
                                                    checked={isChecked.includes(test.id)}
                                                    onChange={handleSingleCheck}
                                                    className={"absolutePosition " + classes.checkBox}
                                                    color="primary"
                                                />
                                                <label className={classes.checkBoxContent}>{test.label}</label>
                                            </div>
                                        ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion expanded={formCheck7} onChange={() => setformCheck7(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck7 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck7 && <ArrowRightIcon className={classes.arrowIcon} />}
                                            <b className={classes.arrowIconTitle}>{t("personalNucDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FolderTreeStructure treeData={nucPersonalData} parentCallBack={handleDbChange} dbName="nuc" />
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </Col>
                        <Col md="6">
                            <div>
                                <Accordion expanded={formCheck2} onChange={() => setformCheck2(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck2 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck2 && <ArrowRightIcon className={classes.arrowIcon} />}
                                            <b className={classes.arrowIconTitle}>{t("proteinPatDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {proPatentData.map((test, index) => (
                                            <div className="relativePosition"
                                                key={index}
                                            >
                                                <Checkbox
                                                    name="pro"
                                                    id={test.id}
                                                    checked={isChecked.includes(test.id)}
                                                    onChange={handleSingleCheck}
                                                    className={"absolutePosition " + classes.checkBox}
                                                    color="primary"
                                                />
                                           <label className={classes.checkBoxContent}>{test.label}</label>
                                            </div>
                                        ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion expanded={formCheck4} onChange={() => setformCheck4(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck4 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck4 && <ArrowRightIcon className={classes.arrowIcon} />}
                                            <b className={classes.arrowIconTitle}>{t("referenceProDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {proReferenceData.map((test, index) => (
                                            <div className="relativePosition"
                                                key={index}
                                            >
                                                <Checkbox
                                                    name="pro"
                                                    id={test.id}
                                                    checked={isChecked.includes(test.id)}
                                                    onChange={handleSingleCheck}
                                                    className={"absolutePosition " + classes.checkBox}
                                                    color="primary"
                                                />
                                           <label className={classes.checkBoxContent}>{test.label}</label>
                                            </div>
                                        ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion expanded={formCheck6} onChange={() => setformCheck6(prevState => !prevState)}>
                                    <AccordionSummary aria-controls="panel1c-content" id="panel1c-header" className="p-0">
                                        <p className="loginTitle m-0">
                                            {formCheck6 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                                            {!formCheck6 && <ArrowRightIcon className={classes.arrowIcon} />}
                                            <b className={classes.arrowIconTitle}>{t("personalProDb")}</b>
                                        </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FolderTreeStructure treeData={proPersonalData} parentCallBack={handleDbChange} dbName="pro" />
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </Col>
                    </Row>
                </div>
                <ColoredLine color="#f3f2f2" />
                <div>
                    <Row>
                        <Col md="11">
                            <p className="ml-3">{t("executingSearch")}</p>
                            <p className={"loginTitle ml-5"}>
                                <b>
                                    {t("total2Credits")}
                                </b>
                            </p>
                        </Col>
                        <Col md="1" className={classes.desktopHelpLink}>
                            <Link className="appTextFont appLinkColor float-right mr-2">{t("help")}</Link>
                        </Col>
                    </Row>
                   {ppuType != "0" && <Row>
                        <Col md="12">
                            <CheckBox
                                // defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="checkTerms"
                                id="checkTerms"
                                onChange={() => { setIsSubmitActive(!isSubmitActive) }}
                            />
                            <Typography className={"float-left mt-2"}>
                                {t("acceptTermsCheckBox")}
                            </Typography>
                        </Col>
                    </Row>
                    }
                    <ColoredLine color="#f3f2f2" />
                    <Row>
                        <Col md="12">
                            <CheckBox
                                // defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="check"
                                id="check"
                                onChange={() => { setSendMailAfterSearch(!sendMailAfterSearch) }}
                            />
                            <Typography className={"float-left mt-2"}>
                                {t("sendMailAfterSearch")}
                            </Typography>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='4' className="">
                            <CheckBox
                                // defaultChecked
                                color="primary"
                                className={"float-left mx-2"}
                                name="saveForm"
                                id="saveForm"
                                onChange={() => { setSaveFormValue(!saveFormValue) }}
                            />
                            <Typography className={"float-left mt-2"}>
                                {t("SaveFormForlaterUse")}
                            </Typography>
                        </Col>
                        <Col md='6'>
                            <TextInput
                                id="formName"
                                name="formName"
                                label='Name the form'
                                variant="outlined"
                                onChange={formik.handleChange}
                                fullWidth={true}
                                disabled={!saveFormValue}
                            />
                        </Col>
                    </Row>
                </div>
                <br></br>
                <Row >
                    <Col>
                        <Button color="primary" variant="contained" className={"float-right  text-capitalize " + classes.marginLeftCancel} type="submit">
                            {t("cancel")}
                        </Button>
                        {isSubmitActive && <Button color="primary" variant="contained" className="float-right loginSubmit text-capitalize" type="submit">
                            {t("submit")}
                        </Button>}
                        {!isSubmitActive && <Button variant="contained" className="float-right text-capitalize" disabled>
                            {t("submit")}
                        </Button>}
                    </Col>
                </Row>
            </form>
        </div>
    );
}

export default IpSeqSearch;
