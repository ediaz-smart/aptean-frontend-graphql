import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv:{
		padding:'0 30px',
		marginTop:'-40px',
		marginRight: '-31px',	
	},
	contentPadding: {
		padding: "45px !important"
	},
	modalBoxContent :{
		maxHeight: '650px',
	},
	modalClassContent:{
		position: 'absolute',
		width: '65%',
		height: '28%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	}
}));

function SaveContentModal(props) {
	const classes = useStyles();
    console.log(props,"props");
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName={classes.modalClassContent}
			className={classes.modalBoxContent}
		>
			{/* <Modal.Header closeButton className={classes.modalHeader}> */}
				{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title> */}
			{/* </Modal.Header> */}
			<Modal.Body className={"text-center"}>
				<h5 className={classes.contentPadding}>{props.onMessage}</h5>
				
		      {/* <Fragment> */}
			
				<div className={classes.footerDiv}>
					<Button onClick={props.onHide} className="float-right m-2" color="primary" variant="contained">OK</Button>
				</div>
				{/* </Fragment> */}
			
				
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default SaveContentModal;