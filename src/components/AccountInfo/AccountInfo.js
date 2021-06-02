import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from 'react-router-dom';
import AccountService from '../../services/accountInfo';
import TextInput from '../../shared/Fields/TextInput';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { useFormik } from 'formik';
import { RadioGroup, FormControlLabel, FormLabel, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import Validate from '../../helpers/validate';
import { toast } from 'react-toastify';
import AccountInfoModal from '../../shared/Modal/AccountInfoModal'
import SaveContentModal from '../../shared/Modal/SaveContentModal'

const useStyles = makeStyles((theme) => ({
    grow: {
    flexGrow: 1,
    width: '96%',
    margin: '30px auto',
    minHeight: '260px',
    marginTop: '130px',
  },
  rootButton:{
    marginLeft:'-14px',
      '& > *': {
        margin: theme.spacing(2),
        textTransform:"capitalize",
      },
  },
    root: {
      
      '& > *': {
        margin: theme.spacing(2),
        textTransform:"capitalize",
      },
    },
    textBox :{
        width: '28%'
    }
  }));
  
  const textStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
function AccountInfo() {
    const [accountInfoData, setAccountInfoData] = useState([]);
    const [accountInfoNames, setAccountInfoNames] = useState([]);
    const [errorMessage, seterrorMessage] = useState("");
    const history = useHistory();
    const {t, i18n} = useTranslation('common');
    const [prop1, setProp1] = useState("prop1");
    const [modalShow, setModalShow] = React.useState(false); 
    const [modalShowSaved, setmodalShowSaved] = React.useState(false); 
    const [userIdCon, setuserIdCon] = useState("");
    const [userId, setuserId] = useState("");
    const [userFirstName, setuserfirstName] = useState("");
    const [userLastName, setuserlastName] = useState("");
    const [userEmail, setuserEmail] = useState("");
    const [userAccountingGroup, setuserAccountingGroup] = useState("");
    const [userAccountType, setuserAccountType] = useState("");
    const [userAccountCreated, setuserAccountCreated] = useState("");
    const [userAccountExpires, setuserAccountExpires] = useState("");
    const [userAccountClitoken, setuserAccountClitoken] = useState("");
    const [userAnalyses, setuserAnalyses] = useState("");
    const [userSeqDatabase, setuserSeqDatabase] = useState("");
    const [userUploads, setuserUploads] = useState("");

    const classes = useStyles();
  
    const GreyText = {
      marginTop: "30px",
      marginLeft: '36px',
      color: "black",
      textAlign: "left"
    };
    function successMessage()
    {
      setmodalShowSaved(false);
      history.push('/home')
    }
    function setAccountInfo(data)
    {
      if(data)
      {
        data.id ? setuserIdCon(data.id) : setuserIdCon(''); 
        data.login_name ? setuserId(data.login_name) : setuserId('');
        data.email ? setuserEmail(data.email) : setuserEmail('');
        data.accounting_group_name ?  setuserAccountingGroup(data.accounting_group_name) : setuserAccountingGroup('');
        data.user_class_name ? setuserAccountType(data.user_class_name) : setuserAccountType('');
        data.access_key_create_time ? setuserAccountCreated(data.access_key_create_time) : setuserAccountCreated('');
        data.access_key_expire_time ?  setuserAccountExpires(data.access_key_expire_time) :  setuserAccountExpires('');
        data.clitoken ? setuserAccountClitoken(data.clitoken) : setuserAccountClitoken('');
        data.dspace_workflow ?  setuserAnalyses(data.dspace_workflow) :  setuserAnalyses(0);
        data.dspace_seqdb ? setuserSeqDatabase(data.dspace_seqdb) : setuserSeqDatabase(0);
        data.dspace_uploaded ? setuserUploads(data.dspace_uploaded) : setuserUploads(0);
        console.log(userFirstName,"userFirstName");
        console.log(userLastName,"userLastName");
        console.log(accountInfoData,"accountInfoData accountInfoData");
        data.first_name ? setuserfirstName(data.first_name) : accountInfoData && accountInfoData.first_name ? setuserfirstName(accountInfoData.first_name) :  setuserfirstName('');
        data.last_name ? setuserlastName(data.last_name) :  accountInfoData && accountInfoData.last_name ? setuserlastName(accountInfoData.last_name) :  setuserlastName('');
        console.log(userFirstName,"userFirstName");
        console.log(userLastName,"userLastName");
       

      }

    }
    useEffect(() => {
      async function fetchMyAPI() {
        const result = await AccountService.getAccountInfo(history);
        result && result.response_content ?  setAccountInfoData(result.response_content)   : setAccountInfoData([]);
        setAccountInfo(result.response_content)
        
      }
      fetchMyAPI()
    }, [])

    const formik = useFormik({
        initialValues: {
            firstName: accountInfoData.first_name ? String(accountInfoData.first_name) : '',
            lastName: accountInfoData.last_name ? String(accountInfoData.last_name) : '',
            confirmPassword: '',
           
        },
        enableReinitialize:true,
        validationSchema: Validate.InformationDataValidate(),
        onSubmit: async (values) => {
            const result = await AccountService.updateUser(parseInt(userIdCon),values.firstName,values.lastName,values.confirmPassword);
            if(result.response_content.message)
            {
              await seterrorMessage(result.response_content.message);
              setModalShow(true);
              // toast.error(result.response_content.message);
            }else{
              // toast.success("Successfully Updated");
              // history.push('/home')
              setmodalShowSaved(true);
            }
        },
    });
    const TableContainer = styled.div`
      table {
          margin-left: 70px;
          margin-top: 37px;
          width:80%;
        tr {
          border-bottom: 2px solid #dee2e6;
          :first-child {
            border-top: 2px solid #dee2e6;
          }
        }
        td {
          color: 'black';
          :first-child {
            border-right: 2px solid #dee2e6;
            width: 180px;
          }
          :last-child {
            padding-left: 20px;

          }
        }
      }
    `;
    const TextLeft = {
      textAlign:"left",
      marginLeft:"70px"
    };
    function homePage()
    {
      history.push('/home');
    }
   
      
    return(

        <div className={classes.grow}>
       <form name="accountInformationForm" onSubmit={formik.handleSubmit} >
        <div>
          <h5 style={GreyText}>{t('yourdetails')}</h5>
          <Container>
              <div style={TextLeft}>
              <br></br>
                        <TextInput 
                        className={classes.textBox}
                        id="firstName"
                                name="firstName"
                                label='First Name'
                                variant="outlined"
                                value={formik.values.firstName}
                                onChange={formik.handleChange} 
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                        />
           &nbsp;&nbsp;
                 <TextInput 
                         className={classes.textBox}
                           id="lastName"
                              //  initialValues={userLastName}
                                name="lastName"
                                label='Last Name'
                                variant="outlined"
                                value={formik.values.lastName}
                                onChange={formik.handleChange} 
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                              </div>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{t('aiuserid')}</TableCell>
                    <TableCell align="left">{userId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiemail')}</TableCell>
                    <TableCell align="left">{userEmail}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
        <div>
          <h5 style={GreyText}>{t('aiaccount')}</h5>
          <Container>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{t('aiaccgroup')}</TableCell>
                    <TableCell align="left">{userAccountingGroup}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiacctype')}</TableCell>
                    <TableCell align="left">{userAccountType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiaccreated')}</TableCell>
                    <TableCell align="left">{userAccountCreated}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiaccexp')}</TableCell>
                    <TableCell align="left">{userAccountExpires}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiclitoken')}</TableCell>
                    <TableCell align="left">{userAccountClitoken}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
        <div>
          <h5 style={GreyText}>{t('aistorage')}</h5>
          <Container>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{t('aianalyses')}</TableCell>
                    <TableCell align="left">{userAnalyses}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiseqdatabase')}</TableCell>
                    <TableCell align="left">{userSeqDatabase}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">{t('aiuploads')}</TableCell>
                    <TableCell align="left">{userUploads}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
        <div>
          <h5 style={GreyText}>{t('aiapplychange')}</h5>  
          <Container>
          <div style={TextLeft}>
          <br></br>
          <div >
              <TextInput 
                         className={classes.textBox}
                           id="confirmPassword"
                                name="confirmPassword"
                                label='Confirm Password'
                                variant="outlined"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange} 
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
              </div>
            
          <div className={classes.rootButton}>
              <Button variant="contained" onClick={homePage}>{t('cancel')}</Button>
                <Button variant="contained" type="submit">{t('aisavechange')}</Button>
          </div>
             
          </div>
          <AccountInfoModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            onMessage={errorMessage}
                        />
                         <SaveContentModal
                            show={modalShowSaved}
                            onHide={() => successMessage()}
                            onMessage={'Your changes have been saved.'}
                        />
                     
        </Container>
        </div>
        </form>
      </div>
     
    )
}

export default AccountInfo;
