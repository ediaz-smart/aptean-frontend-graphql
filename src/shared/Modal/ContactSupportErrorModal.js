import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';

//config
import { supportMail } from '../../config';

const useStyles = makeStyles((theme) => ({
    modalHeader: {
		borderBottom: 'none !important',
		paddingTop:'16px',
		paddingRight: '4px',
		marginTop:'-7px',
		display: "block !important"
	},
	footerDiv:{
		padding:'0 30px',
		marginTop:'-5px',
		marginRight: '-10px',	
	},
	contentPadding: {
		padding: "45px !important"
	},
	modalBoxContent :{
		maxHeight: '675px',
	},
	modalClassContent:{
		position: 'absolute',
		width: '96%',
		height: '53%',
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer:{
		backgroundColor: '#EEEEEE',
		marginTop: '-32px',
		// marginLeft: 0px;
		paddingTop: '28px',
		paddingBottom: '79px',
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
    bodyPadding: {
        padding: "13px !important"
    },
    mainContent: {
        height: "150px",
        overflow: "scroll"
    },
    leftAlign: {
        textAlign: "left !important",
        width: "57%",
        margin: "0 auto 20px"
    }
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
        			<Modal.Header className={classes.modalHeader}>
                    <Link href="#" onClick={(e)=>e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={props.modalCallBack} /></Link>
                    </Modal.Header>
            <Modal.Body className={"text-center " + classes.bodyPadding}>
                <div className={classes.colorContainer}>
                <br></br>
                <div className={classes.mainContent}>
                    <p>{props.errorContent}</p>
                    {props.errorCode !==<p className={classes.leftAlign}>{t("errorCodeIs")}{props.errorCode}</p>}
                    {props.errorCode == "executeBiofacetCommand failed" && <p className={classes.leftAlign}>{t("probWithSearch")}</p>}
                    <p>
                        <spoan>{t("tryAgainOrContact")}</spoan>
                        <span>
                            <a className={"appTextFont appLink"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                        </span>
                        <span>{t("forAssistance")}</span>
                    </p>
                    </div>
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