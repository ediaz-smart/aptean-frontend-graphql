import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { supportMail } from "../../config";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	modalHeader: {
		borderBottom: "none !important",
	},
	footerDiv: {
		padding: "0 30px",
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
	scrollList: {
		height: '300px',
		overflowX: 'scroll'
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
	const shareUserData = ()=>{
		
		props.shareResult(selectData)
		setSelectData([]);
	}
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcente"
			centered
			contentClassName="modalPromptContent"
		>
			<Modal.Header
				closeButton
				className={classes.modalHeader + " appTextColor pt-4 pl-4 pb-0"}
			>
				{/* <Modal.Title id="contained-modal-title-vcenter">
           Logout
          </Modal.Title> */}
				<h5>
					<b>Share these Results</b>
				</h5>
			</Modal.Header>
			{/* <h5>Share these Results.</h5> */}
			<Modal.Body className="appTextColor">
				{/* <h5>{props.onMessage}</h5> */}
				<div className={classes.ModalDesign}>
					<p className="pl-2 pb-0">
						Select one or more people to share these results with.
          </p>
				</div>

				<div className={classes.selectorValues + " mx-4"}>
					<ul className={"list-inline " + classes.scrollList}>
						{
							props.data && Object.keys(props.data).map((dta, i) => {
								return <li class="my-2" key={i}>
									<span className={"cursorPointer " + (selectData.includes(props.data[dta].id) ? classes.projTitleActive : '')} onClick={() => getSelectVal(props.data[dta].id)}>{props.data[dta].full_name}</span>
								</li>
							})
						}
					</ul>
				</div>
				<div className={classes.footerDiv + " float-right"}>


					{/* <Button onClick={props.tryAgain} className={classes.buttonStyle} color="primary" variant="contained">Share Results</Button>  */}
					<Button
						color={selectData.length == 0 ? "default":"secondary"}
						variant="contained"
						className={"float-left text-capitalize mr-2 "+ (selectData.length == 0 ? 'disableBtnBorder' : 'loginSubmit')}
						onClick={shareUserData}
						disabled={selectData.length == 0 ? true:false}
					>Share Results</Button>
					<Button
						onClick={props.onHide}
						className={"float-left primaryBtn text-capitalize"}
						color="secondary"
						variant="contained"
					>Cancel</Button>
				</div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}

export default ShareResultsModal;
