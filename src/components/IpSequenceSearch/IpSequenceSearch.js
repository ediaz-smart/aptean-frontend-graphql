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
import DatePicker from '../../shared/Fields/DatePicker';
import TextArea from '../../shared/Fields/TextArea';
import { useFormik } from 'formik';
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
  const [formData, setFormData] = useState(data);
  const [formData1, setFormData1] = useState(data1);
  const [formData2, setFormData2] = useState(data2);
  const [formData3, setFormData3] = useState(data3);

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
  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 1
      }}
    />
  );
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
        <ColoredLine color="black" />

        <div>
          <Row>
            <Col md="6">
              <Accordion expanded={formCheck1} onChange={() => setformCheck1(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">

                  <p>

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
                    {formData1.map((test, index) => (
                      <div
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={test.name}
                          checked={isChecked.includes(test.name)}
                          onChange={handleSingleCheck}
                        />
                                        &nbsp; &nbsp;
                        <label style={{ fontSize: '14px' }}>{test.name}</label>
                      </div>
                    ))
                    }

                  </Col>
                </AccordionDetails>
              </Accordion>

            </Col>
            <Col md="5">
              <Accordion expanded={formCheck2} onChange={() => setformCheck2(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">
                  <p>
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
                    {formData.map((test, index) => (
                      <div
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={test.name}
                          checked={isChecked.includes(test.name)}
                          onChange={handleSingleCheck}
                        />
                                    &nbsp; &nbsp;
                        <label style={{ fontSize: '14px' }}>{test.name}</label>
                      </div>
                    ))
                    }

                  </Col>
                </AccordionDetails>
              </Accordion>

            </Col>
            <Col md="1">
              <Link className="float-right mr-2">Help</Link>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Accordion expanded={formCheck3} onChange={() => setformCheck3(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">

                  <p>
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
                    {formData2.map((test, index) => (
                      <div
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={test.name}
                          checked={isChecked.includes(test.name)}
                          onChange={handleSingleCheck}
                        />
                                        &nbsp; &nbsp;
                        <label style={{ fontSize: '14px' }}>{test.name}</label>
                      </div>
                    ))
                    }

                  </Col>
                </AccordionDetails>
              </Accordion>

            </Col>
            <Col md="5">
              <Accordion expanded={formCheck4} onChange={() => setformCheck4(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">
                  <p>
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
                    {formData3.map((test, index) => (
                      <div
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={test.name}
                          checked={isChecked.includes(test.name)}
                          onChange={handleSingleCheck}
                        />
                                      &nbsp; &nbsp;
                        <label style={{ fontSize: '14px' }}>{test.name}</label>
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
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">

                  <p>
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
            <Col md="5">
              <Accordion expanded={formCheck6} onChange={() => setformCheck6(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">
                  <p>
                    {formCheck6 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                    {!formCheck6 && <ArrowRightIcon className={classes.arrowIcon} />}
                    <b className={classes.arrowIconTitle}>Personal Protein Databases</b>
                  </p>

                </AccordionSummary>
                <AccordionDetails>
                  <Col md='6'>

                    <p>No Data</p>

                  </Col>
                </AccordionDetails>
              </Accordion>

            </Col>

          </Row>
          <Row>
            <Col md="6">
              <Accordion expanded={formCheck7} onChange={() => setformCheck7(prevState => !prevState)}>
                <AccordionSummary aria-controls="panel1c-content" id="panel1c-header">

                  <p>
                    {formCheck7 && <ArrowDropDownIcon className={classes.arrowIcon} />}
                    {!formCheck7 && <ArrowRightIcon className={classes.arrowIcon} />}
                    <b className={classes.arrowIconTitle}>Personal ​Nucleotide Databases</b>
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  <Col md='6'>

                    <p>No Data</p>

                  </Col>
                </AccordionDetails>
              </Accordion>

            </Col>


          </Row>

        </div>

        <ColoredLine color="black" />
         <div>
         <Row>
           <Col md="12">
           <p>Executing this search will incur the following charges:</p>
             <h4>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  TOTAL 2 Credits
             </h4>
           
           </Col>

         </Row>
         <Row>
         &nbsp;&nbsp; &nbsp;
           <input
                          type="checkbox"
                          name='check'
                          onChange={handleSingleCheck}
                        /> &nbsp;&nbsp; &nbsp;

                 <p>By checking this box, I acknowledge and agree to these terms</p><br></br>        
           
         </Row>
         <ColoredLine color="black" />
         <Row>
            &nbsp; &nbsp;
           <input
                          type="checkbox"
                          name='check'
                          onChange={handleSingleCheck}
                        /> &nbsp;&nbsp; &nbsp;

                 <p>Send email when the search is done</p>
           
         </Row>
         <Row>
         <Col md='4'>
         <input
                          type="checkbox"
                          name='check'
                          onChange={handleSingleCheck}
                        /> &nbsp;&nbsp; &nbsp;

                 <p>Save this form for later use as</p>   
         </Col>
         <Col md='8' className='border-left'>
           
         <TextArea
                   
                   id="saveforlater"
                   name="saveforlater"
                   placeholder='Name the form'
                   variant="outlined"
                   onChange={formik.handleChange}
                
                 /> 
         </Col>
           
         
           
         </Row>
         </div>
         <br></br>
         <Row >
             <Col>
             <Button color="primary" variant="contained" className="float-right  text-capitalize" type="submit">
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