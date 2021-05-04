import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import ButtonGroup from 'react-bootstrap/ButtonGroup'

function ModalBox(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcente"
        centered
      >
        {/* <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title>
        </Modal.Header> */}
        
        <Modal.Body>
          <h4>Please confirm that you want to logout</h4>
          <br></br>  <br></br>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Cancel</Button>
          {/* <ButtonGroup aria-label="Third group"> */}
          <Button style={background-color: purple} onClick={props.onLog}>Logout</Button>   
           {/* </ButtonGroup> */}
          
        </Modal.Footer>
      </Modal>
    );
  }

export default ModalBox;