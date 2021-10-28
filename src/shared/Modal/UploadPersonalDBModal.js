import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik'
import { useTranslation } from "react-i18next";
import { supportMail } from '../../config';

import { makeStyles } from '@material-ui/core/styles';
import TextInput from '../../shared/Fields/TextInput';
import SelectBox from '../../shared/Fields/SelectBox';

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
        border: '1px solid ##DB862D !important',
        marginTop: '4px',

    },
    buttonStyleCancel: {
        float: 'right',
        textTransform: 'none',
        margin: '4px',
        color: 'white',
        backgroundColor: '#008EC5 !important',
        border: '1px solid #1F4E79 !important',
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
        marginTop: '-35px',
        // marginLeft: 0px;
        marginBottom: '10px',
        paddingTop: '10px',
        paddingLeft: '20px',
        paddingBottom: '65px',
        marginLeft: '10px',
        marginRight: '10px',
        paddingRight: '10px',
        borderRadius: '5px',

    },
    modalBody: {
        textAlign: 'left',
        paddingTop: '28px',
        paddingBottom: '10px',
        marginLeft: '10px',
        marginRight: '10px',
        paddingRight: '10px',
        marginBottom: '8px'
    }



}));

function UploadPersonalDBModal(props) {
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
                    <h5>Upload Personal Database</h5>
                    <br></br>

                    {/*
                            <Col md="12" className="p-0 content">
                                    <TextInput 
                                        rows="2"
                                        multiline={true}
                                        fullWidth
                                        id="st26input"
                                        name="st26input"
                                        variant="outlined"
                                        //value={searchSeqValue}
                                        //defaultValue={props.location.state[1]}
                                        //onChange={handleChangee}
                                        //error={formik.touched.st26input && Boolean(formik.errors.st26input)}
                                        //helperText={formik.errors.st26input}
                                        //disabled={authInfo && authInfo.redo}
                                    />
                              
                    
                            </Col>
                            */}
                    <br></br>
                    <div className={classes.footerDiv}>
                        <span>

                            <h7>We support the following formats: .txt, .gz , .bz2 </h7>
                            <br></br>
                            <h7>Compressing your data file will reduce the data time.</h7>
                        </span>
                        <span>
                            <Button onClick={props.tryAgain} disableRipple={true} className='accountInfo' color="default" variant="contained">Upload</Button>
                            <Button onClick={props.onHide} disableRipple={true} className={classes.buttonStyleCancel} color="default" variant="contained">Cancel</Button>
                        </span>
                    </div>

                </div>
            </Modal.Body>



            {/* <Modal.Footer>
				
			</Modal.Footer> */}
        </Modal>
    );
}

export default UploadPersonalDBModal;