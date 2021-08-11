import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import GQLogo from '../../assets/image/GenomeQuest.svg';
import TextField from '@material-ui/core/TextField';
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
import Table from 'react-bootstrap/Table';
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
        value: "complete"
    },
    {
        name: "Overlap, only documents common to both group A and B",
        result: "pass",
        value: "overlap"
    },
    {
        name: "Non-overlap, only documents unique to group A or B",
        result: "pass",
        value: "nonOverlap"
    },
    {
        name: "Non-overlap group A, only documents unique to group A",
        result: "pass",
        value: "nonOverlapGroupA"
    },
    {
        name: "Non-overlap group B, only documents unique to group B",
        result: "pass",
        value: "nonOverlapGroupB"
    },

];

const columns = [
    {
        name: "Group A",
        selector: "groupA",
        center: true,
        width: "11%",
        cell: row => <RadioButton
            color="primary"
            // className={"float-left p-0 " + classes.checkBox}
            name="groupA"
            id="groupA"
        // checked={termsDisable}
        // onClick={() => setTermsDisable(!termsDisable)}
        />
    },
    {
        name: "Group B",
        selector: "groupB",
        center: true,
        width: "11%",
        cell: row => <RadioButton
            color="primary"
            // className={"float-left p-0 " + classes.checkBox}
            name="acceptTerms"
            id="acceptTerms"
        // checked={termsDisable}
        // onClick={() => setTermsDisable(!termsDisable)}
        />
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
    const [mergeType, setMergeType] = useState("complete");
    // reset login status
    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);

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

    const { show, selectData, close } = props;
    console.log('data', mergeType)

    let imageSrc = mergeType == "complete" ? complete : mergeType == "overlap" ? overlap : mergeType == "nonOverlap" ? nonOverlap : mergeType == "nonOverlapGroupA" ? nonOverlapGroupA : nonOverlapGroupB;

    return (
        <Container className="mt-100">
            {/* <Button onClick={() => setLgShow(true)}>Large modal</Button> */}
            <Modal
                size="lg"
                show={show}
                onHide={close}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header className={classes.modalHeader}>
                    <Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={close} /></Link>
                </Modal.Header>
                <Modal.Body className={classes.modalBody}>
                    <h4 className={"subHeading " + classes.titleFont}>Merge Result Sets</h4>
                    <p><span className={classes.subTitleFont}>Step 1 - </span><span>Name the new result set</span></p>
                    <div className="form-group mb-4">
                        <TextInput
                            fullWidth
                            id="userName"
                            name="userName"
                            label='Result Name'
                            variant="outlined"
                            value=''
                            className={classes.resultTextField}
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
                    <div className='float-right'>
                        <Button className={"cancelButtonClass"} onClick={close}>Cancel</Button>
                        <Button className={"submitButtonClass"}>Merge Results</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>

    );
}

export default MergeResults;