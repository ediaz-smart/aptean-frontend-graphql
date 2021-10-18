import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	modalHeader: {
		borderBottom: 'none !important',
		paddingTop: '11px',
		paddingRight: '4px',
		marginTop: '-7px',

	},
	footerDiv: {
		padding: '0 30px',
		marginTop: '-5px',
		marginRight: '-10px',
	},
	contentPadding: {
		padding: "45px !important"
	},
	modalBoxContent: {
		maxHeight: '675px',
	},
	modalClassContent: {
		position: 'absolute',
		width: '96%',
		height: 'auto',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer: {
		backgroundColor: '#EEEEEE',
		marginTop: '-32px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '75px',
		marginLeft: '10px',
		marginRight: '10px',
		paddingRight: '10px',
		borderRadius: '5px',

	},
	buttonStyle: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
		color: 'white',
		backgroundColor: '##DB862D !important',
		border: '2px solid ##DB862D !important',

	},
	modalBody: {
		textAlign: 'center',
		marginBottom: '8px'
	}
}));

function SaveContentModal(props) {
	const classes = useStyles();
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName={classes.modalClassContent}
			className={classes.modalBoxContent}
		>
			<Modal.Header closeButton className={classes.modalHeader}>

			</Modal.Header>
			<Modal.Body className={classes.modalBody}>
				<div className={classes.colorContainer}>
					<br></br>
					<h5> Your changes have been saved..</h5>


					<br></br>
					<div className={classes.footerDiv}>
						<Button onClick={props.onHide} disableRipple={true} className='accountInfo' color="default" variant="contained">OK</Button>

						{/* <Button onClick={props.onHide} className={classes.buttonStyle} color="default" variant="contained">OK</Button> */}
					</div>

				</div>

			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default SaveContentModal;