import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';


import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	modalHeader: {
		borderBottom: 'none !important',
		paddingTop: '14px',
		paddingRight: '1px',
		marginTop: '-7px',
		display: "block !important"
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
		// position: 'absolute',
		width: '96%',
		// height: '31%',
		// top: '30%',
		// left: '50%',
		// right: 'auto',
		// bottom: 'auto',
		// transform: 'translate(-50%, -50%)'
	},
	closeButton: {
		position: 'absolute',
		top: '10px',
		right: '10px',
		'&:hover': {
			cursor: 'pointer'
		}
	},
	colorContainer: {
		backgroundColor: '#EEEEEE',
		// marginTop: '-32px',
		// marginLeft: 0px;
		// paddingTop: '28px',
		// paddingBottom: '75px',
		// paddingBottom: '34px',
		// marginLeft: '10px',
		// marginRight: '10px',
		// paddingRight: '10px',
		borderRadius: '5px',

	},
	buttonStyle: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
		color: 'white',
		backgroundColor: '##DB862D !important',
		border: '1px solid ##DB862D !important',

	},
	bodyPadding: {
		padding: "35px 15px 15px"
	}
}));

function SeqVIModal(props) {
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
			{/* <Modal.Header className={classes.modalHeader}> */}
			<Link href="#" onClick={(e) => e.preventDefault()} className={classes.closeButton + " appTextColor"}>
				<CloseIcon onClick={props.saveCallBack} />
			</Link>
			{/* </Modal.Header> */}
			<Modal.Body className={"text-center " + classes.bodyPadding}>
				<div className={classes.colorContainer}>
					<br></br>
					<h5> {props.onMessage}</h5>


					<br></br>
					{/* <div className={classes.footerDiv}> */}
					{/* <Button onClick={props.onHide} className='accountInfo' color="default"  variant="contained">OK</Button>  */}

					{/* <Button onClick={props.onHide} className={classes.buttonStyle} color="default" variant="contained">OK</Button> */}
					{/* </div> */}

				</div>

			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default SeqVIModal;