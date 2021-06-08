import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv:{
		padding:'0 30px'
	}
}));

function PromptModal({show,modalCallback,hideModal}) {
	const classes = useStyles();
	return (
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName='modalPromptContent'
			show={show}
		>
			<Modal.Header closeButton={true} className={classes.modalHeader}>
				{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title> */}
			</Modal.Header>
			<Modal.Body className={"text-center "}>
				<h5>Please confirm that you want to log out.</h5>
				<br></br>  <br></br>
				<div className={classes.footerDiv}>
					<Button onClick={modalCallback} className="float-right m-2 text-initial primaryBtn" color="primary" variant="contained">Log out</Button>
					<Button onClick={hideModal} className="float-right m-2 text-capitalize appTextColor disableBtnBorder"  color="default" variant="contained">Cancel</Button>
				</div>
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default PromptModal;