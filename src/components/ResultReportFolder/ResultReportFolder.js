import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory, useParams } from 'react-router-dom';
import DataTable from "react-data-table-component";
import searchResSequence from '../../services/searchResSequence';
import Typography from '@material-ui/core/Typography';
import SortIcon from "@material-ui/icons/ArrowDownward";
import RenameContainer from '../../shared/components/RenameContainer'
import FolderSharedWith from '../Sharing/FolderSharedWith.js';
import ftAccess from '../../services/ftAccess';
import { containerWidth } from '../../shared/constants';
import folderIcon from '../../assets/image/folder.png';
import Constant from '../../helpers/constant';
import FolderNameAlertModal from '../../shared/Modal/FolderNameAlertModal'

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
    width: '96%',
    margin: '4px auto 28px',
    minHeight: '260px',
    padding: '23px 16px 14px',
    border: '1px solid #cec7c7',
    borderRadius: '3px',
    maxWidth: containerWidth
  },
  headerPipe: {
    margin: '0 10px'
  },
  content: {
    fontSize: '14px !important',
    lineHeight: '25px',
    color: '#4a5050'
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
      width: '80%',
      minHeight: '50px', // override the row height
    }
  },
  head: {
    style: {
      display: 'none'
    }
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
      borderLeft: '1px solid #0606061f',
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
    width: '50%',
    style: {
      textAlign: "left !important"
    }
  },
  {
    name: "",
    selector: "resultSets",
  },
  {
    name: "",
    selector: "thisFolderSize",
    left: true,
    style: {
      textAlign: 'right !important',
      marginRight: '50px'
    }
  }
];

function ResultReportFolder() {
  const history = useHistory();
  const { t } = useTranslation('common');
  const [folderData, setFolderData] = React.useState([]);
  const GetFolderId = () => useParams().folderId
  const [folderId, setFolderId] = useState(GetFolderId());
  const [seqShare, setSeqShare] = useState();
  const [gqUserId, setGqUserId] = useState();

  const [resultSets, setResultSets] = useState();
  const [subFolders, setSubFolders] = useState();
  const [folderSize, setFolderSize] = useState();


  const classes = useStyles();

  const handleScroll = (e, id) => {
    document.getElementById(id).scrollIntoView();
    e.preventDefault();
  }

  const [updateTitle, setUpdateTitle] = useState(false);
  const [folderWritable, setFolderWritable] = useState(true);

  const getFolderHierarchy = (folderData) => {
    let generationCount = 1;
    let finalData = [...folderData]
    finalData[0].resultSets = finalData[0].resultSets + (finalData[0].resultSets > 1 ? ' Result sets' : ' Result set')
    finalData[0].thisFolderSize = Math.round(finalData[0].thisFolderSize) != finalData[0].thisFolderSize ? (finalData[0].thisFolderSize.toFixed(2) + ' MB') : (finalData[0].thisFolderSize + ' MB');

    const handleChild = (childrenData, isNextGeneration) => {
      for (let i = 0; i < childrenData.length; i++) {
        generationCount = isNextGeneration ? (generationCount + 1) : 1;
        let childFolder = childrenData[i];
        childFolder.resultSets = childFolder.resultSets + (childFolder.resultSets > 1 ? ' Result sets' : ' Result set')
        childFolder.thisFolderSize = Math.round(childFolder.thisFolderSize) != childFolder.thisFolderSize ? (childFolder.thisFolderSize.toFixed(2) + ' MB') : (childFolder.thisFolderSize + ' MB');
        childFolder.text_label = <a onClick={() => setFolderId(childFolder.id)}
          href={"#/report/folder/" + childFolder.id}
          style={{ marginLeft: (generationCount * 30) + 'px' }}><img style={{ marginRight: '5px', width: '20px' }} alt='img' src={folderIcon} />{childFolder.text_label}</a>
        finalData.push(childFolder)
        if (childFolder.children && childFolder.children.length) {
          handleChild(childFolder.children, true)
        } else {
          generationCount = generationCount - 1
        }
      }
    }
    if (folderData[0].children.length) {
      handleChild(folderData[0].children)
    }
    return finalData
  }

  useEffect(
    async () => {
      const data = {};
      const result = await searchResSequence.getFolderResultData(data, folderId)
      if (result && result.response_content && result.response_content.numerics) {
        const numerics = result.response_content.numerics;
        setGqUserId(numerics[0].gq_user_id);
        setFolderData(getFolderHierarchy(numerics));
        folderNameRef.current = numerics[0].text_label
        setResultSets(numerics[0].subCount)
        setSubFolders(numerics[0].subFolders)
        setFolderSize(numerics[0].totalSize)
        setFolderWritable(numerics[0]._is_writable)
      }

      document.addEventListener("keydown", escFunction, false);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", escFunction, false);
      };
    }, [folderId]);

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

  const folderNameRef = useRef('');
  const [renameFolder, setRenameFolder] = useState(false);
  const [addFolderModalShow, setAddFolderModalShow] = useState(false);

  const handleRenameClick = () => {
    setRenameFolder(!renameFolder)
  }
  const applyNewNameToFolder = async (name) => {
    let restrictedNames = Constant.folderRestrictNames
    let isRestrictedName = false;
    for (let i = 0; i < restrictedNames.length; i++) {
      if (restrictedNames[i].toLowerCase() === name.toLowerCase()) {
        isRestrictedName = true;
        break;
      }
    }
    if (isRestrictedName) {
      setAddFolderModalShow(true);
    } else if (name.length > 188) {
      setAddFolderModalShow(true);
    } else {
      // Todo: Update the folder name on the server.
      const response = await searchResSequence.renameFolder(folderId, name)
      if (response && response.response_status === 0) {
        folderNameRef.current = name;
        handleRenameClick()
      }
    }
  }
  const searchResult = () => {
    history.push('/searchResult')
  }

  const sharedWithMe = useRef('none');
  const getSharedWith = async (id) => {
    const results = await ftAccess.sharedWith(id)
    if (results && results.response_status == 0) {
      if (results.response_content && results.response_content !== 'none') {
        sharedWithMe.current = results.response_content;
        const sharedToNames = Object.keys(results.response_content).map((item) => {
          return results.response_content[item].full_name
        })
        let sharedToNamesString = '';
        if (Array.isArray(sharedToNames) && (sharedToNames.length > 3)) {
          sharedToNamesString = sharedToNames[0] + ' et al.'
        } else {
          for (let i = 0; i < sharedToNames.length; i++) {
            if (i === 0) {
              sharedToNamesString = sharedToNamesString + sharedToNames[i]
            } else if (i !== (sharedToNames.length - 1)) {
              sharedToNamesString = sharedToNamesString + ', ' + sharedToNames[i]
            } else {
              sharedToNamesString = sharedToNamesString + ' and ' + sharedToNames[i] + ' '
            }
          }
        }
        setSeqShare({ 'sharedNames': sharedToNamesString })
      } else {
        sharedWithMe.current = 'none';
        setSeqShare({ 'sharedNames': '' })
      }
    }
  }
  const closeFolderModal = () => {
    setAddFolderModalShow(false)
  }
  return (
    <div className={classes.grow}>
      <Row className="p-3">
        <Col lg="12" md="12" sm="12" className="mb-5">
          <Typography className={classes.root + " float-right"}>
            <span className={"appTextColor appLink"}><a onClick={searchResult}>{t('allSearchResults')}</a></span>
            <span className={classes.headerPipe + " appTextColor"}>|</span>
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
          {folderWritable && renameFolder ?
            <RenameContainer applyNewName={applyNewNameToFolder}
              nameRef={folderNameRef}
              placeHolderText={'Folder Name'}
              cancelButtonClass={classes.loginSubmitCancel} setRenameEnabled={setRenameFolder} />
            : <h6 className={"appTextColor loginTitle"} id="resultSharing">{folderNameRef.current}</h6>}

          <div>
            <p> This folder contains:</p>
            <ul>
              <li><p style={{ marginBottom: '4px' }}>A total of {resultSets} result sets within itself and all its subfolders</p></li>
              <li><p style={{ marginBottom: '4px' }}>A total of {subFolders} subfolders at various levels</p></li>
              <li><p style={{ marginBottom: '4px' }}>A total of {folderSize} MB data</p></li>
            </ul>
            {folderWritable ? renameFolder ? <span className={classes.renameFolderText} >Rename this folder</span> :
              <span className={classes.renameFolderLinkText} onClick={handleRenameClick}>Rename this folder</span> : null}
          </div>
          <hr />

          {gqUserId != undefined && folderId != undefined &&
            <FolderSharedWith
              content='Folder'
              workflowId={folderId}
              gqUserId={gqUserId}
              sharedWithMe={sharedWithMe.current}
              getSharedWithMe={getSharedWith}
            />
          }
          <hr />
          <h6 className={"appTextColor loginTitle"} id="resultSharing">Folder Search Result Content</h6>
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
      <FolderNameAlertModal showModal={addFolderModalShow} closeModal={closeFolderModal} />
    </div>
  )
}

export default ResultReportFolder;