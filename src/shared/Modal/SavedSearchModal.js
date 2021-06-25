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

function SavedSearchModal(props) {
	const classes = useStyles();
	const { t, i18n } = useTranslation('common');
    let mailUrl = "mailto:" + supportMail+"?subject="+props.subjectText;
    function sendRemoveData()
	{ 
		console.log(props.onMessage,"props.onMessage) props.onMessage)");
        props.removeShare(props.onMessage);

	}
    console.log(props,"props props props props props");
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
				<h5>Are you sure you want to delete the selected saved search forms?</h5>
                 <br></br>
                 <h5>This action cannot be undone.</h5>
                 <br></br>
				<div className={classes.footerDiv}>
					<Button onClick={props.onHide} className={classes.buttonStyle}  color="default" variant="contained">Cancel</Button>
					<Button onClick={props.tryAgain} className={classes.buttonStyle} color="primary" variant="contained">Delete</Button> 

				</div>
				
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default SavedSearchModal;