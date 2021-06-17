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
		backgroundColor: '#d98638',

	},
	buttonStyles:{
		float:'right',
		textTransform: 'none',
		margin:'4px',
	},
	ModalDesign:{
		// width:'60px'
		marginRight: '106px'
	},
	selectorValues:{
		marginRight: '300px'
	}

}));

function ShareResultsModal(props) {
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
		   <h5>Share these Results.</h5>
			</Modal.Header>
			{/* <h5>Share these Results.</h5> */}
			<Modal.Body className={"text-center "}>
				{/* <h5>{props.onMessage}</h5> */}
				<div className={classes.ModalDesign}>
				<p>Select one or more people to share these results with.</p>

				</div>
                 
				   <div className={classes.selectorValues}>
				 <p>Scarlett Anderson</p>
				   <p>Leyla Barnes</p>
				   <p>Jensen Gibbs</p>
				   <p>Luciana Shaffer</p>
				   <p>Scarlett Anderson</p>
				   <p>Leyla Barnes</p>
				   <p>Jensen Gibbs</p>
				   <p>Luciana Shaffer</p>
				 
				   </div>
				  <br></br>
				<br></br>
				<br></br>
				<div className={classes.footerDiv}>
					<Button onClick={props.onHide} className={classes.buttonStyles}  color="primary" variant="contained">Cancel</Button>
					
					{/* <Button onClick={props.tryAgain} className={classes.buttonStyle} color="primary" variant="contained">Share Results</Button>  */}
					<Button color="primary" variant="contained" className="float-right loginSubmit text-capitalize" onClick={props.tryAgain} >
					Share Results
                        </Button>
				</div>
				
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default ShareResultsModal;