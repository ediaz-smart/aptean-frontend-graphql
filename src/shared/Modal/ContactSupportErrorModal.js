import React, { useState, useEffect, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';

//config
import { supportMail } from '../../config';

const useStyles = makeStyles((theme) => ({
    modalHeader: {
        borderBottom: 'none !important'
    },
    footerDiv: {
        padding: '0 30px'
    },
    contentPadding: {
        padding: "45px 0px 45px 0px"
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
            contentClassName='modalPromptContent'
        >
            <Modal.Body className={"text-center"}>
                <div className={classes.contentPadding}>
                    <p>{props.errorContent}</p>
                    <p>{t("errorCodeIs")}{props.errorCode}</p>
                    <p>
                        <spoan>{t("tryAgainOrContact")}</spoan>
                        <span>
                            <a className={"appTextFont appLink"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                        </span>
                        <span>{t("forAssistance")}</span>
                    </p>
                    <div className={classes.footerDiv}>
                        <Button onClick={() => redirect()} className="float-right m-2" color="default" variant="contained">{t("cancel")}</Button>
                        <Button onClick={()=>props.modalCallBack()} className="float-right m-2" color="primary" variant="contained">{t("tryAgain")}</Button>

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ContactSupportErrorModal;