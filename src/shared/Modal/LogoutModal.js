import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import { supportMail } from '../../config';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important',
		paddingTop:'11px',
		paddingRight: '4px',
		marginTop:'-7px',

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
		backgroundColor:'##DB862D !important',
        border: '2px solid ##DB862D !important',
		marginTop: '4px',

	},
	buttonStyleCancel:{
		float:'right',
		textTransform: 'none',
		margin:'4px',
		color:'white',
		backgroundColor:'#008EC5 !important',
        border: '2px solid #1F4E79 !important',
		borderColor:'#1F4E79',

	},
	modalBoxContent :{
		maxHeight: '675px',
	},
	modalClassContent:{
		position: 'absolute',
		width: '96%',
		height: '37%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer:{
		backgroundColor: 'gainsboro',
		marginTop: '-32px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '65px',
		marginLeft: '7px',
		marginRight: '7px',
		paddingRight: '10px',
		borderRadius: '5px',

	},
	


}));

function LogoutModal(props) {
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
			   
			
			</Modal.Header>
			<Modal.Body className={"text-center "}>
                {/* <h5>{props.onMessage}</h5> */}
                <div className={classes.colorContainer}>
              
                 <br></br>
                <h5>Please confirm that you want to log out..</h5>
              
                <br></br>
				<br></br>
                <div className={classes.footerDiv}>

                    <Button onClick={props.tryAgain} className='accountInfo' color="default"  variant="contained">Log out</Button> 
                    <Button onClick={props.onHide} className={classes.buttonStyleCancel}  color="default" variant="contained">Cancel</Button>
                </div>
                
                </div>
            </Modal.Body>

			
			
			{/* <Modal.Footer>
				
			</Modal.Footer> */}
		</Modal>
	);
}

export default LogoutModal;