import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import { supportMail } from '../../config';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv:{
		padding:'0 30px',
		

	},
	buttonStyle:{
		float:'right',
		textTransform: 'none',
		margin:'4px',

	}

}));

function ContentErrorModal(props) {
	const classes = useStyles();
	const { t, i18n } = useTranslation('common');
    let mailUrl = "mailto:" + supportMail+"?subject="+props.subjectText;

    console.log(props,"props");
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName='modalPromptContent'
		>
			<Modal.Header closeButton className={classes.modalHeader}>
				{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title> */}
			</Modal.Header>
			<Modal.Body className={"text-center "}>
				{/* <h5>{props.onMessage}</h5> */}
				<h5>The current password was incorrect.</h5>
                 <br></br>
				<h5>Please try again.</h5>
				
				<br></br>
				<br></br>
				<div className={classes.footerDiv}>
					<Button onClick={props.tryAgain} className={classes.buttonStyle} color="primary" variant="contained">Try Again</Button> 
					<Button onClick={props.onHide} className={classes.buttonStyle}  color="default" variant="contained">Cancel</Button>
				</div>
				
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default ContentErrorModal;