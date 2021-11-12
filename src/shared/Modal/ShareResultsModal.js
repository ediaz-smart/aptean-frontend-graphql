import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { supportMail } from "../../config";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: 'none !important',
		paddingTop: '11px',
		paddingRight: '4px',
		marginTop: '-7px',
		display: "block !important"
	},
	footerDiv: {
		padding: "0 10px",
	},
	buttonStyle: {
		float: "right",
		textTransform: "none",
		margin: "4px",
		backgroundColor: "#d98638",
	},
	buttonStyles: {
		float: "right",
		textTransform: "none",
		margin: "4px",
	},
	ModalDesign: {
		// width:'60px'
		marginRight: "106px",
	},
	selectorValues: {
		marginRight: "300px",
	},
	projTitleActive: {
		backgroundColor: '#008EC5',
		color: '#fff',
		padding: '3px',
		borderRadius: '3px'
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
	scrollList: {
		height: '280px',
		overflowX: 'scroll'
	},
	modalBoxContent: {
		maxHeight: '675px',
		display: 'flex !important',
		justifyContent: 'center !important',
	},

	modalBody: {
		flex: 'unset',
		padding: '40px 10px 15px'
	},

	modalClassContent: {

		width: '96%',
		top: '44%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)'
	},
	colorContainer: {
		backgroundColor: '#EEEEEE',
		// marginTop: '-33px',
		// marginLeft: 0px;
		paddingTop: '15px',
		paddingBottom: '70px',
		marginLeft: '5px',
		marginRight: '4px',
		paddingRight: '10px',
		borderRadius: '5px',
		paddingLeft: '10px'
	},
	closeButton: {
		position: 'absolute',
		right: '10px',
		top: '10px'
	}
}));

function ShareResultsModal(props) {
	const classes = useStyles();
	const { t, i18n } = useTranslation("common");
	const [selectData, setSelectData] = useState([]);

	const getSelectVal = (id) => {
		let getStateVal = selectData;
		if (selectData.includes(id)) {
			getStateVal = getStateVal.filter(e => e !== id);
			// props.getSelectUser(getStateVal);
			setSelectData(getStateVal);
		} else {
			selectData.push(id);
			setSelectData([...selectData]);
			// props.getSelectUser(selectData);
		}

	}
	const shareUserData = () => {
		props.shareResult(selectData)
		setSelectData([]);
	}

	const closeModal = () => {
		props.onHide();
		setSelectData([]);
	}
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName={classes.modalClassContent}
			className={classes.modalBoxContent}
		>
			{/* <Modal.Header
				// closeButton
				className={classes.modalHeader}
			>
				{/* <Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={closeModal} /></Link> */}

			{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title>


		</Modal.Header> * /}
			{/* <h5>Share these Results.</h5> */ }
			<Link href="#" onClick={(e) => e.preventDefault()} className={classes.closeButton + "  appTextColor"}><CloseIcon onClick={closeModal} /></Link>
			<div className={classes.modalBody + " appTextColor"}>
				{/* <h5>{props.onMessage}</h5> */}

				<div className={classes.colorContainer}>
					<h5>
						&nbsp;<b>{'Share ' + (props.sharedItem ? props.sharedItem : 'these results')}</b>
					</h5>
					<div className={classes.ModalDesign}>
						<p className="pl-2 pb-0">
							{'Select one or more people to share ' + (props.sharedItem ? props.sharedItem : 'these results') + ' with.'}
						</p>
					</div>

					<div className={classes.selectorValues + " mx-4"}>
						<ul className={"list-inline " + classes.scrollList}>
							{
								props.data && Object.keys(props.data).map((dta, i) => {
									return <li key={i}>
										<span className={"cursorPointer " + (selectData.includes(props.data[dta].user_id) ? classes.projTitleActive : '')} onClick={() => getSelectVal(props.data[dta].user_id)}>{props.data[dta].full_name}</span>
									</li>
								})
							}
						</ul>
					</div>
					<div className={classes.footerDiv + " float-right"}>
						{/* <Button onClick={props.tryAgain} className={classes.buttonStyle} color="primary" variant="contained">Share Results</Button>  */}

						<Button
							color={selectData.length == 0 ? "default" : "secondary"}
							variant="contained"
							className={"text-capitalize mr-2 " + (selectData.length == 0 ? 'cancelButtonDisable' : 'accountInfo')}
							onClick={shareUserData}
							disableRipple={true}
							disabled={selectData.length == 0 ? true : false}
						>{'Share ' + (props.sharedItem ? props.sharedItem : 'Results')}</Button>
						<Button
							onClick={closeModal}
							className={classes.buttonStyleCancel}
							color="secondary"
							disableRipple={true}
							variant="contained"
						>Cancel</Button>

					</div>
				</div>
			</div>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal >
	);
}

export default ShareResultsModal;
