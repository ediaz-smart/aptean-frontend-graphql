import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
import movies from "./movies";
import "./styles.css";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useMemo ,useCallback ,useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button  from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import Header from '../../shared/header';
import Footer from '../../shared/footer';
import SavedSearch from '../../services/savedsearch';
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
		borderLeft:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
		},
		fontWeight:'bold',
		color:'#4a5050'
	  },
	},
	cells: {
	  style: {
		paddingLeft: '8px', // override the cell padding for data cells
		paddingRight: '8px',
		borderLeft:'1px solid #0606061f',
		borderBottom:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
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
    selector: "map.workflow_type",
    sortable: true,
    width:'20%'
  },
  {
    name: "Name",
    selector: "name",
    sortable: true,
    left: true,
    width:'75.3%'
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
    const [searchFormsData, setSearchFormsData] = useState([]);
    const [selectedTemplateData, setSelectedTemplateData] = useState([]);
    // unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
    const updateState = useCallback(state =>  setThing(state));
    function updateVal(state)
    {    
        setThing(state)
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
    useEffect(() => {
      (async () => {
        const result = await SavedSearch.getSavedSearchData();
        if(result && result.response_content && result.response_content.templates)
        {
          console.log(result.response_content,"result.response_content.template) result.response_content.template)");
          const dta = await result.response_content.templates;
           setSearchFormsData(dta);
        }
      })()
    }, []);
    async function constrainTemplateData(savedData)
    {

      // savedData.forEach(datas => {
      //   if(datas)

      // })
    }
    async function deleteTemplate() {
        // console.log(updateState,"SAMple Data that enters")
        console.log(thing,"SAMple");
        const data = [];
        const dataValues = thing  && thing.selectedRows && data.push(thing.selectedRows[0]);
        console.log(data,"data data data");
        if(thing && thing.selectedCount >= 1 && data && data.length > 0)
        {
          // setSelectedTemplateData();
          const result = await SavedSearch.deleteSavedTemplate(data,thing.selectedCount);

            toast.error("Under Construction!");
            console.log("Hi there, user!",result);
        }
        else{
            toast.error("Select Any One Item");
            console.log("Hi");
        }
       
      }
     
//  console.log(searchFormsData,"searchFormsData");
  return (
    <div >
    <Row className={classes.columnPad} >
      <Col>
        <DataTable
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
    <Col  className={classes.columnPadding}>
    <Button variant="contained" onClick={homePage}>Cancel</Button>
     &nbsp;&nbsp;&nbsp;
    <Button color="primary" variant="contained" onClick={deleteTemplate} className="float-right loginSubmit text-capitalize" type="submit">Delete Selected Saved Search Forms</Button>   
      </Col>
    </Row>
 </div>
  
  );
}


export default SearchResults;