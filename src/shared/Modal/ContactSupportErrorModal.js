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
        // paddingTop: '16px',
        // paddingRight: '4px',
        // marginTop: '-7px',
        // display: "block !important"
        padding: '10px',
        position: 'absolute',
        zIndex: '2',
        right: '0'
    },
    footerDiv: {
        // padding: '0 30px',
        // marginTop: '-5px',
        // marginRight: '-10px',
        width: '96%',
        padding: '0 2%',
        display: 'flex',
        justifyContent: 'flex-end'
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
        // marginTop: '-32px',
        // marginLeft: 0px;
        // paddingTop: '28px',
        // paddingBottom: '79px',
        // marginLeft: '10px',
        // marginRight: '10px',
        // paddingRight: '10px',
        margin: '20px',
        padding: '30px 0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '5px',

    },
    // buttonStyle: {
    //     float: 'right',
    //     textTransform: 'none',
    //     margin: '4px',
    //     backgroundColor: '##DB862D !important',
    //     border: '2px solid ##DB862D !important',
    //     marginTop: '4px',

    // },
    buttonStyleCancel: {
        float: 'right',
        textTransform: 'none',
        margin: '4px',
        color: 'white',
        padding: '6px 8px',
        backgroundColor: '#008EC5 !important',
        border: '1px solid #1F4E79 !important',
        borderColor: '#1F4E79',

    },
    bodyPadding: {
        padding: "13px !important"
    },
    mainContent: {
        height: "120px",
        overflow: "scroll",
        // paddingBottom: '20px'
    },
    errorText: {
        textAlign: "left !important",
        marginLeft: '20px',
        marginRight: '20px'
        // width: "57%",
        // margin: "0 auto 20px"
    }
}));

function ContactSupportErrorModal(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');
    const history = useHistory();
    function redirect() {
        history.push("/home");
    }
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
            <Modal.Header className={classes.modalHeader}>
                <Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={props.modalCallBack} /></Link>
            </Modal.Header>
            <Modal.Body className={"text-center " + classes.bodyPadding}>
                <div className={classes.colorContainer}>
                    <br></br>
                    <div className={classes.mainContent}>
                        <p className={classes.errorText}>{props.errorContent}</p>
                        {!props.isWarning && props.errorCode !== "executeBiofacetCommand failed" && <p className={classes.errorText}>{t("errorCodeIs")}{props.errorCode}</p>}
                        {props.errorCode == "executeBiofacetCommand failed" && <p className={classes.errorText}>{t("probWithSearch")}</p>}
                        {/* <p> */}
                        {props.isWarning && props.errorCode !== "executeBiofacetCommand failed" && <p className={classes.errorText}>{props.errorCode}</p>}
                        <p className={classes.errorText}>
                            <span>{t("tryAgainOrContact")}</span>
                            <span>
                                <a className={"appTextFont appLink"} href={mailUrl} target="_blank" rel="noopener noreferrer">{supportMail}</a>
                            </span>
                            <span>{t("forAssistance")}</span>
                        </p>
                    </div>
                    <div className={classes.footerDiv}>
                        <div>
                            <Button onClick={() => props.modalCallBack()} disableRipple={true} className='accountInfo' variant="default">{t("tryAgain")}</Button>

                            {!props.type && <Button onClick={() => redirect()} disableRipple={true} className={classes.buttonStyleCancel} color="default" variant="contained">{t("cancel")}</Button>}
                            {props.type && props.type == "mergeResult" && <Button onClick={() => props.modalCallBack('cancel')} disableRipple={true} className={classes.buttonStyleCancel} color="default" variant="contained">{t("cancel")}</Button>}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ContactSupportErrorModal;