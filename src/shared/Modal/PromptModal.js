import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important',
		paddingTop: '11px',
		paddingRight: '4px',
		marginTop: '-7px',
	},
	footerDiv: {
		padding: '0 30px',
		marginTop: '-20px',
		marginRight: '-31px',
	},
	modalBoxContent: {
		maxHeight: '675px',
	},
	modalClassContent: {
		position: 'absolute',
		width: '96%',
		height: '37%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer: {
		backgroundColor: '#EEEEEE',
		marginTop: '-38px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '65px',
		marginLeft: '10px',
		marginRight: '10px',
		paddingRight: '10px',
		borderRadius: '5px',

	},
	buttonStyle: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
		backgroundColor: '##DB862D !important',
		border: '1px solid ##DB862D !important',
		marginTop: '4px',

	},
	buttonStyleCancel: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
		color: 'white',
		backgroundColor: '#008EC5 !important',
		border: '1px solid #1F4E79 !important',
		// borderColor:'#1F4E79',

	},
}));

function PromptModal({ show, modalCallback, hideModal }) {
	const classes = useStyles();
	return (
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName={classes.modalClassContent}
			className={classes.modalBoxContent}
			show={show}
		>

			<Modal.Header className={classes.modalHeader}>
				<Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon className={"float-right"} onClick={hideModal} /></Link>
			</Modal.Header>
			<Modal.Body className={"text-center "}>
				<div className={classes.colorContainer}>
					<br></br>
					<h5>Please confirm that you want to log out.</h5>
					<br></br>  <br></br>
					<div className={classes.footerDiv}>
						<Button onClick={modalCallback} disableRipple={true} className='accountInfo' variant="contained">Log out</Button>
						<Button onClick={hideModal} disableRipple={true} className={classes.buttonStyleCancel} variant="contained">Cancel</Button>
					</div>
				</div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default PromptModal;