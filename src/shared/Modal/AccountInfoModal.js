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
		marginTop:'-20px',
		marginRight: '-31px',	
	},
	buttonStyle:{
		float:'right',
		textTransform: 'none',
		margin:'4px',
		// backgroundColor: '#147ca6'

	},
	modalBoxContent :{
		maxHeight: '675px',
	},
	modalClassContent:{
		position: 'absolute',
		width: '65%',
		height: '35%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	}


}));

function AccountInfoModal(props) {
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
			contentClassName={classes.modalClassContent}
			className={classes.modalBoxContent}

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
				{/* <p>
                        <spoan>{t("tryAgainOrContact")}</spoan>
						<br></br>
						<br></br>
                        <span>
                            <a className={"appTextFont appLinkColor"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                        </span>
                        <span>{t("forAssistance")}</span>
              </p> */}
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

export default AccountInfoModal;