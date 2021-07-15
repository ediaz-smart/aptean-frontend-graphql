import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
import movies from "./movies";
import "./styles.css";
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import React, { useState, useMemo ,useCallback ,useEffect ,Fragment} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button  from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import Header from '../../shared/header';
import Footer from '../../shared/footer';
import SavedSearch from '../../services/savedsearch';
import SavedSearchModal from '../../shared/Modal/SavedSearchModal';
import AccountInfoModal from '../../shared/Modal/AccountInfoModal'
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
    loginDiv:{
        border: '2px solid #bfb4b4',
        borderRadius: '6px',
        padding: '20px',
        height: '100%'
    },
    forgotLink:{
        marginTop: '10px',
        a:{
            color:'#008EC5'
        }
    },
    textHeading: {
      fontWeight: "700 !important",
      color: "#5A6868",
      fontSize:'larger'
      // marginBottom: "400px",
      
    },
    buttonStyle:{
      float:'right',
      textTransform: 'none',
      margin:'4px',
      backgroundColor:'##DB862D !important',
     border: '2px solid ##DB862D !important',
      marginTop: '4px',
      boxShadow: 'none',
        '&:hover' : {
          boxShadow: 'none',
        }
  
    },
    footerDiv:{
      padding:'0 30px',
      marginTop:'-20px',
      marginRight: '65px',	
    },
    buttonStyleCancel:{
      float:'right',
      textTransform: 'none',
      margin:'4px',
      color:'white',
      backgroundColor:'#008EC5 !important',
        border: '2px solid #1F4E79 !important',
        boxShadow: 'none',
        '&:hover' : {
          boxShadow: 'none',
        }
  
    },
    columnPadding: {
      // paddingTop: '20px',
      // paddingLeft: '20px'
      marginTop: '-30px',
      marginRight: '82px',
    },
    columnPaddings: {
      paddingTop: '5px',
      paddingLeft: '877px'
    },
    line: {
      borderBottom: '1px solid #E7E4E4',
      paddingBottom:'20px',
      },
      columnPad : {
        padding: '80px',
        marginTop: '-30px',
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
		// borderLeft:'1px solid #0606061f',
    borderRight:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
      borderRight: '0'
		},
    '&:last-child':{
      borderRight:'0',
      paddingLeft: '20px',
    },
		fontWeight:'bold',
		color:'#4a5050'
	  },
	},
	cells: {
	  style: {
		paddingLeft: '8px', // override the cell padding for data cells
		paddingRight: '8px',
		// borderLeft:'1px solid #0606061f',
    borderRight:'1px solid #0606061f',
		borderBottom:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
      borderRight: '0'
		},
    '&:last-child':{
      borderRight:'0',
      paddingLeft: '20px',
    },
    '&:second-child': {
			borderLeft: '0',
    },

		display:'grid'
	  },
	  
	},
  };
const conditionalRowStyles = [
    {
      when: row => row.director < 300,
      style: {
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    // You can also pass a callback to style for additional customization
    {
      when: row => row.director < 300,
      style: row => ({
        backgroundColor: row.isSpecia ? 'pink' : 'inerit',
      }),
    },
  ];

const columns = [
  {
    name: "Type",
    selector: "typeContent",
    // sortable: true,
    width:'20%'
  },
  {
    name: "Name",
    selector: "nameContent",
    defaultSortAsc: true,
    left: true,
    width:'75.3%',
    // style:{
    //   marginLeft: '40px'
    // }
  }
];


const isIndeterminate = indeterminate => indeterminate;
const selectableRowsComponentProps = { indeterminate: isIndeterminate };
function homePage()
{
  
}
function SearchResults() {
    const classes = useStyles();
    const [thing, setThing] = useState([]);
    const handleAction = value => setThing(value);
    const [modalShow, setModalShow] = React.useState(false); 
    const [errorMessage, setErrorMessage] = useState('');
    const [checkValue, setCheckValue] =  React.useState(false); 

    const history = useHistory();

    const [searchFormsData, setSearchFormsData] = useState([]);
    const [selectedTemplateData, setSelectedTemplateData] = useState([]);
    // unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
    const updateState = useCallback(state =>  setThing(state));
    function updateVal(state)
    {    
        setThing(state);
        if(state.selectedCount >= 1)
        {
          setCheckValue(true);
          console.log(state,"updateVal updateVal updateVal");
        }
        setCheckValue(false);
       
    }
    // useEffect(() => {
    //   async function fetchMyAPI() {
    //     const result = await SavedSearch.getSavedSearchData();
    //     if(result.response_content && result.response_content.templates)
    //     {
    //       console.log(result.response_content,"result.response_content.template) result.response_content.template)");
    //       const dta = await result.response_content.templates;
    //       //  setSearchFormsData(dta);
    //     }
    //     // (result.response_content && result.response_content.template) ? setSearchFormsData(result.response_content.template) : "" ;
    //     // console.log(result,"result result result result result result result ");
    //   }
    //   fetchMyAPI();
    //   // setThing([]) getSavedSearchData
    //   // document.title = `You clicked ${count} times`;
    // });

    function chechBoxFunction()
    {
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
    }
    useEffect(() => {
      (async () => {
        // const result = await SavedSearch.getSavedSearchData();
        // if(result && result.response_content && result.response_content.templates)
        // {
        //   // console.log(result.response_content,"result.response_content.template) result.response_content.template)");
        //   const dta = await result.response_content.templates;
        //   constrainTemplateData(dta);
        //    setSearchFormsData(dta);
          
        // }
        getSavedTemplateData();
      })()
    }, []);

    async function getSavedTemplateData()
    {
      const result = await SavedSearch.getSavedSearchData();
        if(result && result.response_content && result.response_content.templates)
        {
          console.log(result.response_content,"result.response_content.template) result.response_content.template)");
          const dta = await result.response_content.templates;
          constrainTemplateData(dta);
           setSearchFormsData(dta);
          
        }
    }
    async function constrainTemplateData(savedData)
    {

      savedData.map(datas => {
        if(datas.type == 'GqWfVMIpSearch_launch')
        {
            datas.typeContent = 'Variation';
        }
        else if(datas.type == 'GqWfIpSearch_launch')
        {
           datas.typeContent = 'IP Sequence';
        }
        datas.nameContent =  <Fragment>
        <a href="#" onClick={(e) => routeToTemplateForm(e, datas)} target="_blank">{datas.name}</a>
      </Fragment>
        // console.log(datas,"constrainTemplateData")

      });
    }
    async function routeToTemplateForm(e,tempObj)
    {
         e.preventDefault();
         console.log(tempObj,"tempObj tempObj tempObj");

    }
    async function deleteTemplate() {
        // console.log(updateState,"SAMple Data that enters")
        // console.log(thing,"SAMple");
        const data = [];
        const dataValues = thing  && thing.selectedRows && data.push(thing.selectedRows[0]);
        // console.log(data,"data data data");
        if(thing && thing.selectedCount >= 1 && data && data.length > 0)
        {
          // setSelectedTemplateData();
          setModalShow(true);
          // const result = await SavedSearch.deleteSavedTemplate(thing.selectedRows,thing.selectedCount);
         
            // toast.error("Under Construction!");
            // console.log("Hi there, user!",result);
        }
        else{
            toast.error("Select Any One Item");
            console.log("Hi");
        }
       
      }
     function cancelForm()
     {
      history.push('/home');

     }
     async function deleteForm()
     {
       console.log("deleteForm");
       const data = [];
       const dataValues = thing  && thing.selectedRows && data.push(thing.selectedRows[0]);
       console.log(data,"data data data");
       if(thing && thing.selectedCount >= 1 && data && data.length > 0)
       {
         const result = await SavedSearch.deleteSavedTemplate(thing.selectedRows,thing.selectedCount);
         getSavedTemplateData();
         setModalShow(false);
       }
       else{
           toast.error("Select Any One Item");
           console.log("Hi");
       }
      // setModalShow(true);
     }
//  console.log(searchFormsData,"searchFormsData");

  return (
    <div >
    <Row className={classes.columnPad} >
      <Col>
        <DataTable
          className='search-table'
          columns={columns}
          data={searchFormsData}
          defaultSortField="title"
          sortIcon={<SortIcon />}
          onSelectedRowsChange={updateVal}
          customStyles={customStyles}
				   noHeader={true}
        //   pagination
          // conditionalRowStyles={conditionalRowStyles}
          selectableRows
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={selectableRowsComponentProps}
        />
      </Col>
    </Row>
    <Row className="float-right">
    {/* <Col  className={classes.columnPadding}>
    <Button variant="contained" className={classes.buttonStyleCancel} onClick={homePage}>Cancel</Button>
     &nbsp;&nbsp;&nbsp;
    <Button color="primary" className='accountinfo' variant="contained" onClick={()=>deleteTemplate()} className="float-right loginSubmit text-capitalize" type="submit">Delete Selected Saved Search Forms</Button>   
  
      </Col> */}
      <div className={classes.footerDiv}>
                  {thing.selectedCount >= 1 ? 
                    <Button  className='accountInfo' color="default" disableRipple={true} onClick={()=>deleteTemplate()}  variant="contained">Delete Selected Saved Search Forms</Button> 
                    :   <Button  className='cancelButtonDisable' color="default" disableRipple={true}  variant="contained">Delete Selected Saved Search Forms</Button> 

                  }
                    <Button className={classes.buttonStyleCancel} onClick={()=>homePage} disableRipple={true}  color="default" variant="contained">Cancel</Button>
                    <SavedSearchModal
                            show={modalShow}
                            onHide={() => cancelForm()}
                            tryAgain={()=> deleteForm()}
                            // onMessage={errorMessage}
                        />
        </div>
    </Row>
              
 </div>
  
  );
}


export default SearchResults;