import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
import movies from "./movies";
import "./styles.css";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useMemo ,useCallback} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button  from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import Header from '../../shared/header';
import Footer from '../../shared/footer';

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
      paddingTop: '20px',
      paddingLeft: '20px'
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
        paddingTop: '45px',
      }
}));

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
    selector: "title",
    sortable: true
  },
  {
    name: "Last Search Date",
    selector: "date",
    sortable: true
  },
  {
    name: "Name",
    selector: "director",
    sortable: true,
    left: true
  }
];

const isIndeterminate = indeterminate => indeterminate;
const selectableRowsComponentProps = { indeterminate: isIndeterminate };

function SearchResults() {
    const classes = useStyles();
    const [thing, setThing] = useState();
    const handleAction = value => setThing(value);
    // unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
    const updateState = useCallback(state =>  setThing(state));
    function updateVal(state)
    {    
        setThing(state)
    }
    function greetUser() {
        // console.log(updateState,"SAMple Data that enters")
        console.log(thing,"SAMple")
        const data = [];
        const dataValues = thing && data.push(thing.selectedRows[0]);
        console.log(data,"data data data");
        if(thing.selectedCount >= 1 && data && data.length > 0)
        {
            toast.success("Successfully Deleted");
            console.log("Hi there, user!");
        }
        else{
            toast.error("Select Any One Item");
            console.log("Hi");
        }
       
      }

  return (
    <Container className="mt-100">
    <Row className={classes.columnPad} >
      <Col>
        <DataTable
          columns={columns}
          data={movies}
          defaultSortField="title"
          sortIcon={<SortIcon />}
          onSelectedRowsChange={updateVal}
        //   pagination
          conditionalRowStyles={conditionalRowStyles}
          selectableRows
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={selectableRowsComponentProps}
        />
      </Col>
      
    </Row>
  
    <Row className="float-right">
    <Col  className={classes.columnPadding}>
    <Button variant="outline-primary"  type="submit">Cancel</Button>&nbsp;&nbsp;&nbsp;
    <Button color="primary" variant="contained" onClick={greetUser} className="float-right loginSubmit text-capitalize" type="submit">Delete Selected Saved Search Forms</Button>   

      </Col>
 
    
    </Row>
 </Container>
  
  );
}


export default SearchResults;