import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv:{
		padding:'0 30px'
	}
}));

function SearchPrompt({searchModal}) {
	const classes = useStyles();
	return (
		<Modal
            show={searchModal}
            size="md"
            aria-labelledby="contained-modal-title-vcente"
            centered
            contentClassName='modalPromptContent'
            >
            <Modal.Body className="appTextColor text-center">
               <h5>Your search has been submitted</h5> 
            </Modal.Body>
        </Modal>
	);
}

export default SearchPrompt;