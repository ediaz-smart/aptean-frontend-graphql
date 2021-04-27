import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GQLogo from '../../assets/image/GQLogo.png';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import ReactTable from 'react-table';
import Table from "../Table/Table";
import axios from "axios";
import "../Table/Table.css";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { makeStyles } from "@material-ui/core/styles";

const Genres = ({ values }) => {
    return (
      <>
        {values.map((genre, idx) => {
          return (
            <span key={idx} className="badge">
              {genre}
            </span>
          );
        })}
      </>
    );
  };
  const useStyles = makeStyles((theme) => ({
    savedForm: {
        backgroundColor: '#f5f2f2',
        height: '500px',
        paddingLeft : "70px",
        paddingTop: "34px"
    },
    anchorTag: {
        textDecoration: 'none',
        color: "#74a4d8"
    },
    p:{
        color: "#74a4d8",
        size: "20px"
      },
      textHeading: {
        fontWeight: "700 !important",
        color: "#8e8c8c",
        marginBottom: "5px"
      },
      columnPadding: {
          paddingLeft: "27px",
          paddingTop: "20px"
      },
      pTagMargin: {
          marginBottom: "0px",
          fontWeight: "500"
      },
      applicationPanelRow: {
          marginBottom: "15px"
      }
}));

function RecentResults() {
  
   const [data, setData] = useState([]);

   const classes = useStyles();
  useEffect(() => {
    (async () => {
      const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
      setData(result.data);
    })();
  }, []);
  
    const columns = useMemo(
        () => [
          {
            // first group - TV Show
            Header: " ",
            
            // First group columns
            columns: [
              {
                Header: "Type",
                accessor: "show.name"
              },
              {
                Header: "Date",
                accessor: "show.type"
              },
              {
                Header: "Description",
                accessor: "show.genres"
              },
              {
                Header: " ",
                accessor: "show.runtime"
              },
              {
                Header: " ",
                accessor: "show.status"
              }
            ]
          },
          // {
          //   // Second group - Details
          //   Header: "Details",
          //   // Second group columns
          //   columns: [
          //     {
          //       Header: "Language",
          //       accessor: "show.language"
          //     },
          //     {
          //       Header: "Genre(s)",
          //       accessor: "show.genres"
          //     },
          //     {
          //       Header: "Runtime",
          //       accessor: "show.runtime"
          //     },
          //     {
          //       Header: "Statuss",
          //       accessor: "show.status"
          //     }
          //   ]
          // }
        ],
        []
      );
    
    return (
        
        <Container fluid>
                   
                {/* <Row > */}
                    <Col sm={"auto"}>
                    <Row >
                    <p className={classes.textHeading}>Most Recent Results</p>
                    &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;
                    <p className={classes.pTagMargin}><a className={classes.anchorTag} href="javascript:void(0)">All Search Results</a></p>
                   
                    </Row>
                    <Row >
                    <Table columns={columns} data={data} />
                    </Row>
                
                     </Col>
               {/* </Row> */}
                    {/* <ProgressBar animated now={75} /> */}
            
        </Container>

    );
}

export default RecentResults;