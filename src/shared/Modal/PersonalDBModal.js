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
        marginTop: '-20px',
        marginRight: '-31px',
    },
    buttonStyle: {
        float: 'right',
        textTransform: 'none',
        margin: '4px',
        backgroundColor: '##DB862D !important',
        border: '2px solid ##DB862D !important',
        marginTop: '4px',

    },
    buttonStyleCancel: {
        float: 'right',
        textTransform: 'none',
        margin: '4px',
        color: 'white',
        backgroundColor: '#008EC5 !important',
        border: '2px solid #1F4E79 !important',
        borderColor: '#1F4E79',


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
        marginTop: '-38px',
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

function PersonalDBModal(props) {
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


            </Modal.Header>
            <Modal.Body className={classes.modalBody}>
                {/* <h5>{props.onMessage}</h5> */}
                <div className={classes.colorContainer}>
                    <h5>Are you sure you want to delete the selected personal database?</h5>
                    <br></br>
                    <h5>It will not be possible to redo any searches </h5>
                    <h5>which were run using this database.</h5>
                    <br></br>
                    <h5>This action cannot be undone.</h5>
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

                        <Button onClick={props.tryAgain} disableRipple={true} className='accountInfo' color="default" variant="contained">Delete</Button>
                        <Button onClick={props.onHide} disableRipple={true} className={classes.buttonStyleCancel} color="default" variant="contained">Cancel</Button>
                    </div>

                </div>
            </Modal.Body>



            {/* <Modal.Footer>
				
			</Modal.Footer> */}
        </Modal>
    );
}

export default PersonalDBModal;