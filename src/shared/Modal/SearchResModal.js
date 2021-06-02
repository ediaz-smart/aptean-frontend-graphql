import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from '@material-ui/core/Button';
import { useTranslation } from "react-i18next";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CheckBox from '../Fields/CheckBox';


const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv:{
		padding:'0 30px'
	},
    checkBox:{
        transform: "scale(0.9)",
    }
}));

function SearchResModal(props) {
	const classes = useStyles();
    const [disableDelete, setDisableDelete] = useState(true);
    // const [acceptTermss, setAcceptTermss] = useState(true);
    const { t, i18n } = useTranslation('common');
    const updateCheckbox = () => {
		console.log('eee');
    };
	return (
		<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName='modalPromptContent'
		>
			{/* <Modal.Header className={classes.modalHeader}>
				{/* <Modal.Title id="contained-modal-title-vcenter">
                    
                </Modal.Title> 
                
			</Modal.Header> */}
			<Modal.Body className="appTextColor">
                <p className="mb-3"><b>{props.title}</b></p>
				<p className="mb-3">{props.content}</p>

                <div className="mb-5 h-100">
                    <CheckBox
                                
                                color="primary"
                                className={"float-left "+classes.checkBox}
                               name="acceptCondition"
                               id="acceptCondition"
                                checked={disableDelete}
                                onClick={()=>updateCheckbox()}
                                // onClick={()=>setDisableDelete(!disableDelete)}
                            />
                    <p className={"float-left mt-2"}>{props.accepttermstext}</p>
                
                </div>
				{/* <br></br>  <br></br> */}
				<div className={classes.footerDiv}>
                    <Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'deleteBtnColor')} variant="contained" type="submit">{t('deleteSelItems')}</Button>
					<Button onClick={props.onHide} className="float-right m-2"  color="primary" variant="contained">{t('cancel')}</Button>
				</div>
			</Modal.Body>
		</Modal>
	);
}

export default SearchResModal;