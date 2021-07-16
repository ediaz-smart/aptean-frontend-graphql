import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';

//config
import { supportMail } from '../../config';

const useStyles = makeStyles((theme) => ({
    // modalHeader: {
    //     borderBottom: 'none !important'
    // },
    // footerDiv: {
    //     padding: '0 30px'
    // },
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
    contentPadding: {
        padding: "45px 0px 45px 0px"
    },
    modalBoxContent :{
		maxHeight: '675px',
	},
	modalClassContent:{
		position: 'absolute',
		width: '96%',
		height: '51%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer:{
		backgroundColor: 'gainsboro',
		marginTop: '-33px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '65px',
		marginLeft: '7px',
		marginRight: '7px',
		paddingRight: '10px',
		borderRadius: '5px',

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
}));

function ContactSupportErrorModal(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');
    const history = useHistory();
    console.log(props, "props");
    function redirect() {
        history.push("/home");
    }
    let mailUrl = "mailto:" + supportMail+"?subject="+props.subjectText;
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
            <Modal.Body className={"text-center"}>
                <div className={classes.colorContainer}>
                <br></br>
                    <p>{props.errorContent}</p>
                    <p>{t("errorCodeIs")}{props.errorCode}</p>
                    <br></br>
                    <p>
                        <spoan>{t("tryAgainOrContact")}</spoan>
                        <span>
                            <a className={"appTextFont appLink"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                        </span>
                        <span>{t("forAssistance")}</span>
                    </p>
                    <br></br>
                    <div className={classes.footerDiv}>
                    <Button onClick={()=>props.modalCallBack()} className='accountInfo'  variant="default">{t("tryAgain")}</Button>

                        <Button onClick={() => redirect()} className={classes.buttonStyleCancel} color="default" variant="contained">{t("cancel")}</Button>

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ContactSupportErrorModal;