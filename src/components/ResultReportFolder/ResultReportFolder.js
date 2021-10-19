import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory, useParams } from 'react-router-dom';
import _ from "lodash";
import DataTable from "react-data-table-component";
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
import searchResSequence from '../../services/searchResSequence';
import Typography from '@material-ui/core/Typography';
import resultshareImg from '../../assets/image/resultshare.png';
import ShareResultsModal from '../../shared/Modal/ShareResultsModal';
import ShareResultsRemoveModal from '../../shared/Modal/ShareResultsRemoveModal';
import { useSelector } from 'react-redux';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SortIcon from "@material-ui/icons/ArrowDownward";
import RenameContainer from '../../shared/components/RenameContainer'
import SharedWith from '../Sharing/SharedWith.js';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    width: '96%',
    margin: '0 auto 28px',
    minHeight: '260px',
    // borderBottom: '1px solid #cec7c7',
    padding: '23px 16px 14px',
    border: '1px solid #cec7c7',
    borderRadius: '3px'
  },
  headerPipe: {
    margin: '0 10px'
  },
  listStyle: {
    listStyleType: 'none',
    padding: '0 10px'
  },
  failedTextColor: {
    color: '#e17a47 !important'
  },
  content: {
    fontSize: '14px !important',
    lineHeight: '25px',
    color: '#4a5050'
  },
  rowHeight: {
    height: '8%'
  },
  alertSelect: {
    width: '70%'
  },
  loginSubmitCancel: {
    backgroundColor: '#0182C5',
    borderColor: '#1F4E79',
    border: '1px solid #1F4E79',
    padding: '6px 16px',
    borderRadius: '4px !important',
    color: 'white',
    margin: '0 4px',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: '#0182C5',
      boxShadow: 'none',
    },
  },
  cancelButtonModal: {
    backgroundColor: '#0182C5',
    border: '1px solid #1F4E79',
    float: 'left',
    padding: '6px 16px',
    textTransform: 'none',
    margin: '4px',
    textTransform: 'none',
    marginTop: '4px',
    color: '#777777',
    boxShadow: 'none'
  },
  modalHeader: {
    borderBottom: 'none !important',
    paddingTop: '14px',
    paddingRight: '1px',
    marginTop: '-7px',
    display: "block !important"
  },
  footerDiv: {
    padding: '0 30px',
    marginTop: '-5px',
    marginRight: '-10px',
  },
  contentPadding: {
    padding: "45px !important"
  },
  modalBoxContent: {
    maxHeight: '675px',
  },
  modalClassContentDSI: {
    position: 'absolute',
    width: '96%',
    height: '42%',
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  },
  colorContainerDSI: {
    backgroundColor: '#EEEEEE',
    marginTop: '-32px',
    // marginLeft: 0px;
    paddingTop: '28px',
    // paddingBottom: '75px',
    paddingBottom: '75px',
    marginLeft: '10px',
    marginRight: '10px',
    paddingRight: '10px',
    borderRadius: '5px',

  },
  modalClassContent: {
    position: 'absolute',
    width: '96%',
    height: '42%',
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  },
  colorContainer: {
    backgroundColor: '#EEEEEE',
    marginTop: '-32px',
    // marginLeft: 0px;
    paddingTop: '28px',
    // paddingBottom: '75px',
    textAlign: 'left',
    paddingBottom: '53px',
    marginLeft: '10px',
    marginRight: '10px',
    paddingRight: '10px',
    borderRadius: '5px',

  },
  buttonStyle: {
    float: 'right',
    textTransform: 'none',
    margin: '4px',
    color: 'white',
    backgroundColor: '#DB862D !important',
    border: '2px solid #DB862D !important',

  },
  bodyPadding: {
    padding: "13px"
  },
  renameFolderLinkText: {
    fontSize: '14px',
    color: '#337AB7',
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    }
  },
  renameFolderText: {
    fontSize: '14px',
    color: '#7e7e7e'
  }
}));
const customStyles = {
  rows: {
    style: {
      minHeight: '50px', // override the row height
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      borderLeft: '1px solid #0606061f',
      '&:first-child': {
        borderLeft: '0',
      },
      fontWeight: '700',
      color: '#777777'
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
      borderLeft: '1px solid #0606061f',
      // borderBottom:'1px solid #0606061f',
      '&:first-child': {
        borderLeft: '0',
      },
      display: 'grid',
      textAlign: "center !important"
    },

  },
};
const columns = [
  {
    name: "",
    selector: "text_label",
    // sortable: true,
    // width:'20%'
  },
  {
    name: "",
    selector: "resultSets",
    // sortable: true,
    // width:'20%'
  },
  {
    name: "",
    selector: "thisFolderSize",
    // defaultSortAsc: true,
    left: true,
    // width:'75.3%',
    // style:{
    //   marginLeft: '40px'
    // }
  }
];

// const useStyles = makeStyles((theme) => ({
//     grow: {
//     flexGrow: 1,
//     width: '96%',
//     margin: '30px auto',
//     minHeight: '260px',
//     marginTop: '130px',
//   },
//   titleContent :{
//     float:'right',
//     marginTop: '-80px',
//     position: 'sticky'

//     // padding: '10px'
//   },
//   rootButton:{
//     marginLeft:'-14px',
//       '& > *': {
//         margin: theme.spacing(2),
//         textTransform:"capitalize",
//       },
//   },
//     root: {

//       '& > *': {
//         margin: theme.spacing(2),
//         textTransform:"capitalize",
//       },
//     },
//     textBox :{
//         width: '28%'
//     },
//     containerStyle : {
//         marginBottom : '30px',
//     },
//     headerTitle :{
//       marginBottom : '30px',
//     },
//     containerDiv :{
//       marginLeft: '25px'

//      }
//   }));

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
  const { t, i18n } = useTranslation('common');
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowSaved, setmodalShowSaved] = React.useState(false);
  const [folderData, setFolderData] = React.useState([]);

  const [userId, setuserId] = useState("");
  const { folderId } = useParams();
  const [seqShare, setSeqShare] = useState();
  const userInfo = useSelector(state => state.setUserInfo);
  const [modalResultShow, setModalResultShow] = React.useState(false);
  const [gqUserId, setGqUserId] = useState();

  const [resultSets, setResultSets] = useState();
  const [subFolders, setSubFolders] = useState();
  const [folderSize, setFolderSize] = useState();


  const classes = useStyles();

  const GreyText = {
    marginTop: "30px",
    marginLeft: '36px',
    color: "black",
    textAlign: "left"
  };
  function successMessage() {
    setmodalShowSaved(false);
    history.push('/home')
  }
  const handleScroll = (e, id) => {
    document.getElementById(id).scrollIntoView();
    // const item = ReactDOM.findDOMNode(id);
    // var element = document.querySelector("#"+id);
    // element.scrollIntoView();
    // element.scrollIntoView({ behavior: 'smooth', block: 'start'});
    e.preventDefault();
    // window.scrollTo(myElement);
  }

  const [updateTitle, setUpdateTitle] = useState(false);

  useEffect(
    async () => {
      const data = {};
      const result = await searchResSequence.getFolderResultData(data, folderId)
      if (result && result.response_content && result.response_content.numerics) {

        setGqUserId(result.response_content.numerics[0].gq_user_id);
        setFolderData(result.response_content.numerics);

        setResultSets(result.response_content.numerics[0].resultSets);
        setSubFolders(result.response_content.numerics[0].subFolders);
        setFolderSize(result.response_content.numerics[0].thisFolderSize);

        let test = resultSets;

      }
      //getUserResp();

      document.addEventListener("keydown", escFunction, false);
      let tempAlertArr = [];
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", escFunction, false);
      };
    }, []);
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      disableTitleText();
    }
  }, []);
  const handleClickOutside = event => {
    if (event.target.type !== "text") {
      disableTitleText();
    }
  };
  const disableTitleText = async () => {
    setUpdateTitle(false);
  };



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
    textAlign: "left",
    marginLeft: "70px"
  };
  const [modalResultRemoveShow, setModalResultRemoveShow] = React.useState(false);
  const [removeData, setRemoveData] = useState([]);
  const [userList, setUserList] = useState();

  function homePage() {
    history.push('/home');
  }
  function viewRemoveModal(data) {
    setModalResultRemoveShow(true);
    setRemoveData(data);
  }

  const [renameFolder, setRenameFolder] = useState(false);
  const folderNameRef = useRef('User Project Folder');


  const handleRenameClick = () => {
    setRenameFolder(!renameFolder)
  }

  const applyNewNameToFolder = (name) => {
    // Todo: Update the folder name on the server.
    folderNameRef.current = name
  }
  // const handleCancelButtonClick = () => {
  //   props.setRenameFolderName(false)
  // }
  return (
    <div className={classes.grow}>
      <Row className="p-3">
        <Col lg="12" md="12" sm="12" className="mb-5">
          <Typography className={classes.root + " float-right"}>
            <span className={"appTextColor appLink"} title={t('auditTrial')}>
              {t('auditTrial')}
            </span>
            <span className={classes.headerPipe + " appTextColor"}>|</span>
            <Link href="#resultSharing" title={t('resSharing')} className={"appLink appLink"} onClick={(e) => handleScroll(e, 'resultSharing')}>
              {t('resSharing')}
            </Link>
            <span className={classes.headerPipe + " appTextColor"}>|</span>
            {t('alertSetting')}
            <span className={classes.headerPipe + " appTextColor"}>|</span>
            {t('searchHistory')}
            <span className={classes.headerPipe + " appTextColor"}>|</span>
            {t('notes')}
          </Typography>
        </Col>
        <Col lg="12" md="12" sm="12">
          {/* <div className={classes.renameFolderContainer}>
              <input maxlength={200} className={classes.folderNameInput} />
              <Button variant="contained" disableRipple={true} onClick={handleRenameClick} className={classes.loginSubmitCancel}>{t('cancel')}</Button>
          </div>  */}
          {renameFolder ?
            <RenameContainer applyNewName={applyNewNameToFolder}
              nameRef={folderNameRef}
              placeHolderText={'Folder Name'}
              cancelButtonClass={classes.loginSubmitCancel} setRenameEnabled={setRenameFolder} />
            : <h6 className={"appTextColor loginTitle"} id="resultSharing">{folderNameRef.current}</h6>}

          <div>
            <p> This folder contains:</p>
            <ul>
              <li><p>A total of {resultSets} result sets within itself and all its subfolders</p></li>
              <li><p>A total of {subFolders} subfolders at various levels</p></li>
              <li><p>A total of {folderSize} MB data</p></li>
            </ul>
            {renameFolder ? <span className={classes.renameFolderText} >Rename this folder</span> :
              <span className={classes.renameFolderLinkText} onClick={handleRenameClick}>Rename this folder</span>}
          </div>


          {/* <Col lg="1" md="1" sm="12" className="pr-0">
                          <img src={resultshareImg} alt={t('resSharing')} />
                      </Col>
                      <Col lg="8" md="9" sm="12" className="p-0 content">

                      </Col> */}
          <hr />

          {gqUserId != undefined && folderId != undefined &&
            <SharedWith
              workflowId={folderId}
              gqUserId={gqUserId}
            />
          }
          <hr />


          <h6 className={"appTextColor loginTitle"} id="resultSharing">Folder SearchResultContent</h6>
          <div>
            <p>  Result sets and data volume are distributed within this folder as shown below. </p>
            <DataTable
              columns={columns}
              data={folderData}
              defaultSortField="date"
              defaultSortAsc={false}
              sortable={false}
              sortServer={true}
              noDataComponent='No items were found.'
              sortIcon={<SortIcon />}
              customStyles={customStyles}
              noHeader={true}
            />
          </div>





        </Col>
      </Row>


    </div >
  )
}

export default ResultReportFolder;
