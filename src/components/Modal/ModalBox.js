import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";


function ModalBox(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcente"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Please confirm that you want to logout</h4>
          <br></br>  <br></br>
          <Button onClick={props.onHide}>Cancel</Button>
          <Button onClick={props.onHide}>Logout</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default ModalBox;