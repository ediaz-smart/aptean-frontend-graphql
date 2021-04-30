import React, { useState, useEffect } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import makeData from './makeData'
import CheckboxTable from '../Table/CheckboxTable'

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
    }
}));

function SearchedResults(props) {

    useEffect(() => {
        //dispatch(userActions.logout()); 
    }, []);
    const data = React.useMemo(() => makeData(10, 3), [])

    const columns = React.useMemo(
        () => [
          {
            Header: 'Name',
            columns: [
              {
                Header: 'First Name',
                accessor: 'firstName',
              },
              {
                Header: 'Last Name',
                accessor: 'lastName',
              },
            ],
          },
          {
            Header: 'Info',
            columns: [
              {
                Header: 'Age',
                accessor: 'age',
              },
              {
                Header: 'Visits',
                accessor: 'visits',
              },
              {
                Header: 'Status',
                accessor: 'status',
              },
              {
                Header: 'Profile Progress',
                accessor: 'progress',
              },
            ],
          },
        ],
        []
      )
 
    return (
        <Container className="mt-100">
            <h1>ARUN KUMAr</h1>
            <CheckboxTable columns={columns} data={data} />

         </Container>

    );
}

export default SearchedResults;