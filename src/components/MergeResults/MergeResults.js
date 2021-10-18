import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import GQLogo from '../../assets/image/GenomeQuest.svg';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import Newsupdate from '../../shared/newspdate';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Validate from '../../helpers/validate';
import Modal from 'react-bootstrap/Modal'
// import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import RadioButton from '../../shared/Fields/RadioButton';
import CloseIcon from '@material-ui/icons/Close';
import { RadioGroup, FormControlLabel, FormLabel, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import TextInput from '../../shared/Fields/TextInput';

//images
import complete from '../../assets/image/complete.png';
import overlap from '../../assets/image/overlap.png';
import nonOverlap from '../../assets/image/nonOverlap.png';
import nonOverlapGroupA from '../../assets/image/nonOverlapGroupA.png';
import nonOverlapGroupB from '../../assets/image/nonOverlapGroupB.png';

//service
import SearchManagementService from '../../services/searchmanagement';

//component
import ContactSupportErrorModal from '../../shared/Modal/ContactSupportErrorModal';



const useStyles = makeStyles((theme) => ({

    passwordRecoverDiv: {
        padding: '15px 25px 20px',
        border: '2px solid #bfb4b4',
        borderRadius: '6px'
    },
    colDesign: {
        marginLeft: '-65px'
    },
    colPading: {
        padding: '3px !important'
    },
    colPading1: {
        padding: '3px !important'
    },
    colDesign1: {
        marginLeft: '-20px'
    },
    imageStyle: {
        width: '114%',
        marginLeft: '-53px',
        marginTop: '28px',
    },
    loginLogoDiv: {
        position: 'relative',
        left: '0px',
        width: '200px'
    },
    materialUILabel: {
        fontStyle: 'italic'
    },
    //modal
    modalHeader: {
        borderBottom: 'none !important',
        padding: '4px 4px 3px 0px',
        display: "block !important"
    },
    footerDiv: {
        padding: '0 30px',
        marginTop: '-5px',
        marginRight: '-10px',
    },
    //viswes
    modalBody: {
        margin: "0 20px 20px 20px",
        backgroundColor: "#EEEEEE",
        padding: "38px"
    },
    titleFont: {
        fontSize: "20px !important"
    },
    subTitleFont: {
        fontWeight: "bold"
    },
    resultTextField: {
        backgroundColor: "white",
        borderRadius: "7px"
    },
    root: {
        "& .Mui-error": {
            fontStyle: 'italic'
        },
        "& .MuiFormHelperText-root": {
            fontStyle: 'italic'
        }
    },
    '@media (min-width: 768px)': {
        loginLogoDiv: {
            position: 'relative',
            left: '28px',
            width: '100%'
        }
    }
}));
const data = [
    {
        name: "Complete merge, every document in group A and B",
        result: "pass",
        value: "COMPLETE"
    },
    {
        name: "Overlap, only documents common to both group A and B",
        result: "pass",
        value: "OVERLAP"
    },
    {
        name: "Non-overlap, only documents unique to group A or B",
        result: "pass",
        value: "ONLY_A_B"
    },
    {
        name: "Non-overlap group A, only documents unique to group A",
        result: "pass",
        value: "ONLY_A"
    },
    {
        name: "Non-overlap group B, only documents unique to group B",
        result: "pass",
        value: "ONLY_B"
    },

];

const customStyles = {
    rows: {
        style: {
            minHeight: '50px',// override the row height
            backgroundColor: "#EEEEEE",
            borderBottom: '1px solid #0606061f'
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            borderLeft: '2px solid #0606061f',
            borderBottom: '1px solid #0606061f',
            '&:first-child': {
                borderLeft: '0',
            },
            fontWeight: 'bold',
            color: '#777777',
            backgroundColor: "#EEEEEE"
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
            borderLeft: '2px solid #0606061f',
            borderBottom: '1px solid #0606061f',
            '&:first-child': {
                borderLeft: '0',
            },
            display: 'grid',
            textAlign: 'center',
            color: '#777777'
        },

    },
};

function MergeResults(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');
    const [passwordForm, setPasswordForm] = useState(true);
    const dispatch = useDispatch();
    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [formData, setFormData] = useState(data);
    const [allChecked, setAllChecked] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const [mergeType, setMergeType] = useState("COMPLETE");
    const [groupAValue, setGroupAValue] = useState([]);
    const [groupBValue, setGroupBValue] = useState([]);
    const [groupValue, setGroupValue] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [errorHeading, setErrorHeading] = useState("");
    const [isSubmitActive, setIsSubmitActive] = useState(false);

    const { show, selectData, close } = props;

    // reset login status
    useEffect(() => {
    }, []);
    let initialValues = { title: "" }
    const formik = useFormik({
        initialValues,
        validationSchema: Validate.MergeResultsValidate(),
        onSubmit: async (values, { resetForm }) => {
            let resp = await SearchManagementService.mergeResults(groupAValue, groupBValue, values.title, mergeType);
            if (resp && resp.response_status == 0) {
                let result = resp.response_content ? JSON.parse(resp.response_content) : "";
                if (result.status && result.status == "success") {
                    clearForm('closeMergeModal', 'success');
                } else if (result.status && result.status == "error") {
                    setShowErrorModal(true);
                    setErrorMsg(result.error.message ? result
                        .error.message : "Unknown");
                    setErrorHeading(t("mergeResultErrorHeading"))
                }
            } else {
                setShowErrorModal(true);
                setErrorMsg(resp.response_content.message ? resp.response_content.message : "Unknown");
                setErrorHeading(t("mergeResultErrorHeading"))
            }
        }
    });

    function handleErrorModal(type) {
        setShowErrorModal(!showErrorModal);
        // close()
        if (type && type == "cancel") {
            clearForm();
        }
    }
    function clearForm(type, resultType) {
        setGroupAValue([]);
        setGroupBValue([]);
        setMergeType("COMPLETE");
        formik.setFieldValue("title", "");
        setIsSubmitActive(false);
        if (type && type == "closeMergeModal" && !resultType) {
            close();
        } else if (type && type == "closeMergeModal" && resultType) {
            close(resultType);
        }
    }

    function closeSaveModal() {
        setShowSuccessModal(false);
    }

    const handleSingleCheck = e => {
        const { name } = e.target;
        if (isChecked.includes(name)) {
            setIsChecked(isChecked.filter(checked_name => checked_name !== name));
            return setAllChecked(false);

        }
        isChecked.push(name);
        setIsChecked([...isChecked]);
        setAllChecked(isChecked.length === formData.length)
    };

    const setGroupClass = (name, value) => {
        if (name && name == "groupA" && value) {
            if (groupAValue.includes(value)) {
                setGroupAValue(groupAValue.filter(checked_name => checked_name !== value));
            } else {
                groupAValue.push(value);
                setGroupAValue([...groupAValue]);
            }
            if (groupBValue.includes(value)) {
                setGroupBValue(groupBValue.filter(checked_name => checked_name !== value));
            }
            if ((groupAValue.length + groupBValue.length) == selectData.selectedCount) {
                setIsSubmitActive(true);
            }
        } else if (name && name == "groupB" && value) {
            if (groupBValue.includes(value)) {
                setGroupBValue(groupBValue.filter(checked_name => checked_name !== value));
            } else {
                groupBValue.push(value);
                setGroupBValue([...groupBValue]);
            }
            if (groupAValue.includes(value)) {
                setGroupAValue(groupAValue.filter(checked_name => checked_name !== value));
            }
            if ((groupAValue.length + groupBValue.length) == selectData.selectedCount) {
                setIsSubmitActive(true);
            }
        }
    }

    const columns = [
        {
            name: "Group A",
            selector: "groupA",
            center: true,
            width: "11%",
            cell: (row, index) => <FormControl component="fieldset">
                <RadioGroup row name={"groupValue_" + index} onChange={(e) => setGroupClass('groupA', e.target.value)} value={groupAValue.includes(row.id) ? row.id : ""}>
                    <FormControlLabel value={row.id} control={<RadioButton />} className="bodyText" />
                </RadioGroup>
            </FormControl>
        },
        {
            name: "Group B",
            selector: "groupB",
            center: true,
            width: "11%",
            cell: (row, index) => <FormControl component="fieldset">
                <RadioGroup row name={"groupValue_" + index} onChange={(e) => setGroupClass('groupB', e.target.value)} value={groupBValue.includes(row.id) ? row.id : ""}>
                    <FormControlLabel value={row.id} control={<RadioButton />} className="bodyText" />
                </RadioGroup>
            </FormControl>
        },
        {
            name: "Type",
            selector: "type",
            center: true,
            width: "30%"
        },
        {
            name: "Description",
            selector: "description",
            center: true
        }
    ];

    let imageSrc = mergeType == "COMPLETE" ? complete : mergeType == "OVERLAP" ? overlap : mergeType == "ONLY_A_B" ? nonOverlap : mergeType == "ONLY_A" ? nonOverlapGroupA : nonOverlapGroupB;

    let subjectText = "GenomeQuest: Error merging the selected items [Error code: " + errorMsg + "]";

    return (
        <Container className="mt-100">
            {/* <SeqVIModal
                show={showSuccessModal}
                onMessage={t('searchSubmitted')}
                saveCallBack={closeSaveModal}
            /> */}
            <ContactSupportErrorModal
                show={showErrorModal}
                errorCode={errorMsg}
                modalCallBack={handleErrorModal}
                subjectText={subjectText}
                errorContent={errorHeading}
                isWarning={false}
                type="mergeResult"
            />
            {/* <Button onClick={() => setLgShow(true)}>Large modal</Button> */}
            <Modal
                size="lg"
                show={show}
                onHide={close}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header className={classes.modalHeader}>
                    <Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={() => clearForm("closeMergeModal")} /></Link>
                </Modal.Header>
                <Modal.Body className={classes.modalBody}>
                    <form name="mergeResultsForm" onSubmit={formik.handleSubmit}>
                        <h4 className={"subHeading " + classes.titleFont}>Merge Result Sets</h4>
                        <p><span className={classes.subTitleFont}>Step 1 - </span><span>Name the new result set</span></p>
                        <div className="form-group mb-4">
                            <TextInput
                                fullWidth
                                id="title"
                                name="title"
                                label='Result Name'
                                variant="outlined"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                // className={classes.resultTextField}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </div>
                        <div className="mb-4">
                            <p><span className={classes.subTitleFont}>Step 2 - </span><span>Put the contributing result sets into one of two groups</span></p>
                            <DataTable
                                columns={columns}
                                data={selectData && selectData.selectedRows}
                                defaultSortField="date"
                                defaultSortAsc={false}
                                sortable={false}
                                sortServer={true}
                                noDataComponent={t('noSearchSubmit')}
                                customStyles={customStyles}
                                selectableRowsNoSelectAll
                                noHeader={true}
                            />
                        </div>
                        <Row className="mb-4">
                            <Col sm="12" md="8">
                                <p><span className={classes.subTitleFont}>Step 3 - </span><span>Choose how these two groups are merged</span></p>
                                <div className="form-group">
                                    <FormControl component="fieldset">
                                        <RadioGroup row name="mergeType" value={mergeType} onChange={(e) => setMergeType(e.target.value)}>
                                            {formData.map((test, index) => (
                                                <FormControlLabel value={test.value} control={<RadioButton />} label={test.name} className="bodyText" />
                                            ))
                                            }
                                        </RadioGroup>
                                    </FormControl>

                                </div>
                            </Col>
                            <Col sm="12" md="4" >
                                <img src={imageSrc} alt="ModuleImage" className={classes.imageStyle} />
                            </Col>
                        </Row>
                        <div id="mergeButtonDiv">
                            {!isSubmitActive && <Button type="submit" className={"disableButtonClass float-right ml-2"} id="mergeSubmit" disabled>Merge Results</Button>}
                            {isSubmitActive && <Button type="submit" className={"submitButtonClass float-right ml-2"} id="mergeSubmit">Merge Results</Button>}
                            <Button className={"cancelButtonClass float-right"} onClick={() => clearForm("closeMergeModal")} id="mergeCancel">Cancel</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>

    );
}

export default MergeResults;