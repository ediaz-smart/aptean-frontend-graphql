import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import { supportMail } from '../../config';

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
		marginTop: '-24px',
		marginRight: '6px',
	},
	buttonStyle: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
		color: 'white',
		backgroundColor: '#008EC5 !important',
		border: '1px solid #1F4E79 !important',
		borderColor: '#1F4E79',

	},
	buttonStyleCancel: {
		float: 'right',
		textTransform: 'none',
		margin: '4px',
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
		marginTop: '-33px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '65px',
		marginLeft: '10px',
		marginRight: '10px',
		paddingRight: '10px',
		borderRadius: '5px',

	},
	modalBody: {
		textAlign: 'center',
		marginBottom: '8px'
	}


}));

function ChangePassCheckModal(props) {
	const classes = useStyles();
	const { t, i18n } = useTranslation('common');
	let mailUrl = "mailto:" + supportMail + "?subject=" + props.subjectText;

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
				{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title> */}
			</Modal.Header>
			<Modal.Body className={classes.modalBody}>
				{/* <h5>{props.onMessage}</h5> */}
				<div className={classes.colorContainer}>
					<h5>The two new passwords are not identical.</h5>
					<br></br>
					<h5>Please try again.</h5>
					{/* <p>
                        <spoan>{t("tryAgainOrContact")}</spoan>
						<br></br>
						<br></br>
                        <span>
                            <a className={"appTextFont appLink"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                        </span>
                        <span>{t("forAssistance")}</span>
              </p> */}
					<br></br>
					<div className={classes.footerDiv}>
						<Button onClick={props.tryAgain} disableRipple={true} className='accountInfo' color="primary" variant="contained">Try Again</Button>
						<Button onClick={props.onHide} disableRipple={true} className={classes.buttonStyle} color="default" variant="contained">Cancel</Button>
					</div>
				</div>


			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default ChangePassCheckModal;