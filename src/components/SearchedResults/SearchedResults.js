import React, { useState, useEffect } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import makeData from './makeData'
import CheckboxTable from '../../shared/Table/CheckboxTable'

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
            Header: ' ',
            columns: [
              {
                Header: 'Type',
                accessor: 'firstName',
              },
              {
                Header: 'Latest Search Date',
                accessor: 'date',
              },
              {
                Header: 'Name',
                accessor: 'status',
              },
            ],
          },
          
        ],
        []
      )
 
    return (
        <Container className="mt-100">
            <Row >
              <Col>
          
              </Col>
            </Row>
            <Row >
              <Col>
              <CheckboxTable className="w-100" columns={columns} data={data} />
              </Col>
            </Row>
         </Container>

    );
}

export default SearchedResults;