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
  titleContent :{
    float:'right',
    marginTop: '-80px',
    position: 'sticky'

    // padding: '10px'
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
    },
    containerStyle : {
        marginBottom : '30px',
    },
    headerTitle :{
      marginBottom : '30px',
    },
    containerDiv :{
      marginLeft: '25px'

     }
  }));
  
  const textStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
function ResultReportFolder() {
    const [accountInfoData, setAccountInfoData] = useState([]);
    const [errorMessage, seterrorMessage] = useState("");
    const history = useHistory();
    const {t, i18n} = useTranslation('common');
    const [modalShow, setModalShow] = React.useState(false); 
    const [modalShowSaved, setmodalShowSaved] = React.useState(false); 
    const [userId, setuserId] = useState("");
   
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
   
    useEffect(() => {
      async function fetchMyAPI() {
     
        console.log("HAI");
      }
      fetchMyAPI()
    }, [])

   
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
           <div className={classes.titleContent}>
             <span>  Audit Trail | <Link to='/searchResult'>Result Sharing</Link>  | <Link to='/searchResult'>Alert Settings</Link> | <Link to='/searchResult'>Search History</Link>  | <Link to='/searchResult'>Notes</Link> </span>
           </div>
           <Container className={classes.containerStyle}>
           <h5 className={classes.headerTitle}> <strong>User ProjectFolder</strong></h5>
             <div className={classes.containerDiv}>
             <p> This folder contains:</p>
                <ul>
                  <li>A total of 15 result sets within itself and all its subfolders</li>
                  <li>A total of 5 subfolders at various levels</li>
                  <li>A total of 918 MB data</li>
               </ul>
               <Link to='/searchResult'>Rename this folder</Link>
             </div>
           </Container>
           <Container className={classes.containerStyle}>
           <h5 className={classes.headerTitle}> <strong>Folder Sharing</strong></h5>
             <div className={classes.containerDiv}> 
             <p>The following people have access to this folder.</p> <Link to='/searchResult'>Add more ...</Link>
                <ul>
                  <li>Steve Allen</li>
                  <li>Henk Heus</li>
                  <li>Vijaya Gorla</li>
               </ul>
             </div>
            
           </Container>
           <Container>
           <h5 className={classes.headerTitle}> <strong>Folder SearchResultContent</strong></h5>
           <div className={classes.containerDiv}> 
             <p>Result sets and data volume are distributed within this folder as shown below..</p> 
                </div>
                      
           </Container>
        
      </div>
     
    )
}

export default ResultReportFolder;
