import React, { useState, useEffect, useRef, Fragment } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ReactHtmlParser from "react-html-parser";

import Popover from "@material-ui/core/Popover";
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@material-ui/icons/Close';

import Constant from "../../helpers/constant";
import lucenequeryparser from "../../assets/lib/lucene-query-parser";
import fullTextService from "../../services/fulltextsearch";
import FullTextResults from "./FullTextResults";
import TextInput from "../../shared/Fields/TextInput";
import CheckBox from '../../shared/Fields/CheckBox';
import CaretPositioning from './EditCaretPositioning'
import AuthoritiesData from '../../helpers/authorities';
import SelectBox from "../../shared/Fields/SelectBox";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		width: "96%",
		margin: "0 auto 28px",
		minHeight: "500px",
		borderBottom: "1px solid #cec7c7",
		padding: "23px 0 5px",
	},
	popverDiv: {
		// height:'500px',
		// overflowX:'scroll'
	},
	searchTermPopup: {
		width: "40%",
	},
	searchMenuList: {
		padding: "20px !important",
	},
	modalHeader: {
		borderBottom: 'none !important',
		padding: '4px 4px 3px 0px',
		display: "block !important"
	},
	footerDiv: {
		padding: '0 30px',
		marginTop: '-5px',
		marginRight: '-10px',
	},
	modalBody: {
		margin: "0 20px 20px 20px",
		backgroundColor: "#EEEEEE",
		padding: "38px"
	},
	titleFont: {
		fontSize: "20px !important"
	}
}));
let ANDString = '<span class="andClass opClass">AND</span>';
let ORString = '<span class="orClass opClass">OR</span> ';
let NOTString = '<span class="notClass opClass">NOT</span> ';
let SpaceString = '<span class="space"> </span>';
let pubString = '<span class="pubClass">pub</span>';
let publicationString = '<span class="publicationClass">publication_Date:<input type="date" onclick="updateDate"></span>';
let classArray = ["andClass", "orClass", "notClass", "autoquery"];
let removeClassArray = ["andClass", "orClass", "notClass"];

function FullTextSearch() {
	const { t, i18n } = useTranslation("common");
	const classes = useStyles();
	const history = useHistory();
	const [fulltext, setFullText] = useState();
	const [testOutput, setTestOutput] = useState();
	const [queryParser, setQueryParser] = useState({});
	const [pasteContent, setPasteContent] = React.useState(null);
	const [caretPosition, setCaretPosition] = React.useState();

	// For Popup
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setopen] = React.useState(false);
	const [topPosition, setTopPosition] = useState(220);
	const [leftPosition, setLeftPosition] = useState(65);
	const [keyCode, setKeyCode] = React.useState(null);
	const [keyPressCode, setKeyPressCode] = React.useState(null);
	const [keyCodeEvent, setKeyCodeEvent] = React.useState(null);
	const [detectPaste, setDetectPaste] = React.useState(true);
	const [rightArrowEvent, setRightArrowEvent] = React.useState(false);

	// For Auto Complete Search
	const [searchTermPopup, setSearchTermPopup] = React.useState(false);
	const [ontology, setOntology] = React.useState(";MSH;USER");
	const [searchTermData, setSearchTermData] = React.useState(null);

	// For Search
	const [grouping, setGrouping] = React.useState("Document");
	const [useDateSort, setUseDateSort] = React.useState(true);
	const [dateSorting, setDateSorting] = React.useState("desc");
	const [dateSortField, setDateSortField] = React.useState("pub_date");
	const [searchStartPage, setSearchStartPage] = React.useState(0);
	const [searchStopPage, setSearchStopPage] = React.useState(50);
	const [isAuthoritySorting, setIsAuthoritySorting] = React.useState(true);
	const [authorities, setAuthorities] = React.useState({});
	const [configure1, setConfigure1] = useState('US');
	const [configure2, setConfigure2] = useState('EP');
	const [configure3, setConfigure3] = useState('WO');
	const [configure4, setConfigure4] = useState('');
	const [configure5, setConfigure5] = useState('');
	const [isDateSorting, setIsDateSorting] = useState(true);
	const [dateSortingField, setDateSortingField] = useState('filing_date');
	const [dateSortingDirection, setDateSortingDirection] = useState('desc');


	//set result
	const [docSearchResult, setDocSearchResult] = useState({});
	const [saveFormError, setSaveFormError] = useState(false);

	const userInfo = useSelector((state) => state.setUserInfo);

	// To detect outside click for Autocomplete popup
	const wrapperRef = useRef(null);

	const [singleSelections, setSingleSelections] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [saveFormValue, setSaveFormValue] = useState(false);
	const [formName, setFormName] = useState("");
	const [saveResultAs, setSaveResultAs] = useState("");
	const [saveResultAsError, setSaveResultAsError] = useState(false);
	const [isConfigureActive, setIsConfigureActive] = useState(false);

	const pageCount = useSelector((state) => state.setCommon["Paging size"]);

	const openPopup = () => {
		// setAnchorEl(event.currentTarget);
		setopen(true);
	};

	const closePopup = () => {
		setAnchorEl(null);
		setopen(false);
		setSearchTermPopup(false);
		let htmlElement = document.getElementById("textareaDiv");
		placeCaretAtEnd(htmlElement);
	};
	// const open = Boolean(anchorEl);
	// const id = open ? 'simple-popover' : undefined;

	// reset login status
	useEffect(async () => {
		//dispatch(userActions.logout());
		let authorityData = AuthoritiesData();
		if (authorityData) {
			setAuthorities(authorityData);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, []);

	const handleClickOutside = (event) => {
		if (event.target.id != "megamenu") {
			// Delay some seconds to get popup value before close
			setTimeout(() => {
				// we already define dataclass attr to megamenu list, if outside of any event will close the popup
				if (event.target.attributes.dataclass == undefined) {
					setSearchTermPopup(false);
				}
			}, 100);
		}
	};
	const getKeyCode = (e) => {
		// if (e.type == "keypress") {
		// 	// For Auto Suggest detect right arrow function
		// 	setKeyPressCode(e.keyCode);
		// } else {
		// 	setKeyCode(e.keyCode);
		// }
		setKeyCode(e.keyCode);
		// setKeyCodeEvent(e);
		let getCurrentSel = window.getSelection();
		setKeyCodeEvent(getCurrentSel);
		let getClass = [];
		let selElTxt = "";
		let postObj = {};

		let checkPaste = false;
		if (e.ctrlKey || e.metaKey) {
			checkPaste = true;
		}
		setDetectPaste(checkPaste);
		if (
			getCurrentSel &&
			getCurrentSel.focusNode &&
			getCurrentSel.focusNode.parentNode
		) {
			if (getCurrentSel.focusNode.parentNode.className) {
				getClass = getCurrentSel.focusNode.parentNode.className.split(" ");
			}
			if (getCurrentSel.focusNode.parentNode.textContent) {
				selElTxt = getCurrentSel.focusNode.parentNode.textContent;
			}
		}

		// Right Arrow Cursor
		// if(e.keyCode == 39 && )
		// {

		// }
		// if (e.code != "ArrowRight") {
		//   setRightArrowEvent(false);
		// }
		let htmlElement = document.getElementById("textareaDiv");
		if (e.keyCode == 8) {
			if (removeClassArray.includes(getClass[0])) {
				e.preventDefault();
			}
			// if (e.target.textContent.trim().length == 0) {
			// 	clearParser();
			// }
			setRightArrowEvent(false);
		} else if (e.keyCode == 39) {

			setRightArrowEvent(true);
			// callParseQuery(e.target.textContent, htmlElement, true);
			postObj = {
				value: e.target.textContent,
				element: htmlElement,
				isRightArrow: true,
				pasteContent: null
			}
			parseQuery(postObj);
		} else {
			setRightArrowEvent(false);
			// postObj = {
			// 	value:e.target.textContent,
			// 	element:htmlElement,
			// 	isRightArrow:false,
			// 	pasteContent:null
			// }
			// parseQuery(postObj);
			// e.stopPropagation();
		}
	};
	const handlePaste = (e) => {
		let getPasteTxt = e.clipboardData.getData("Text");
		setPasteContent(getPasteTxt);
		let htmlElement = document.getElementById("textareaDiv");
		let postObj = {
			value: htmlElement.textContent,
			element: htmlElement,
			isRightArrow: false,
			pasteContent: getPasteTxt
		}
		parseQuery(postObj);


	};
	const callParseQuery = (value, element, isArrowRight) => {
		// setTimeout(() => {
		let savedCaretPosition = CaretPositioning.saveSelection(element.currentTarget);
		setCaretPosition(savedCaretPosition);
		let getCurrentSel = window.getSelection();
		// parseQuery(value, element, isArrowRight);
		let postObj = {
			value: value,
			element,
			isRightArrow: false,
			pasteContent: '',
			savedCaretPosition,
			getCurrentSel
		}
		parseQuery(postObj);

		// }, 50);
	};
	const parseQuery = async (data) => {
		// let value = element.target.textContent;
		let { value, element, isRightArrow, savedCaretPosition, getCurrentSel } = data;
		// localStorage.setItem('searchData',value);
		// setFullText(value);
		let getLength = value.length;
		let checkLastChar = value.slice(-1);

		// let htmlElement = document.getElementById("textareaDiv");
		let htmlElement = document.getElementById("textareaDiv");
		if (htmlElement.children.length > 0) {
			// var htmlChildEl = htmlElement.children;
			let htmlEl = await removePasteHtml(htmlElement);
		}
		// If Space Enters without any string
		if (keyCode == 32) {
			if (value.length > 1) {
				replaceStringHtml(value, keyCode, isRightArrow, savedCaretPosition, getCurrentSel);
			} else {
				value = "";
				updateHtmlElement(value);
			}
			setSearchTermPopup(false);
		} else {
			replaceStringHtml(value, keyCode, isRightArrow, savedCaretPosition, getCurrentSel);
			// replaceStringHtml(value,keyCode);
		}

		// For Popup open on current pointer position

		if (checkLastChar == "?") {
			let getXYCoordinates = getCaretGlobalPosition();
			if (getXYCoordinates) {
				setTopPosition(getXYCoordinates.top);
				setLeftPosition(getXYCoordinates.left);
			}
			openPopup(element);
		}
	};
	async function removePasteHtml(htmlElement) {
		let parserClass = ["query", "andClass", "orClass", "notClass", "autoquery", "opClass", "space", "pubClass", "publicationClass", "pastequery"]
		if (htmlElement.children.length > 0) {
			let htmlChildEl = htmlElement.children;
			let childLen = htmlChildEl.length;
			let checkClass = '';
			let splitClass = [];
			Object.keys(htmlElement.children).forEach(function (key) {
				if (htmlElement.children[key] && htmlElement.children[key].attributes && htmlElement.children[key].attributes.class != undefined) {
					checkClass = htmlElement.children[key] ? htmlElement.children[key].attributes.class.value : "";
					splitClass = checkClass ? checkClass.split(" ") : [];
					if (!parserClass.includes(splitClass[0])) {
						htmlElement.children[key].outerHTML = "";
						removePasteHtml(htmlElement);
					}
				}
				else {
					if (htmlElement.children[key]) {
						htmlElement.children[key].outerHTML = "";
					}
					removePasteHtml(htmlElement);
				}
				if (childLen == key + 1) {
					return htmlElement;
				}
			});
		} else {
			return htmlElement;
		}
	}
	async function replaceStringHtml(value, keyCode, isArrowRight, savedCaretPosition, getCurrentSel1) {
		let getCurrentSel = window.getSelection();
		let htmlElement = document.getElementById("textareaDiv");
		// htmlElement.innerHTML = htmlElement.innerHTML.replace(
		// 	/<br>/g,
		// 	""
		// );

		value = value.replace(".", "").replace(" ", "");
		let lastValue = value.slice(-1);
		let lastPrevValue = value.charAt(value.length - 2);
		let lastChild = '';
		let lastPrevChild = '';
		// let lastChild = htmlElement.children[htmlElement.children.length - 1];
		// let lastPrevChild = htmlElement.children[htmlElement.children.length - 2];
		if (getCurrentSel.focusNode.nodeName == "SPAN") {
			lastChild = getCurrentSel.focusNode;
		}
		else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
			lastChild = getCurrentSel.focusNode.previousElementSibling;
		}else if (getCurrentSel.focusNode.nodeName == "#text") {
			if(getCurrentSel.focusNode.parentElement.nodeName == "SPAN")
			{
				lastChild = getCurrentSel.focusNode.parentElement;
			}else{
				lastChild = getCurrentSel.focusNode.previousElementSibling;
			}
			
		}else {
			lastChild = getCurrentSel.focusNode.parentElement;
		}

		let placeCursor = true;
		let spanArr = "";
		let getEndPosition = 0;
		var checkClass;
		var placeCursorPos = false;
		var removedText = '';
		var spaceOpacity = true;
		var getCurrClass = '';
		var getCurrDataId = '';
		let getChildClass = "",
			getChildClassName = "",
			getChildText = "",
			getChildEl = "";
		let countOpClass = 0;
		let isStopCheck = false;
		let getClassId;
		let checkElClass=[];
		// let getPrevChildClass='',getPrevChildClassName='',getPrevChildText='';
		if (lastChild && lastChild.attributes.length > 0) {
			getChildClass = lastChild.attributes.class
				? lastChild.attributes.class
				: "";
			getChildClassName = getChildClass ? getChildClass.value : "";
			getChildText = lastChild.textContent;
			getChildEl = lastChild;
		} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
			getChildClass = lastPrevChild.attributes.class
				? lastPrevChild.attributes.class
				: "";
			getChildClassName = getChildClass ? getChildClass.value : "";
			getChildText = lastPrevChild.textContent;
			getChildEl = lastPrevChild;
		}

		// For Auto Complete send current typed text
		let getSearchVal = getChildText.trim();
		
		// Removing Common CSS class for functionality
		getChildClassName = getChildClassName.split(" ")[0];
		let checkORValues = ["OR ", "or ", "or", "OR"];
		let checkANDValues = ["AND ", "and ", "and", "AND"];
		let checkNOTValues = ["NOT ", "not ", "not", "NOT"];
		// If Delete event for key 8
		let getSelectedNodeId = "";
		let getSelectedNodeText = "";
		let searchPubArr = ["pu", 'PU', 'Pu', 'pU', 'pu ', 'PU ', 'Pu '];
		let searchPublicationTxt = "publication_Date";
		const checkpubelements = document.getElementsByClassName("pub");
		const checkpublicationelements = document.getElementsByClassName("publication");
		var styleAttr = '';
		if (
			getCurrentSel &&
			getCurrentSel.focusNode &&
			getCurrentSel.focusNode.parentNode
		) {
			if (getCurrentSel.focusNode.parentNode.className) {
				getSelectedNodeId =
					getCurrentSel.focusNode.parentNode.getAttribute("dataid");
			}
		}
		let currOffsetTop = getCurrentSel.focusNode.parentNode.offsetTop - 2;
		let currOffsetLeft = getCurrentSel.focusNode.parentNode.offsetLeft;
		styleAttr = `position:absolute;top:${currOffsetTop}px;left:${currOffsetLeft}px;`;

		// For Auto Suggest,If user clicks right arrow then the text will be selected
		let convertLowerPublTxt = searchPublicationTxt.toLowerCase();
		getChildText = getChildText.toLowerCase();
		if (isArrowRight) {
			
		}
		// if (isArrowRight) {


		// 	if (lastChild && lastChild.attributes.length > 0) {
		// 		if (searchPubArr.includes(getChildText)) {
		// 			htmlElement.children[htmlElement.children.length - 1].outerHTML = pubString;
		// 			placeCaretAtEnd(
		// 				htmlElement.children[htmlElement.children.length - 1]
		// 			); // To Place Cursor in Last
		// 			// Removing Auto Suggest Text from DOM
		// 			if (checkpubelements.length > 0) {
		// 				checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
		// 			}
		// 			if (checkpublicationelements.length > 0) {
		// 				checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
		// 			}
		// 		} else if (convertLowerPublTxt.startsWith(getChildText)) {
		// 			htmlElement.children[htmlElement.children.length - 1].outerHTML = publicationString;
		// 			placeCaretAtEnd(
		// 				htmlElement.children[htmlElement.children.length - 1]
		// 			); // To Place Cursor in Last
		// 			// Removing Auto Suggest Text from DOM
		// 			const elements = document.getElementsByClassName("publication");
		// 			if (checkpubelements.length > 0) {
		// 				checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
		// 			}
		// 			if (checkpublicationelements.length > 0) {
		// 				checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
		// 			}
		// 		}
		// 	} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
		// 		if (searchPubArr.includes(getChildText)) {
		// 			htmlElement.children[htmlElement.children.length - 2].outerHTML =
		// 				pubString;
		// 			// To Place Cursor in Last
		// 			placeCaretAtEnd(
		// 				htmlElement.children[htmlElement.children.length - 2]
		// 			);
		// 			// Removing Auto Suggest Text from DOM
		// 			if (checkpubelements.length > 0) {
		// 				checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
		// 			}
		// 			if (checkpublicationelements.length > 0) {
		// 				checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
		// 			}
		// 		} else if (convertLowerPublTxt.startsWith(getChildText)) {
		// 			htmlElement.children[htmlElement.children.length - 2].outerHTML = publicationString;
		// 			placeCaretAtEnd(
		// 				htmlElement.children[htmlElement.children.length - 2]
		// 			); // To Place Cursor in Last
		// 			// Removing Auto Suggest Text from DOM
		// 			if (checkpubelements.length > 0) {
		// 				checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
		// 			}
		// 			if (checkpublicationelements.length > 0) {
		// 				checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
		// 			}
		// 		}
		// 	}
		// } else 
		else if (detectPaste) {

			let splitPasteTxt = pasteContent ? pasteContent.split(" ") : [];
			if (splitPasteTxt && splitPasteTxt.length > 0) {
				let opFlag = 0;
				let getSplitLen = splitPasteTxt.length;
				splitPasteTxt.map((data, i) => {
					var newSpan = document.createElement("span");
					// add the class to the 'span'
					if (checkANDValues.includes(data)) {
						newSpan.innerHTML = ANDString;
						opFlag = 1;
					} else if (checkORValues.includes(data)) {
						newSpan.innerHTML = ORString;
						opFlag = 1;
					} else if (checkNOTValues.includes(data)) {
						newSpan.innerHTML = NOTString;
						opFlag = 1;
					} else {
						newSpan.setAttribute("class", "pastequery");
						newSpan.innerText = data;
						opFlag = 0;
					}
					if (opFlag == 1) {
						spanArr += newSpan.innerHTML;
					} else {
						spanArr += newSpan.outerHTML;
					}
				});
				let getLastIndex = htmlElement.innerHTML.lastIndexOf(pasteContent);
				if (getLastIndex > -1) {
					let remPasteContent = htmlElement.innerHTML.substring(
						0,
						getLastIndex
					);
					htmlElement.innerHTML = remPasteContent;
					htmlElement.innerHTML = htmlElement.innerHTML + ANDString + spanArr;
				} else {
					if (htmlElement.textContent.length == 0) {
						htmlElement.innerHTML = spanArr;
					} else {
						htmlElement.innerHTML = htmlElement.innerHTML + ANDString + spanArr;
					}

				}
				setDetectPaste(false); // After Paste, reset false by default
				setPasteContent('');
				placeCursor = true;
			}
		} else if (keyCode == 32) {
			// If Space Enters
			setSearchTermPopup(false);

			// if (lastPrevValue.trim().length > 0) {
			if (lastChild && lastChild.attributes.length > 0) {
				if (
					getChildClassName == "autoquery" ||
					getChildClassName == "pastequery" ||
					getChildClassName == "pubClass" ||
					getChildClassName == "publicationClass"
				) {
					htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
						"<br>",
						""
					);
					var newSpan = document.createElement("span");
					newSpan.setAttribute("class", "space");
					newSpan.innerHTML = "";
					htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
				} else if (getChildClassName == "query") {
					
					let splitPrevClass = [];
					// if(getCurrentSel.focusNode.nodeName == "#text")
					// {
					// 	let prevSib = getCurrentSel.focusNode.previousElementSibling;
					// 	if(prevSib && prevSib.parentElement.nodeName == "DIV")
					// 	{
					// 		if(prevSib.previousElementSibling)
					// 		{
					// 			PrevElSibling = prevSib.previousElementSibling;
					// 		}else{
					// 			PrevElSibling = prevSib;
					// 		}
							
					// 	}else{
					// 		PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
					// 	}
						
					// 	splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' '):[];
					// 	getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid"):'';	
					// }
					// else if (getCurrentSel.focusNode.nodeName == "SPAN") {
					// 	PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
					// 	splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
					// 	getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					// }
					// else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
					// 	PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
					// 	splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
					// 	getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					// }

					var PrevElClass = [];
					var PrevElSibling = '';
					// To Check Prev Element values has operator or not, if not we place operator dynamically
					if (getCurrentSel.focusNode.nodeName == "#text") {
						if(getCurrentSel.focusNode.previousElementSibling)
						{
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling.previousElementSibling;
							if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
							{
								getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
							}else{
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}
							
						}else if(getCurrentSel.focusNode.parentElement.previousElementSibling){
							PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
							getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
						}else{
							if(getCurrentSel.focusNode.parentElement.getAttribute("dataid"))
							{
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}else if(getCurrentSel.focusNode.parentElement.parentElement)
							{
								if(getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid"))
								{
									getCurrDataId = getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") : '';
								}
							}
							PrevElSibling = getCurrentSel.focusNode.parentElement;
						}

						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					}
					else if (getCurrentSel.focusNode.nodeName == "SPAN") {
						PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					}
					else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
						PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					} else {
						PrevElSibling = getCurrentSel.focusNode;
						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid") : '';
					}
						if (checkANDValues.includes(getChildText)) {
							// htmlElement.children[htmlElement.children.length - 1].outerHTML =
							// 	ANDString;
							Object.keys(htmlElement.children).forEach(function (key) {
								getClassId = htmlElement.children[key].getAttribute("dataid");
								if (getClassId == getCurrDataId) {
									htmlElement.children[key].outerHTML = ANDString;
								}
							});
							// placeCursor = true;
						} else if (checkORValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ORString;
							placeCursor = true;
							// lastChildEl.innerHTML = ORString;
						} else if (checkNOTValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								NOTString;
							placeCursor = true;
						} else {
							// htmlElement.innerHTML = htmlElement.innerHTML.replace(
							// 	/<br>/g,
							// 	""
							// );
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "space");
							newSpan.innerHTML = ".";
							getEndPosition = savedCaretPosition.end
							Object.keys(htmlElement.children).forEach(function (key) {
								getClassId = htmlElement.children[key].getAttribute("dataid");
								if (getClassId == getCurrDataId) {
									if(htmlElement.children[key].textContent.includes('(') && htmlElement.children[key].textContent.includes(')'))
									{
										let splitContent = htmlElement.children[key].textContent.split(' ');
										let combineSpan = '';
										let checkKey = 0;
										splitContent.forEach(function(value,key){
											checkKey = checkKey + 1;
											var textSpan = document.createElement("span");
											textSpan.setAttribute("class", "query");
											textSpan.innerHTML = value;
											if ((checkKey % 2) != 1) {
												combineSpan += newSpan.outerHTML+textSpan.outerHTML;
											}
											else {
												combineSpan += textSpan.outerHTML;
											}
										});
										console.log(combineSpan,'combineSpan');
										htmlElement.children[key].outerHTML = combineSpan;
									}else{
										htmlElement.children[key].outerHTML = htmlElement.children[key].outerHTML.replace(/<br>/g, "")  + newSpan.outerHTML;
									}
									// getEndPosition = savedCaretPosition.end;
								}
							});
							// if (
							// 	getCurrentSel &&
							// 	getCurrentSel.focusNode && getCurrentSel.focusNode.parentElement
							// ) {
							// 	// let currDataId = '';
							// 	if (getCurrentSel.focusNode.previousElementSibling) {
							// 		getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid");
							// 	} else {
							// 		getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid");
							// 	}

							// 	Object.keys(htmlElement.children).forEach(function (key) {
							// 		getClassId = htmlElement.children[key].getAttribute("dataid");
							// 		if (getClassId == getCurrDataId) {
							// 			htmlElement.children[key].outerHTML = htmlElement.children[key].outerHTML.replace(/<br>/g, "") + newSpan.outerHTML;
							// 		}
							// 	});
							// } else {
							// 	htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g, "") + newSpan.outerHTML;
							// }

							placeCursor = false;
							placeCursorPos = true;

							// getEndPosition = savedCaretPosition.end;
							// setTimeout(() => {
							// 	setCurrentCursorPosition(getEndPosition);
							// }, 0);

						}
				} else if (getChildClassName == "space") {
					getChildText = getChildText.trim();
					var newSpan = document.createElement("span");
					newSpan.setAttribute("class", "space");
					newSpan.innerHTML = ".";
					// htmlElement.innerHTML = htmlElement.innerHTML.trim();
					var splitPrevClass = [];
					
					let PrevElSibling = '';
					// if(getCurrentSel.focusNode.nodeName == "#text")
					// {
					// 	let prevSib = getCurrentSel.focusNode.previousElementSibling;
					// 	if(prevSib && prevSib.parentElement.nodeName == "DIV")
					// 	{
					// 		if(prevSib.previousElementSibling)
					// 		{
					// 			PrevElSibling = prevSib.previousElementSibling;
					// 		}else{
					// 			PrevElSibling = prevSib;
					// 		}
							
					// 	}else{
					// 		PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
					// 	}
						
					// 	splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' '):[];
					// 	getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid"):'';	
					// }

					if (getCurrentSel.focusNode.nodeName == "#text") {
						if(getCurrentSel.focusNode.previousElementSibling)
						{
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling.previousElementSibling;
							if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
							{
								getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
							}else{
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}
							
						}else if(getCurrentSel.focusNode.parentElement.previousElementSibling){
							PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
							getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
						}

						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					}
					else if (getCurrentSel.focusNode.nodeName == "SPAN") {
						PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					}
					else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
						PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
					}
					if (checkORValues.includes(getChildText)) {
						// htmlElement.children[htmlElement.children.length - 1].outerHTML =
						// 	ORString + newSpan.outerHTML;
						Object.keys(htmlElement.children).forEach(function (key) {
							getClassId = htmlElement.children[key].getAttribute("dataid");
							if (getClassId == getCurrDataId) {
								htmlElement.children[key].outerHTML = ORString + newSpan.outerHTML;
								getEndPosition = savedCaretPosition.end + 1;
								placeCursor = false;
								placeCursorPos = true;
							}
						});
						// lastChildEl.innerHTML = ORString;
					} else if (checkANDValues.includes(getChildText)) {
						// htmlElement.children[htmlElement.children.length - 1].outerHTML =
						// 	ANDString + newSpan.outerHTML;
						// Object.keys(htmlElement.children).forEach(function (key) {
						// 	getClassId = htmlElement.children[key].getAttribute("dataid");
						// 	if (getClassId == getCurrDataId) {
						// 		htmlElement.children[key].outerHTML = ANDString + newSpan.outerHTML;
						// 	}
						// });
						Object.keys(htmlElement.children).forEach(function (key) {
							getClassId = htmlElement.children[key].getAttribute("dataid");
							if (getClassId == getCurrDataId) {
								htmlElement.children[key].outerHTML = ANDString + newSpan.outerHTML;
								getEndPosition = savedCaretPosition.end;
								placeCursor = false;
								placeCursorPos = true;
							}
						});
					} else if (checkNOTValues.includes(getChildText)) {
						// htmlElement.children[htmlElement.children.length - 1].outerHTML =
						// 	NOTString + newSpan.outerHTML;
						// Object.keys(htmlElement.children).forEach(function (key) {
						// 	getClassId = htmlElement.children[key].getAttribute("dataid");
						// 	if (getClassId == getCurrDataId) {
						// 		htmlElement.children[key].outerHTML = NOTString + newSpan.outerHTML;
						// 	}
						// });
						Object.keys(htmlElement.children).forEach(function (key) {
							getClassId = htmlElement.children[key].getAttribute("dataid");
							if (getClassId == getCurrDataId) {
								htmlElement.children[key].outerHTML = NOTString + newSpan.outerHTML;
								getEndPosition = savedCaretPosition.end + 1;
								placeCursor = false;
								placeCursorPos = true;
							}
						});
					} else {
						// // Adding AND operator if space enters
						// htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML =
							htmlElement.children[
								htmlElement.children.length - 1
							].textContent.trimRight();
						// newSpan.textContent = htmlElement.children[htmlElement.children.length - 1].textContent.trimRight();
						htmlElement.children[htmlElement.children.length - 1].outerHTML =
							ANDString + " " + newSpan.outerHTML;
						htmlElement.innerHTML = htmlElement.innerHTML.replace(
							/<br>/g,
							""
						);
						htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
					}
				} else if (removeClassArray.includes(getChildClassName)) {
					var newSpan = document.createElement("span");
					newSpan.setAttribute("class", "space");
					newSpan.innerHTML = ".";
					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML + newSpan.outerHTML;
				}
			} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
				if (
					getChildClassName == "autoquery" ||
					getChildClassName == "pastequery"
				) {
					htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
						"<br>",
						""
					);
					var newSpan = document.createElement("span");
					newSpan.setAttribute("class", "space");
					newSpan.innerHTML = "";
					htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
				} else if (getChildClassName == "space") {
					if (checkORValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							ORString;
						// lastChildEl.innerHTML = ORString;
					} else if (checkANDValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							ANDString;
					} else if (checkNOTValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							NOTString;
					} else {
						// // Adding AND operator if space enters
						// htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML =
							htmlElement.children[
								htmlElement.children.length - 2
							].textContent.trimRight();
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							ANDString + " " + newSpan.outerHTML;
						htmlElement.innerHTML = htmlElement.innerHTML.replace(
							/<br>/g,
							""
						);
						htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
					}
				} else if (getChildClassName == "query") {
					if (checkANDValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							ANDString;
					} else if (checkORValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							ORString;
					} else if (checkNOTValues.includes(getChildText)) {
						htmlElement.children[htmlElement.children.length - 2].outerHTML =
							NOTString;
					} else {
						htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
							"<br>",
							""
						);
						var newSpan = document.createElement("span");
						newSpan.setAttribute("class", "space");
						newSpan.innerHTML = ".";
						htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
						placeCursor = false;
						placeCursorPos = true;
						getEndPosition = savedCaretPosition.end + 1;
						// setCurrentCursorPosition(getEndPosition);
					}
				}
			} else {
				// if(lastChildEl.tagName != "BR")
				// {
				htmlElement.innerHTML = htmlElement.innerHTML.replaceAll("<br>", "");
				var newSpan = document.createElement("span");
				newSpan.setAttribute("class", "space");
				newSpan.innerHTML = "";
				htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
				htmlElement.innerHTML = htmlElement.innerHTML.replaceAll("<br>", "");
				// }
			}
			// placeCaretAtEnd(htmlElement);
			// } else {
			// 	if (htmlElement.innerHTML.slice(-1) != ">") {
			// 		htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
			// 		// htmlElement.innerHTML = htmlElement.innerHTML.replace(/&nbsp;/g,"");
			// 		htmlElement.innerHTML = htmlElement.innerHTML.replaceAll("<br>", "");
			// 		// placeCaretAtEnd(htmlElement);
			// 	}
			// }
		} else if (keyCode == 8) {

			if (lastChild && lastChild.attributes.length > 0) {
				var currentEl = '';
				var splitPrevClass = [];
				var prevKey = 0;
				if (getCurrentSel.focusNode.nodeName == "#text") {
					if(getCurrentSel.focusNode.previousElementSibling)
					{
						currentEl = getCurrentSel.focusNode.previousElementSibling;
						if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
						{
							getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
						}else{
							getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
						}
						
					}else {
						currentEl = getCurrentSel.focusNode.parentElement;
						if(getCurrentSel.focusNode.parentElement.getAttribute("dataid"))
						{
							getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
						}else if(getCurrentSel.focusNode.parentElement.parentElement)
						{
							if(getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid"))
							{
								getCurrDataId = getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") : '';
							}
						}
						
						// getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
					}

					splitPrevClass = currentEl ? currentEl.attributes.class.value.split(' ') : [];
					// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
				}
				else if (getCurrentSel.focusNode.nodeName == "SPAN") {
					currentEl = getCurrentSel.focusNode;
					splitPrevClass = currentEl ? currentEl.attributes.class.value.split(' ') : [];
					getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
				}
				else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
					currentEl = getCurrentSel.focusNode.previousElementSibling;
					splitPrevClass = currentEl ? currentEl.attributes.class.value.split(' ') : [];
					getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
				}
				let currDataId = 0;
				getCurrDataId = parseInt(getCurrDataId);
				if(currentEl && currentEl.textContent.length == 0)
				{
					Object.keys(htmlElement.children).forEach(function (key, val) {
						if(htmlElement.children[key])
						{
							getClassId = htmlElement.children[key].getAttribute("dataid");
							if(key > 0){
								prevKey = key - 1;
								getCurrClass = htmlElement.children[prevKey].attributes.class.value.split(" ");
							}
							currDataId = parseInt(getClassId);
							
							if (getCurrDataId == currDataId) {
								htmlElement.removeChild(htmlElement.children[key]);
								getEndPosition = savedCaretPosition.end;
								if (removeClassArray.includes(getCurrClass[0])) {
									getEndPosition = getEndPosition - 4;
									htmlElement.removeChild(htmlElement.children[prevKey]);
								}
								placeCursor = false;
								placeCursorPos = true;
							}
						}
					});
					if(htmlElement.textContent.trim().length == 0)
					{
						placeCursor = false;
						clearParser();
					}
				}else{
					if(htmlElement.children.length > 1)
					{
						getEndPosition = savedCaretPosition.end;
						placeCursor = false;
						placeCursorPos = true;
					}else if(htmlElement.textContent.trim().length == 0)
					{
						placeCursor = false;
						clearParser();
					}else{
						getEndPosition = savedCaretPosition.end;
						placeCursor = false;
						placeCursorPos = true;
					}
				}
				// let trimText = htmlElement.children[htmlElement.children.length - 1].textContent.trim();
				// if (
				// 	htmlElement.children[htmlElement.children.length - 1].textContent
				// 		.length == 0 ||
				// 	classArray.includes(getChildClassName)
				// ) {
				// 	// Removing the child span tag if empty text in span
				// 	removedText = htmlElement.children[htmlElement.children.length - 1].textContent;
				// 	// if(htmlElement.children[htmlElement.children.length - 1].textContent.length > 0)
				// 	// {
				// 	// 	let getLength = htmlElement.children[htmlElement.children.length - 1].textContent.length;
				// 	// 	placeCursor = false;
				// 	// 	getEndPosition = savedCaretPosition.end - 4;
				// 	// }
				// 	placeCursor = false;
				// 	htmlElement.children[htmlElement.children.length - 1].outerHTML = "";
				// 	setSearchTermPopup(false);
				// } else if (
				// 	htmlElement.children[htmlElement.children.length - 1].textContent &&
				// 	searchPubArr.includes(htmlElement.children[htmlElement.children.length - 1].textContent)
				// ) {
				// 	// htmlElement.children[htmlElement.children.length - 1].outerHTML = pubString;
				// 	if (trimText.length == 2) {

				// 		// Checking If Already Auto Suggest Text updated in DOM
				// 		if (checkpubelements.length == 0) {
				// 			var newSpan = document.createElement("span");
				// 			newSpan.setAttribute("class", "pub");
				// 			newSpan.innerHTML = "pub";
				// 			newSpan.setAttribute("style", styleAttr);
				// 			var div = document.getElementById("textareaDiv");
				// 			insertAfter(div, newSpan);
				// 		} else {
				// 			// Updating Current Position
				// 			checkpubelements[0].style.cssText = styleAttr;
				// 		}
				// 	} else {
				// 		// Removing Auto Suggest Text from DOM
				// 		if (checkpubelements.length > 0) {
				// 			checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
				// 		}
				// 		if (checkpublicationelements.length > 0) {
				// 			checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
				// 		}
				// 	}
				// } else if (
				// 	htmlElement.children[htmlElement.children.length - 1].textContent &&
				// 	convertLowerPublTxt.startsWith(htmlElement.children[htmlElement.children.length - 1].textContent)) {
				// 	if (trimText.length > 3) {
				// 		// Checking If Already Auto Suggest Text updated in DOM
				// 		if (checkpublicationelements.length == 0) {
				// 			var newSpan = document.createElement("span");
				// 			newSpan.setAttribute("class", "publication");
				// 			newSpan.innerHTML = "publication_Date:";
				// 			newSpan.setAttribute("style", styleAttr);
				// 			var div = document.getElementById("textareaDiv");
				// 			insertAfter(div, newSpan);
				// 		} else {
				// 			// Updating Current Position
				// 			checkpublicationelements[0].style.cssText = styleAttr;
				// 		}
				// 	} else {
				// 		if (checkpubelements.length > 0) {
				// 			checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
				// 		}
				// 		if (checkpublicationelements.length > 0) {
				// 			checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
				// 		}
				// 	}
				// }
				// else {
				// 	if (checkpubelements.length > 0) {
				// 		checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
				// 	}
				// 	if (checkpublicationelements.length > 0) {
				// 		checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
				// 	}
				// 	if (trimText.length != savedCaretPosition.end) {
				// 		getEndPosition = savedCaretPosition.end - 1;
				// 	}
				// 	placeCursor = false;
				// 	placeCursorPos = true;
				// 	// getEndPosition = savedCaretPosition.end;
				// 	// setTimeout(() => {
				// 	// 	getEndPosition = savedCaretPosition.end;
				// 	// 	setCurrentCursorPosition(getEndPosition);
				// 	// }, 50);
				// }
			}else{
				getEndPosition = savedCaretPosition.end;
				placeCursor = false;
				placeCursorPos = true;
			} 
		} else {
			if (value != "") {
				let checkOperatorText = ["and", "AND", "or", "OR", "not", "NOT"];
				if (detectPaste) {

					let splitPasteTxt = pasteContent ? pasteContent.split(" ") : [];
					if (splitPasteTxt && splitPasteTxt.length > 0) {
						let opFlag = 0;
						let getSplitLen = splitPasteTxt.length;
						splitPasteTxt.map((data, i) => {
							var newSpan = document.createElement("span");
							// add the class to the 'span'
							if (checkANDValues.includes(data)) {
								newSpan.innerHTML = ANDString;
								opFlag = 1;
							} else if (checkORValues.includes(data)) {
								newSpan.innerHTML = ORString;
								opFlag = 1;
							} else if (checkNOTValues.includes(data)) {
								newSpan.innerHTML = NOTString;
								opFlag = 1;
							} else {
								newSpan.setAttribute("class", "pastequery");
								newSpan.innerText = data;
								opFlag = 0;
							}
							if (opFlag == 1) {
								spanArr += newSpan.innerHTML;
							} else {
								spanArr += newSpan.outerHTML;
							}
						});
					}
				}

				if (lastChild && lastChild.attributes.length > 0) {
					if (getChildClassName == "autoquery") {
						htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
							"<br>",
							""
						);
						var newSpan = document.createElement("span");
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = lastValue;
						if (htmlElement.innerHTML.slice(-1) != ">") {
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						}
						if (
							lastValue == "o" ||
							lastValue == "O" ||
							lastValue == "a" ||
							lastValue == "A" ||
							lastValue == "n" ||
							lastValue == "N"
						) {
							htmlElement.innerHTML =
								htmlElement.innerHTML + " " + newSpan.outerHTML;
							savedCaretPosition.end = savedCaretPosition.end + 1;
						} else {
							htmlElement.innerHTML =
								htmlElement.innerHTML + ANDString + " " + newSpan.outerHTML;
							savedCaretPosition.end = savedCaretPosition.end + 4;
						}
						// if (lastChild.innerText.length == 0) {
						// 	newSpan.innerHTML = lastValue;
						// } 
						// else {
						// 	newSpan.innerHTML = lastChild.innerText + lastValue;
						// }

					} else if (getChildClassName == "pastequery") {
						if (detectPaste) {
							let getLastIndex =
								htmlElement.innerHTML.lastIndexOf(pasteContent);
							let remPasteContent = htmlElement.innerHTML.substring(
								0,
								getLastIndex
							);
							htmlElement.innerHTML = remPasteContent;
							htmlElement.innerHTML =
								htmlElement.innerHTML + ANDString + spanArr;
						} else {
							htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
								"<br>",
								""
							);
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "query");
							newSpan.innerHTML = lastValue;
							htmlElement.innerHTML =
								htmlElement.innerHTML + ANDString + newSpan.outerHTML;
						}
					} else if (getChildClassName == "space") {
						let removedText = '';
						let childLen = htmlElement.childNodes.length;
						let inc = 0;
						let checkKey = 0;
						getChildText = getChildText.replace('.', '');
						lastValue = getChildText ? getChildText.slice(-1) : '';
						Object.keys(htmlElement.childNodes).forEach(function (key, val) {
							if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
								removedText = htmlElement.childNodes[key].textContent;
								// lastValue = htmlElement.childNodes[key].textContent;
							}
							checkKey = parseInt(inc) + 1;
							if (childLen == checkKey && (lastValue == "" || lastValue == " ")) {
								let lastKey = inc;
								let prevKey = inc - 1;
								if (htmlElement.childNodes[lastKey].textContent != " ") {
									lastValue = htmlElement.childNodes[lastKey].textContent;
								} else {
									lastValue = htmlElement.childNodes[prevKey].textContent;
								}
							}
							inc++;
						});
						// }
						
						// getChildText = getChildText + lastValue;
						if (removedText != "") {
							// if(getChildText == "")
							// {
							getChildText = getChildText + removedText;
							// }

						}
						lastValue = getChildText.slice(-1).replace('.', '');
						let splitPrevClass = [];
						// if(lastPrevChild && lastPrevChild.attributes.class)
						// {
						// 	splitPrevClass = lastPrevChild.attributes.class ? lastPrevChild.attributes.class.value.split(' '):[];
						// }
						var PrevElSibling = '';

						// To Check Prev Element values has operator or not, if not we place operator dynamically
						if (getCurrentSel.focusNode.nodeName == "#text") {
							if(getCurrentSel.focusNode.previousElementSibling)
							{
								PrevElSibling = getCurrentSel.focusNode.previousElementSibling.previousElementSibling;
								if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
								{
									getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
								}else{
									getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
								}
								
							}else if(getCurrentSel.focusNode.parentElement.previousElementSibling){
								PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}

							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.nodeName == "SPAN") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						} else {
							PrevElSibling = getCurrentSel.focusNode;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid") : '';
						}
						if (detectPaste) {
							let getLastIndex =
								htmlElement.innerHTML.lastIndexOf(pasteContent);
							let remPasteContent = htmlElement.innerHTML.substring(
								0,
								getLastIndex
							);

							htmlElement.innerHTML = remPasteContent;
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ANDString + " " + spanArr;
						} else if (
							lastValue == "o" ||
							lastValue == "O" ||
							lastValue == "a" ||
							lastValue == "A" ||
							lastValue == "n" ||
							lastValue == "N"
						) {
							// let replaceDot = htmlElement.children[htmlElement.children.length - 1]
							// 	.textContent.replace('.','');
							let replaceDot = '';
							if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
								replaceDot = getCurrentSel.focusNode.previousElementSibling.textContent.replace('.', '');
							} else {
								replaceDot = getCurrentSel.focusNode.parentElement.textContent.replace('.', '');
							}
							
							spaceOpacity = false;
							// htmlElement.children[htmlElement.children.length - 1].style = 'opacity:1';

							if (replaceDot.length == 0) {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 1
								].textContent = lastValue;
							} else {
								// htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								// replaceDot = replaceDot.slice(0, -1);
								if (removedText == lastValue) {
									htmlElement.children[
										htmlElement.children.length - 1
									].textContent = replaceDot + lastValue;
								} else {
									// htmlElement.children[
									// 	htmlElement.children.length - 1
									// ].textContent = replaceDot;
									
									Object.keys(htmlElement.children).forEach(function (key) {
										getClassId = htmlElement.children[key].getAttribute("dataid");
										checkElClass = htmlElement.children[key].attributes.class.value.split(' ');
										if(getClassId == getCurrDataId)
										{
											htmlElement.children[key].textContent = replaceDot;
											if(replaceDot.length == 1)
											{
												getEndPosition = savedCaretPosition.end - 1;
											}else{
												getEndPosition = savedCaretPosition.end;
											}
											placeCursor = false;
											placeCursorPos = true;
											
												// getEndPosition = savedCaretPosition.end + 3;
												// placeCursor = false;
												// placeCursorPos = true;
												
												isStopCheck = true;
										}
										if(!isStopCheck)
										{
											if(removeClassArray.includes(checkElClass[0]))
											{
												countOpClass = countOpClass + 1;
											}
										}
									});
								}
								if (htmlElement.innerHTML.slice(-1) != ">") {
									htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								}
								// htmlElement.children[
								// 	htmlElement.children.length - 1
								// ].textContent = replaceDot;
							}
							Object.keys(htmlElement.childNodes).forEach(function (key, val) {
								if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
									htmlElement.removeChild(htmlElement.childNodes[key]);
								}
							});
						} else if (
							checkORValues.includes(getChildText) ||
							checkANDValues.includes(getChildText) ||
							checkNOTValues.includes(getChildText)
						) {
							spaceOpacity = false;
							// htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							// htmlElement.children[htmlElement.children.length - 1].textContent = getChildText;
							Object.keys(htmlElement.children).forEach(function (key) {
								getClassId = htmlElement.children[key].getAttribute("dataid");
								checkElClass = htmlElement.children[key].attributes.class.value.split(' ');
								// console.log(checkElClass,'checkElClass');
								if(getClassId == getCurrDataId)
								{
									htmlElement.children[key].textContent = getChildText;
									getEndPosition = savedCaretPosition.end;
									placeCursor = false;
									placeCursorPos = true;
								}
							});
							if (htmlElement.innerHTML.slice(-1) != ">") {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							}
						} else {
							// // Adding AND operator if space enters

							Object.keys(htmlElement.childNodes).forEach(function (key, val) {
								if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
									lastValue = htmlElement.childNodes[key].textContent;
								}
							});
							//create the DOM object
							var newSpan = document.createElement("span");
							// add the class to the 'span'
							newSpan.setAttribute("class", "query");
							// let checkOpText = lastPrevChild.innerText+lastValue;
							getChildText = getChildText.replace(".", "");
							lastValue = lastValue.trim();
							if (getChildText.length == 1 && getChildText == "") {
								// if (htmlElement.innerHTML.slice(-1) != ">") {
								// 	htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								// }

								newSpan.innerHTML = lastValue;
							} else {
								// newSpan.innerHTML = lastChild.innerText + lastValue;
								newSpan.innerHTML = getChildText ? getChildText : lastValue;
							}
							// htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;

							if (checkOperatorText.includes(newSpan.textContent)) {
								htmlElement.children[
									htmlElement.children.length - 1
								].outerHTML = newSpan.outerHTML;
							} else {
								let curPrevKey = 0;
								Object.keys(htmlElement.children).forEach(function (key) {
									getClassId = htmlElement.children[key].getAttribute("dataid");
									curPrevKey = key - 1;
									if ((getClassId == getCurrDataId) && getCurrDataId > 1) {
										splitPrevClass = htmlElement.children[curPrevKey].attributes.class.value.split(' ')
									}
								});
								if(splitPrevClass && splitPrevClass.length > 0)
								{
									if(removeClassArray.includes(splitPrevClass[0]))
									{
										// htmlElement.children[
										// 	htmlElement.children.length - 1
										// ].outerHTML = newSpan.outerHTML;
										Object.keys(htmlElement.children).forEach(function (key) {
											getClassId = htmlElement.children[key].getAttribute("dataid");
											checkElClass = htmlElement.children[key].attributes.class.value.split(' ');
											if(getClassId == getCurrDataId)
											{
												
												if(htmlElement.children[key].textContent.includes('.'))
												{
													getEndPosition = savedCaretPosition.end - 1;
												}else{
													getEndPosition = savedCaretPosition.end - countOpClass;
												}
												htmlElement.children[key].outerHTML = newSpan.outerHTML;
												
												placeCursor = false;
												placeCursorPos = true;
												isStopCheck = true;
											}
											if(!isStopCheck)
											{
												if(removeClassArray.includes(checkElClass[0]))
												{
													countOpClass = countOpClass + 1;
												}
											}
										});
									} else {
										// htmlElement.children[
										// 	htmlElement.children.length - 1
										// ].outerHTML = ANDString + " " + newSpan.outerHTML;
										Object.keys(htmlElement.children).forEach(function (key) {
											getClassId = htmlElement.children[key].getAttribute("dataid");
											checkElClass = htmlElement.children[key].attributes.class.value.split(' ');
											// console.log(checkElClass,'checkElClass');
											if(getClassId == getCurrDataId)
											{
												if (
													newSpan.textContent == "o" ||
													newSpan.textContent  == "O" ||
													newSpan.textContent  == "a" ||
													newSpan.textContent  == "A" ||
													newSpan.textContent  == "n" ||
													newSpan.textContent  == "N"
												) {
													htmlElement.children[key].outerHTML = newSpan.outerHTML;
													getEndPosition = savedCaretPosition.end - countOpClass;
												}else{
													if(htmlElement.children[key].textContent.includes('.')){
														getEndPosition = savedCaretPosition.end + 3;
													}else{
														getEndPosition = savedCaretPosition.end + 4;
													}
													htmlElement.children[key].outerHTML = ANDString + " " + newSpan.outerHTML;
												}
												placeCursor = false;
												placeCursorPos = true;
												isStopCheck = true;
											}
											if(!isStopCheck)
											{
												if(removeClassArray.includes(checkElClass[0]))
												{
													countOpClass = countOpClass + 1;
												}
											}
										});
										console.log(countOpClass,'countOpClass');
										console.log(htmlElement.textContent,'htmlElement.textContent');
										console.log(getEndPosition,'getEndPosition');
									}
								} else {
									htmlElement.children[
										htmlElement.children.length - 1
									].outerHTML = ANDString + " " + newSpan.outerHTML;
								}

							}
							Object.keys(htmlElement.childNodes).forEach(function (key, val) {
								if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
									htmlElement.removeChild(htmlElement.childNodes[key]);
								}
							});
							if (htmlElement.innerHTML.slice(-1) != ">") {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							}
							// htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
							// htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;
						}
						htmlElement.innerHTML = htmlElement.innerHTML.replace("<br>", "");
					} else if (
						getChildClassName == "orClass" ||
						getChildClassName == "andClass" ||
						getChildClassName == "notClass" ||
						getChildClassName == "autoquery"
					) {
						let isOuterText = false;
						Object.keys(htmlElement.childNodes).forEach(function (key, val) {
							if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
								lastValue = htmlElement.childNodes[key].textContent;
								isOuterText = true;
							}
						});
						lastValue = lastValue.trim();
						let splitPrevClass = [];
						// if(lastPrevChild && lastPrevChild.attributes.class)
						// {
						// 	splitPrevClass = lastPrevChild.attributes.class ? lastPrevChild.attributes.class.value.split(' '):[];
						// }
						var PrevElSibling = '';

						// To Check Prev Element values has operator or not, if not we place operator dynamically
						if (getCurrentSel.focusNode.nodeName == "#text") {
							if(getCurrentSel.focusNode.previousElementSibling)
							{
								PrevElSibling = getCurrentSel.focusNode.previousElementSibling.previousElementSibling;
								if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
								{
									getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
								}else{
									getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
								}
								
							}else if(getCurrentSel.focusNode.parentElement.previousElementSibling){
								PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}

							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.nodeName == "SPAN") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						} else {
							PrevElSibling = getCurrentSel.focusNode;
							splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid") : '';
						}
						// htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = lastValue;
						// htmlElement.innerHTML = htmlElement.innerHTML + " " + newSpan.outerHTML;
						Object.keys(htmlElement.children).forEach(function (key) {
							getClassId = htmlElement.children[key].getAttribute("dataid");
							checkElClass = htmlElement.children[key].attributes.class.value.split(' ');
							// console.log(checkElClass,'checkElClass');
							if(getClassId == getCurrDataId)
							{
								htmlElement.children[key].outerHTML = htmlElement.children[key].outerHTML +" "+newSpan.outerHTML;
								getEndPosition = savedCaretPosition.end;
								placeCursor = false;
								placeCursorPos = true;
							}
						});
						if (htmlElement.innerHTML.slice(-1) != ">") {
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						}
						Object.keys(htmlElement.childNodes).forEach(function (key, val) {
							if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
								htmlElement.removeChild(htmlElement.childNodes[key]);
								if(isOuterText)
								{

								}
							}
						});
					} else if (getChildClassName == "pubClass") {
						if (htmlElement.innerHTML.slice(-1) != ">") {
							getSelectedNodeText =
								htmlElement.children[htmlElement.children.length - 1]
									.textContent + lastValue;
						} else {
							getSelectedNodeText =
								htmlElement.children[htmlElement.children.length - 1]
									.textContent;
						}
						styleAttr = `position:absolute;top:${currOffsetTop}px;left:${currOffsetLeft}px;`;
						if (
							getSelectedNodeText &&
							searchPubArr.includes(getSelectedNodeText)
						) {
							if (getSelectedNodeText.length == 2) {

								// Checking If Already Auto Suggest Text updated in DOM
								if (checkpubelements.length == 0) {
									var newSpan = document.createElement("span");
									newSpan.setAttribute("class", "pub");
									newSpan.innerHTML = "pub";
									newSpan.setAttribute("style", styleAttr);
									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpubelements[0].style.cssText = styleAttr;
								}
							} else {
								// Removing Auto Suggest Text from DOM
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						} else if (
							getSelectedNodeText &&
							convertLowerPublTxt.startsWith(getSelectedNodeText)
						) {
							// Checking If Already Auto Suggest Text updated in DOM
							if (getSelectedNodeText.length > 3) {
								// Checking If Already Auto Suggest Text updated in DOM
								if (checkpublicationelements.length == 0) {
									var newSpan = document.createElement("span");
									newSpan.setAttribute("class", "publication");
									newSpan.innerHTML = "publication_Date:";
									newSpan.setAttribute("style", styleAttr);
									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpublicationelements[0].style.cssText = styleAttr;
								}
							} else {
								// Removing Auto Suggest Text from DOM
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						}
					} else if (getChildClassName == "publicationClass") {
						var getCurrentSelectChild = getCurrentSel.focusNode.parentNode;
						// if(getCurrentSelectChild && getCurrentSelectChild.children.length > 0)
						// {

						// }

						// htmlElement.children[htmlElement.children.length - 1].outerHTML =
						// 		ANDString + " " + spanArr;

					} else if (getChildClassName == "query") {
						let childElId = getCurrentSel.focusNode.parentNode.getAttribute("dataid");
						var PrevElClass = [];
						var PrevElSibling = '';
						// To Check Prev Element values has operator or not, if not we place operator dynamically
						if (getCurrentSel.focusNode.nodeName == "#text") {
							if(getCurrentSel.focusNode.previousElementSibling)
							{
								PrevElSibling = getCurrentSel.focusNode.previousElementSibling.previousElementSibling;
								if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
								{
									getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") ? getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid") : '';
								}else{
									getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
								}
								
							}else if(getCurrentSel.focusNode.parentElement.previousElementSibling){
								PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
								getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}else{
								if(getCurrentSel.focusNode.parentElement.getAttribute("dataid"))
								{
									getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
								}else if(getCurrentSel.focusNode.parentElement.parentElement)
								{
									if(getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid"))
									{
										getCurrDataId = getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.parentElement.getAttribute("dataid") : '';
									}
								}
								PrevElSibling = getCurrentSel.focusNode.parentElement;
								// getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid") ? getCurrentSel.focusNode.parentElement.getAttribute("dataid") : '';
							}

							PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							// getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.nodeName == "SPAN") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						}
						else if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
							PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
							PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid") : '';
						} else {
							PrevElSibling = getCurrentSel.focusNode;
							PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
							getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid") : '';
						}
						// if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
						// 	PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 	if (getCurrentSel.focusNode.nodeName == "#text") {
						// 		let prevSib = getCurrentSel.focusNode.previousElementSibling;
						// 		if (prevSib && prevSib.parentElement.nodeName == "DIV") {
						// 			if (prevSib.previousElementSibling) {
						// 				PrevElSibling = prevSib.previousElementSibling;
						// 			} else {
						// 				PrevElSibling = prevSib;
						// 			}

						// 		} else {
						// 			PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 		}

						// 		PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						// 		// getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid"):'';
						// 	} else {
						// 		PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						// 	}

						// 	getCurrDataId = getCurrentSel.focusNode.previousElementSibling.getAttribute("dataid");
						// 	getSelectedNodeText = getCurrentSel.focusNode.previousElementSibling.textContent.replace('.', '').replace(' ', '');
						// } else {
						// 	if (getCurrentSel.focusNode.previousElementSibling) {
						// 		PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 	} else {
						// 		if (getCurrentSel.focusNode.parentElement && getCurrentSel.focusNode.parentElement.previousElementSibling) {
						// 			PrevElSibling = getCurrentSel.focusNode.parentElement.previousElementSibling;
						// 		} else {
						// 			PrevElSibling = getCurrentSel.focusNode.parentElement;
						// 		}

						// 	}

						// 	PrevElClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' ') : [];
						// 	getCurrDataId = getCurrentSel.focusNode.parentElement.getAttribute("dataid");
						// 	getSelectedNodeText = getCurrentSel.focusNode.parentElement.textContent.replace('.', '').replace(' ', '');
						// }
						// if(getCurrentSel.focusNode.nodeName == "#text")
						// 	{
						// 		if(getCurrentSel.focusNode.previousElementSibling)
						// 		{
						// 			PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 		}else{
						// 			PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 		}

						// 		splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' '):[];
						// 		getCurrDataId = PrevElSibling ? PrevElSibling.getAttribute("dataid"):'';
						// 	}
						// 	else if(getCurrentSel.focusNode.nodeName == "SPAN")
						// 	{
						// 		PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 		splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' '):[];
						// 		getCurrDataId =getCurrentSel.focusNode.getAttribute("dataid") ? getCurrentSel.focusNode.getAttribute("dataid"):'';
						// 	}
						// 	else if(getCurrentSel.focusNode.parentElement.nodeName == "DIV")
						// 	{
						// 		PrevElSibling = getCurrentSel.focusNode.previousElementSibling;
						// 		splitPrevClass = PrevElSibling ? PrevElSibling.attributes.class.value.split(' '):[];
						// 		getCurrDataId = getCurrentSel.focusNode ? getCurrentSel.focusNode.getAttribute("dataid"):'';
						// 	}
						// if (htmlElement.innerHTML.slice(-1) != ">") {
						// 	// htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						// 	getSelectedNodeText = getSelectedNodeText + lastValue;
						// } else {
						// 	getSelectedNodeText = getSelectedNodeText;
						// }
						let removedText = '';
						let childLen = htmlElement.childNodes.length;
						let inc = 0;
						let checkKey = 0;
						let lastKey = 0;
						let prevKey = 0;
						getChildText = getChildText.replace('.', '');
						lastValue = getChildText ? getChildText.slice(-1) : '';
						Object.keys(htmlElement.childNodes).forEach(function (key, val) {
							if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
								removedText = htmlElement.childNodes[key].textContent;
								// lastValue = htmlElement.childNodes[key].textContent;
							}
							checkKey = parseInt(inc) + 1;
							if (childLen == checkKey && (lastValue == "" || lastValue == " ")) {
								lastKey = inc;
								prevKey = inc - 1;
								if (htmlElement.childNodes[lastKey].textContent != " ") {
									lastValue = htmlElement.childNodes[lastKey].textContent;
								} else {
									lastValue = htmlElement.childNodes[prevKey].textContent;
								}
							}
							inc++;
						});
						// }
						getSelectedNodeText = getChildText;
						// getChildText = getChildText + lastValue;
						if (removedText != "") {
							// if(getChildText == "")
							// {
								getSelectedNodeText = getChildText + removedText;
							// }

						}
						getChildText = getSelectedNodeText;
						lastValue = getSelectedNodeText.slice(-1).replace('.', '');

						// let getDataId = getCurrentSel.focusNode.parentNode.attributes.dataid;

						if (detectPaste) {
							// let getCurrentTextContent = getCurrentSel.focusNode.parentNode.textContent;
							// var checkLastStr  = getCurrentTextContent.substr(-(pasteContent.length));
							// // Getting Index Value to remove the last append text in span(copy paste)
							// let getLastIndex = getCurrentSel.focusNode.parentNode.textContent.lastIndexOf(pasteContent)
							// if(checkLastStr == pasteContent)
							// {

							// }
							var getRemLastStr =
								getCurrentSel.focusNode.parentNode.textContent;
							// Getting Index Value to remove the last append text in span(copy paste)
							let getLastIndex = getRemLastStr.lastIndexOf(pasteContent);
							if (getLastIndex) {
								getRemLastStr = getRemLastStr.substring(0, getLastIndex);
							}
							htmlElement.children[
								htmlElement.children.length - 1
							].textContent = getRemLastStr;
							// getSearchVal =
							// 	htmlElement.children[htmlElement.children.length - 1]
							// 		.textContent;
						}
						if (htmlElement.children.length == 1) {
							placeCursor = true;
						} else if (
							getSelectedNodeId != "" &&
							getSelectedNodeId != childElId
						) {
							placeCursor = false;
						} else if (
							getSelectedNodeId != "" &&
							getSelectedNodeId == childElId
						) {
							getEndPosition = savedCaretPosition.end;
							placeCursor = false;
							placeCursorPos = true;
						}else {
							placeCursor = true;
						}
						// If Current Selection not render, then getting value from current children
						if (getRemLastStr) {
							getSelectedNodeText =
								getCurrentSel.focusNode.parentNode.textContent;
						} else {
							currOffsetTop = htmlElement.children[htmlElement.children.length - 1].offsetTop - 2;
							currOffsetLeft = htmlElement.children[htmlElement.children.length - 1].offsetLeft;
							styleAttr = `position:absolute;top:${currOffsetTop}px;left:${currOffsetLeft}px;`;
							// htmlElement.innerHTML = htmlElement.innerHTML.trim().replace(/&nbsp;/g, '');
							// if (getCurrentSel && getCurrentSel.focusNode && getCurrentSel.focusNode.parentNode) {
							// 	if (getCurrentSel.focusNode.parentNode.className != "form-group") {
							// 		getCurrClass = getCurrentSel.focusNode.parentNode.className.split(" ");
							// 		getCurrDataId = getCurrentSel.focusNode.parentNode.getAttribute("dataid");
							// 		getSelectedNodeText = getCurrentSel.focusNode.parentNode.textContent.replace('.','').replace(' ','');
							// 	}
							// }else{
							// 	if (htmlElement.innerHTML.slice(-1) != ">") {
							// 		htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							// 		htmlElement.children[
							// 			htmlElement.children.length - 1
							// 		].textContent =
							// 			htmlElement.children[htmlElement.children.length - 1]
							// 				.textContent + lastValue;
							// 		getSelectedNodeText =
							// 			htmlElement.children[htmlElement.children.length - 1]
							// 				.textContent;
							// 	} else {
							// 		getSelectedNodeText =
							// 			htmlElement.children[htmlElement.children.length - 1]
							// 				.textContent;
							// 	}
							// }

						}
						// Checking If Pub Text matching in the current selection node
						if (
							getSelectedNodeText &&
							searchPubArr.includes(getSelectedNodeText)
						) {

							if (getSelectedNodeText.length == 2) {

								// Checking If Already Auto Suggest Text updated in DOM
								if (checkpubelements.length == 0) {
									var newSpan = document.createElement("span");
									newSpan.setAttribute("class", "pub");
									newSpan.innerHTML = "pub";
									newSpan.setAttribute("style", styleAttr);
									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpubelements[0].style.cssText = styleAttr;
								}
							} else {
								// Removing Auto Suggest Text from DOM
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						} else if (
							getSelectedNodeText &&
							convertLowerPublTxt.startsWith(getSelectedNodeText)
						) {
							// Checking If Already Auto Suggest Text updated in DOM
							if (getSelectedNodeText.length > 3) {
								if (checkpublicationelements.length == 0) {
									var newSpan = document.createElement("span");
									newSpan.setAttribute("class", "publication");
									newSpan.innerHTML = "publication_Date:";
									newSpan.setAttribute("style", styleAttr);

									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpublicationelements[0].style.cssText = styleAttr;
								}
							} else {
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						} else {
							if (
								getSelectedNodeText == "o" ||
								getSelectedNodeText == "O" ||
								getSelectedNodeText == "a" ||
								getSelectedNodeText == "A" ||
								getSelectedNodeText == "n" ||
								getSelectedNodeText == "N"
							) {
								// let replaceDot = htmlElement.children[htmlElement.children.length - 1]
								// 	.textContent.replace('.','');
								let replaceDot = '';
								if (getCurrentSel.focusNode.parentElement.nodeName == "DIV") {
									replaceDot = getCurrentSel.focusNode.previousElementSibling.textContent.replace('.', '');
								} else {
									replaceDot = getCurrentSel.focusNode.parentElement.textContent.replace('.', '');
								}
								Object.keys(htmlElement.childNodes).forEach(function (key, val) {
									if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
										htmlElement.removeChild(htmlElement.childNodes[key]);
									}
								});
								spaceOpacity = false;
								// htmlElement.children[htmlElement.children.length - 1].style = 'opacity:1';

								if (replaceDot.length == 0) {
									htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
									htmlElement.children[
										htmlElement.children.length - 1
									].textContent = lastValue;
								} else {
									htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
									// replaceDot = replaceDot.slice(0, -1);
									if (removedText == lastValue) {
										htmlElement.children[
											htmlElement.children.length - 1
										].textContent = replaceDot + lastValue;
									} else {
										htmlElement.children[
											htmlElement.children.length - 1
										].textContent = replaceDot;
									}

									// htmlElement.children[
									// 	htmlElement.children.length - 1
									// ].textContent = replaceDot;
								}
							} else if (
								checkORValues.includes(getSelectedNodeText) ||
								checkANDValues.includes(getSelectedNodeText) ||
								checkNOTValues.includes(getSelectedNodeText)
							) {
								spaceOpacity = false;
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[htmlElement.children.length - 1].textContent = getChildText;
							} else {
								// // Adding AND operator if space enters
								Object.keys(htmlElement.childNodes).forEach(function (key, val) {
									if (htmlElement.childNodes[key] && htmlElement.childNodes[key].nodeName == "#text" && htmlElement.childNodes[key].textContent.trim() != "") {
										lastValue = htmlElement.childNodes[key].textContent;
										htmlElement.removeChild(htmlElement.childNodes[key]);
									}
								});
								//create the DOM object
								var newSpan = document.createElement("span");
								// add the class to the 'span'
								newSpan.setAttribute("class", "query");
								// let checkOpText = lastPrevChild.innerText+lastValue;
								lastValue = getSelectedNodeText.trim();
								if (lastValue.length == 1 && lastValue == "") {
									// if (htmlElement.innerHTML.slice(-1) != ">") {
									// 	htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
									// }

									newSpan.innerHTML = lastValue;
								} else {
									// newSpan.innerHTML = lastChild.innerText + lastValue;
									newSpan.innerHTML = getSelectedNodeText ? getSelectedNodeText : lastValue;
								}
								// htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;

								if (checkOperatorText.includes(newSpan.textContent)) {
									// htmlElement.children[
									// 	htmlElement.children.length - 1
									// ].outerHTML = newSpan.outerHTML;
									Object.keys(htmlElement.children).forEach(function (key) {
										getClassId = htmlElement.children[key].getAttribute("dataid");
										if (getClassId == getCurrDataId) {
											htmlElement.children[key].outerHTML = newSpan.outerHTML;
										}
									});
								} else {
									let htmlLength = htmlElement.children.length;
									if(PrevElClass && PrevElClass.length > 0)
									{
										if(removeClassArray.includes(PrevElClass[0]))
										{
											// htmlElement.children[
											// 	htmlElement.children.length - 1
											// ].outerHTML = newSpan.outerHTML;
											Object.keys(htmlElement.children).forEach(function (key) {
												getClassId = htmlElement.children[key].getAttribute("dataid");
												if(getClassId == getCurrDataId)
												{
													htmlElement.children[key].outerHTML = newSpan.outerHTML;
													// getEndPosition = savedCaretPosition.end + 3;
													// placeCursor = false;
													// placeCursorPos = true;
												}
											});
										}else{
											Object.keys(htmlElement.children).forEach(function (key) {
												getClassId = htmlElement.children[key].getAttribute("dataid");
												if (getClassId == getCurrDataId && htmlLength > 1) {
													if(getCurrDataId == "1")
													{
														htmlElement.children[key].outerHTML = newSpan.outerHTML;
														getEndPosition = savedCaretPosition.end;
													}else{
														htmlElement.children[key].outerHTML = ANDString + " " + newSpan.outerHTML;
														getEndPosition = savedCaretPosition.end + 4;
													}
													placeCursor = false;
													placeCursorPos = true;
												} else if (getClassId == getCurrDataId){
													htmlElement.children[key].outerHTML = newSpan.outerHTML;
													getEndPosition = savedCaretPosition.end;
													placeCursor = false;
													placeCursorPos = true;
												}
											});
										}
									} else {
										// htmlElement.children[
										// 	htmlElement.children.length - 1
										// ].outerHTML = ANDString + " " + newSpan.outerHTML;

										Object.keys(htmlElement.children).forEach(function (key) {
											getClassId = htmlElement.children[key].getAttribute("dataid");
											if (getClassId == getCurrDataId) {
												htmlElement.children[key].innerHTML = newSpan.outerHTML;
											}
										});
									}

								}

								// htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
								// htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;
							}

							// let currentTxt = htmlElement.children[htmlElement.children.length - 1].textContent;
							// if (htmlElement.innerHTML.slice(-1) != ">") {
							// 	htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							// 	if(PrevElSibling)
							// 	{
							// 		if(PrevElClass.length > 0 && removeClassArray.includes(PrevElClass[0]))
							// 		{
							// 			htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1]
							// 					.textContent + lastValue;
							// 		}else{
							// 			htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString + " " + htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 		}
							// 	}else{
							// 		htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1]
							// 					.textContent + lastValue;
							// 	}

							// 	// htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1]
							// 	// 				.textContent + lastValue;
							// 	getSearchVal =
							// 		htmlElement.children[htmlElement.children.length - 1]
							// 			.textContent;
							// }else{
							// 	if(PrevElSibling)
							// 	{
							// 		if(PrevElClass.length > 0)
							// 		{
							// 			if(removeClassArray.includes(PrevElClass[0]))
							// 			{
							// 				// htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1]
							// 				// 	.textContent;
							// 				// Object.keys(htmlElement.children).forEach(function (key) {
							// 				// 	let getClassId = htmlElement.children[key].getAttribute("dataid");
							// 				// 	if(getClassId == currDataId)
							// 				// 	{
							// 				// 		htmlElement.children[key].outerHTML = htmlElement.children[key].outerHTML.replace(/<br>/g, "") + newSpan.outerHTML;
							// 				// 	}
							// 				// });
							// 				getEndPosition = savedCaretPosition.end;
							// 				// CaretPositioning.restoreSelection(document.getElementById("textareaDiv"), savedCaretPosition);
							// 				placeCursor = false;
							// 				// setTimeout(() => {

							// 				// 	setCurrentCursorPosition(setPos);
							// 				// }, 0);
							// 				placeCursorPos = true;
							// 			}else{
							// 				if (checkANDValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else if (checkORValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else if (checkNOTValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else{
							// 					if(currentTxt.length > 2)
							// 					{
							// 						htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString + " " + htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 					}else {
							// 						htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 					}
							// 				}
							// 				// htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString + " " + htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 			}

							// 		}else{
							// 			if(currentTxt.length > 1)
							// 			{
							// 				if (checkANDValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else if (checkORValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else if (checkNOTValues.includes(currentTxt)) {
							// 					htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 				}else{
							// 					if(currentTxt.length > 2)
							// 					{
							// 						htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString + " " + htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 					}else {
							// 						htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 					}
							// 				}

							// 			}else{
							// 				htmlElement.children[htmlElement.children.length - 1].outerHTML = htmlElement.children[htmlElement.children.length - 1].outerHTML;
							// 			}
							// 		}
							// 	}

							// 	getSearchVal = htmlElement.children[htmlElement.children.length - 1].textContent;
							// }
							if (htmlElement.innerHTML.slice(-1) != ">") {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							}
						}
					} else if (getChildClassName == "" && detectPaste) {
						if (htmlElement.children.length == 1) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								spanArr;
						} else {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ANDString + " " + spanArr;
						}
						// let getLastIndex = htmlElement.innerHTML.lastIndexOf(pasteContent);
						// let remPasteContent = htmlElement.innerHTML.substring(0,getLastIndex);
						// htmlElement.innerHTML = remPasteContent;
						// htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+spanArr;
					}
				} else {
					if (detectPaste) {
						let splitPasteTxt = pasteContent ? pasteContent.split(" ") : [];

						if (splitPasteTxt && splitPasteTxt.length > 0) {
							let spanArr = "";
							let opFlag = 0;
							let getSplitLen = splitPasteTxt.length;
							splitPasteTxt.map((data, i) => {
								var newSpan = document.createElement("span");
								// add the class to the 'span'
								if (checkANDValues.includes(data)) {
									newSpan.innerHTML = ANDString;
									opFlag = 1;
								} else if (checkORValues.includes(data)) {
									newSpan.innerHTML = ORString;
									opFlag = 1;
								} else if (checkNOTValues.includes(data)) {
									newSpan.innerHTML = NOTString;
									opFlag = 1;
								} else {
									newSpan.setAttribute("class", "pastequery");
									newSpan.innerText = data;
									opFlag = 0;
								}
								if (opFlag == 1) {
									spanArr += newSpan.innerHTML;
								} else {
									spanArr += newSpan.outerHTML;
								}
							});
							htmlElement.innerHTML = spanArr;
						}
					} else {
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = value;
						htmlElement.innerHTML = newSpan.outerHTML;
						htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
							"<br>",
							""
						);
					}
				}

			}

			// trimText = htmlElement.textContent.toString();

			// updateHtmlElement(value);
		}
		var hiddenElems = htmlElement.getElementsByTagName('*');

		for (var i = 0; i < hiddenElems.length; i++) {
			if (hiddenElems[i].innerHTML) {
				hiddenElems[i].innerHTML = hiddenElems[i].innerHTML.trim().replace(/&nbsp;/g, '');
				hiddenElems[i].innerHTML = hiddenElems[i].innerHTML.replace(/\>[\t ]+$/g, ">");
			}
		}

		if (placeCursor) {
			// htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g, "");

			placeCaretAtEnd(htmlElement);
			// setCurrentCursorPosition(savedCaretPosition.end);
		}

		// else{
		// 	setCurrentCursorPosition(savedCaretPosition.end);
		// }
		// setCurrentCursorPosition(savedCaretPosition.end);
		// For Auto complete
		let checkLastThreeVal = getChildText;
		getSearchVal = getChildText.trim();
		let checkCharLen = getChildText.trim().length;

		if (keyCode == 32) {
			searchTerm(null, keyCode);
			setSearchTermPopup(false);
		}
		if (checkCharLen > 2 && keyCode != 32) {
			// Search value not in operator
			if (!checkORValues.includes(getSearchVal) && !checkANDValues.includes(getSearchVal) && !checkNOTValues.includes(getSearchVal)) {
				searchTerm(getSearchVal, keyCode);
			}

		} else if (checkCharLen < 3) {
			setSearchTermPopup(false);
		}

		try {
			let queryTxt = "";
			let prevClass = "";
			let prevClassData = "";
			let nextClass = "";
			let nextClassData = "";
			let splitClass = [];
			let prevKey = 0;
			let nextKey = 0;
			let currKey = 0;
			if (htmlElement.children && htmlElement.children.length > 0) {
				Object.keys(htmlElement.children).forEach(function (key) {
					if (htmlElement.children[key]) {
						getCurrClass = htmlElement.children[key]
							? htmlElement.children[key].attributes.class.value
							: "";
						splitClass = getCurrClass ? getCurrClass.split(" ") : [];
						// To Remove, If Two operator exists between the words
						if (key > 0) {
							prevKey = parseInt(key) - 1;
							nextKey = parseInt(key) + 1;
							prevClassData = htmlElement.children[prevKey]
								? htmlElement.children[prevKey].attributes.class.value
								: "";
							prevClass = prevClassData ? prevClassData.split(" ") : [];
							nextClassData = htmlElement.children[nextKey]
								? htmlElement.children[nextKey].attributes.class.value
								: "";
							nextClass = nextClassData ? nextClassData.split(" ") : [];
						}

						if (
							htmlElement.children[key] &&
							htmlElement.children[key].textContent != ""
						) {
							if (getCurrClass == "autoquery") {
								queryTxt +=
									'"' +
									htmlElement.children[key].id +
									"-" +
									htmlElement.children[key].textContent.trim() +
									'"' +
									" ";
							} else {
								queryTxt += htmlElement.children[key].textContent.trim() + " ";
							}
							htmlElement.children[currKey].setAttribute(
								"dataId",
								parseInt(currKey) + 1
							);
							currKey++;
						} else if (
							splitClass == "query" &&
							htmlElement.children[key] &&
							htmlElement.children[key].textContent == ""
						) {
							// delete htmlElement.children[key];
							htmlElement.children[key].outerHTML = "";
							currKey = key;
							if (prevClass[0] == nextClass[0]) {
								// delete htmlElement.children[prevKey];
								htmlElement.children[prevKey].outerHTML = "";
								currKey = prevKey;
							}
						}
					}
				});
			}
			// Placing Cursor at selected position
			if (placeCursorPos) {
				// setTimeout(() => {
				if (getEndPosition > 0) {
					setCurrentCursorPosition(getEndPosition);
				}
			}
			if (htmlElement.textContent.trim().length == 0) {
				clearParser();
			}

			// htmlElement.children = htmlElement.children.trim();
			setTimeout(() => {
				if (htmlElement.children && htmlElement.children.length > 0) {
					Object.keys(htmlElement.children).forEach(function (key) {
						htmlElement.children[key].setAttribute("dataId", parseInt(key) + 1);
						// htmlElement.children[key].innerHTML = htmlElement.children[key].innerHTML.replace(/<br>/g, "");
					});
					if (document.getElementsByClassName('space') && document.getElementsByClassName('space').length > 0) {
						if (spaceOpacity) {
							document.getElementsByClassName('space')[0].style = 'opacity: 0';
						} else {
							document.getElementsByClassName('space')[0].style = 'opacity: 1';
						}
					}

				}
			}, 0);

			queryTxt.replace(/[()]/g, "");
			// queryTxt = queryTxt.replace('(', ' ').replace(')', '')
			queryTxt = queryTxt.trim();
			var results = lucenequeryparser.parse(queryTxt);

			setQueryParser(JSON.stringify(results));
			results = JSON.stringify(results, undefined, 2);
			results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
			setTestOutput(results);
		} catch (err) {
			// error handling
		}
		// Place Curstor at Last in Textarea
		// placeCaretAtEnd(htmlElement);
	}
	function createRange(node, chars, range) {
		if (!range) {
			range = document.createRange()
			range.selectNode(node);
			range.setStart(node, 0);
		}

		if (chars.count === 0) {
			range.setEnd(node, chars.count);
		} else if (node && chars.count > 0) {
			if (node.nodeType === Node.TEXT_NODE) {
				if (node.textContent.length < chars.count) {
					chars.count -= node.textContent.length;
				} else {
					range.setEnd(node, chars.count);
					chars.count = 0;
				}
			} else {
				for (var lp = 0; lp < node.childNodes.length; lp++) {
					range = createRange(node.childNodes[lp], chars, range);

					if (chars.count === 0) {
						break;
					}
				}
			}
		}

		return range;
	};

	function setCurrentCursorPosition(chars) {
		if (chars >= 0) {
			var selection = window.getSelection();

			var range = createRange(document.getElementById("textareaDiv").parentNode, { count: chars });

			if (range) {
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	};
	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	function updateHtmlElement(value) {
		localStorage.setItem("searchValue", value);
		let htmlElement = document.getElementById("textareaDiv");
		let storageData = localStorage.getItem("searchValue");
		let replaceStr = storageData.replaceAll(" AND", ANDString);
		replaceStr = replaceStr.replaceAll(" OR", ORString);
		replaceStr = replaceStr.replaceAll(" or", ORString);
		replaceStr = replaceStr.replaceAll(" and", ANDString);
		htmlElement.innerHTML = replaceStr;
		// setTimeout(() => {
		placeCaretAtEnd(htmlElement);
		// }, 2000);
	}
	function placeCaretAtEnd(e) {
		const el = document.getElementById("textareaDiv");
		const selection = window.getSelection();
		const range = document.createRange();
		selection.removeAllRanges();
		range.selectNodeContents(el);
		range.collapse(false);
		selection.addRange(range);
		el.focus();
	}

	function getCaretGlobalPosition() {
		const r = document.getSelection().getRangeAt(0);
		const node = r.startContainer;
		const offset = r.startOffset;
		const pageOffset = { x: window.pageXOffset, y: window.pageYOffset };
		let rect, r2;

		if (offset > 0) {
			r2 = document.createRange();
			r2.setStart(node, offset - 1);
			r2.setEnd(node, offset);
			rect = r2.getBoundingClientRect();
			return {
				left: rect.right + pageOffset.x,
				top: rect.bottom + pageOffset.y,
			};
		}
	}
	const selectField = (e, obj) => {
		e.preventDefault();
		let htmlElement = document.getElementById("textareaDiv");
		let getText = htmlElement.textContent || htmlElement.innerText;
		let getLength = getText.length;
		closePopup();
		if (getLength == 1 && getText == "?") {
			htmlElement.innerHTML = obj.key + ":";
		} else {
		}
		placeCaretAtEnd(htmlElement);
	};
	const searchTerm = async (value, keyEvt) => {
		// setTimeout(() => {
		// }, 500);
		setSearchTermPopup(false);
		console.log(keyEvt,'keyEvt');
		let userId = userInfo && userInfo.current_user.gq_user_id;

		let searchParam = `&json_query=${value}&rows=25&ontologies=${ontology}&user_id=${userId}`;
		if(value != "" && value != null)
		{
			const searchRes = await fullTextService.getFullTextSearchTerm(
				history,
				searchParam
			);
			if (searchRes && searchRes.response_status == 0) {
				if (searchRes.response_content.length > 0) {
					setSearchTermData(searchRes.response_content);
					let getXYCoordinates = getCaretGlobalPosition();
	
					if (getXYCoordinates) {
						setTopPosition(getXYCoordinates.top);
						setLeftPosition(getXYCoordinates.left);
					}
					console.log(keyCode,'keyCode');
					
					if (keyCode == 32) {
						setSearchTermPopup(false);
					}else{
						setSearchTermPopup(true);
					}
	
					// setTimeout(() => {
					let htmlElement = document.getElementById("textareaDiv");
					// htmlElement.focus();
	
					placeCaretAtEnd(htmlElement);
					// placeCaretAtEnd(htmlElement);
					// htmlElement.innerHTML.focus();
					// }, 500);
				} else {
					setSearchTermPopup(false);
				}
			}else if(keyEvt == 32)
			{
				setSearchTermPopup(false);
			}
		}else{
			setSearchTermPopup(false);
		}
		
	};
	function placeCaretAtEndTag(el) {
		el.focus();
		if (
			typeof window.getSelection != "undefined" &&
			typeof document.createRange != "undefined"
		) {
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(false);
			textRange.select();
		}
	}
	const selectSearchTerm = (data) => {
		let htmlElement = document.getElementById("textareaDiv");

		let lastChild = htmlElement.children[htmlElement.children.length - 1];
		let lastPrevChild = htmlElement.children[htmlElement.children.length - 2];
		let getChildClass = "",
			getChildClassName = "",
			getChildText = "";
		// let getPrevChildClass='',getPrevChildClassName='',getPrevChildText='';
		if (lastChild && lastChild.attributes.length > 0) {
			getChildClass = lastChild.attributes.class
				? lastChild.attributes.class
				: "";
			getChildClassName = getChildClass ? getChildClass.value : "";
			getChildText = lastChild.textContent;
		} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
			getChildClass = lastPrevChild.attributes.class
				? lastPrevChild.attributes.class
				: "";
			getChildClassName = getChildClass ? getChildClass.value : "";
			getChildText = lastPrevChild.textContent;
		}

		var spaceSpan = document.createElement("span");
		// add the class to the 'span'
		spaceSpan.setAttribute("class", "space");
		var newSpan = document.createElement("span");
		// add the class to the 'span'
		newSpan.setAttribute("class", "autoquery");
		newSpan.setAttribute("id", data.id);
		newSpan.innerHTML = data.term + " ";
		if (lastChild && lastChild.attributes.length > 0) {
			htmlElement.children[htmlElement.children.length - 1].outerHTML =
				newSpan.outerHTML + '&nbsp;';
		} else {
			htmlElement.children[htmlElement.children.length - 2].outerHTML =
				newSpan.outerHTML + '&nbsp;';
		}
		let queryText = htmlElement.textContent;
		let queryTxt = "";
		Object.keys(htmlElement.children).forEach(function (key) {
			let getCurrClass = htmlElement.children[key].attributes.class.value;
			if (htmlElement.children[key].textContent != "") {
				if (getCurrClass == "autoquery") {
					queryTxt +=
						'"' +
						htmlElement.children[key].id +
						"-" +
						htmlElement.children[key].textContent.trim() +
						'"' +
						" ";
				} else {
					queryTxt += htmlElement.children[key].textContent.trim() + " ";
				}
			}
		});
		queryTxt.replace(/[()]/g, "");
		// htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
		placeCaretAtEnd(htmlElement);
		setSearchTermPopup(false);
		try {
			var results = lucenequeryparser.parse(queryTxt);

			setQueryParser(JSON.stringify(results));
			results = JSON.stringify(results, undefined, 2);
			results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
			setTestOutput(results);
		} catch (err) {
			console.log(err, "err");
			// error handling
		}
	};
	const showOntologyCode = (id) => {
		let splitId = id.split(":");
		return splitId[0];
	};
	const clearParser = () => {
		let htmlElement = document.getElementById("textareaDiv");
		htmlElement.innerHTML = "";
	};
	var countKeys = function (obj, key) {
		//define the variable count to return later, set it to 0
		var count = 0;
		//look through the object, if I kind the key in question increment count.
		for (let k in obj) {
			if (k === key) {
				count++;
			}

			//if I find a nested object go into it with my function
			if (typeof obj[k] === "object") {
				//set count to += the return value of calling my function again. do not pass it count becouse i want count inside the recurrsion to start at 0
				//again so when it returns and adds with what I have already I get the right number.
				count += countKeys(obj[k], key);
			}
		}
		//if the loop finds no nest objects return count.
		return count;
	};
	const parseCustomObj = async (parseData, checkRightCount) => {
		// await Promise.all(Object.keys(parseData).forEach(key => {
		//     if(key == 'left' && (parseData[key].quoted_term && parseData[key].quoted_term != ''))
		//     {
		//         let splitTerm = parseData[key].quoted_term.split('-');
		//         parseData[key]['term'] = {
		//             quoted_term:splitTerm[0]
		//         }
		//         parseData[key]['decoration'] = splitTerm[1];
		//     }else if(key == 'right')
		//     {
		//         if(parseData[key].hasOwnProperty('right'))
		//         {
		//             parseCustomObj(parseData[key]['right']);
		//         }
		//         if(parseData[key].hasOwnProperty('left') && (parseData[key].quoted_term && parseData[key].quoted_term != '')){
		//             let splitTerm = parseData[key].quoted_term.split('-');
		//             parseData[key]['term'] = {
		//                 quoted_term:splitTerm[0]
		//             }
		//             parseData[key]['decoration'] = splitTerm[1];
		//         }
		//     }
		// }));

		Object.keys(parseData).forEach(async (key) => {
			if (
				key == "left" &&
				parseData[key].quoted_term &&
				parseData[key].quoted_term != ""
			) {
				let splitTerm = parseData[key].quoted_term.split("-");
				parseData[key]["term"] = {
					quoted_term: splitTerm[0],
				};
				parseData[key]["decoration"] = splitTerm[1];
				delete parseData[key].quoted_term;
			} else if (key == "right") {
				let rightOp = [];
				let getOpObj = "";
				for (let i = 1; i <= checkRightCount; i++) {
					rightOp.push("right");
					getOpObj = rightOp.join(".");
					// Updating the Decoration tag in Object, if Quoted Term Field Exists.
					parseData = await leaf(parseData, getOpObj);
				}
			}
		});
		return parseData;
	};
	async function leaf(obj, path) {
		const pList = path.split(".");
		const key = pList.pop();
		const pointer = pList.reduce((accumulator, currentValue) => {
			if (accumulator[currentValue] === undefined)
				accumulator[currentValue] = {};
			return accumulator[currentValue];
		}, obj);
		let splitTerm = "";
		if (pointer[key]) {
			if (
				pointer[key].hasOwnProperty("left") &&
				pointer[key]["left"].quoted_term &&
				pointer[key]["left"].quoted_term != ""
			) {
				splitTerm = pointer[key]["left"].quoted_term.split("-");
				pointer[key]["left"]["term"] = {
					quoted_term: splitTerm[0],
				};
				pointer[key]["left"]["decoration"] = splitTerm[1];
				delete pointer[key]["left"].quoted_term;
			} else if (pointer[key].quoted_term && pointer[key].quoted_term != "") {
				splitTerm = pointer[key].quoted_term.split("-");
				pointer[key]["term"] = {
					quoted_term: splitTerm[0],
				};
				pointer[key]["decoration"] = splitTerm[1];
				delete pointer[key].quoted_term;
			}
			pointer[key] = pointer[key];
		}

		return obj;
	}

	const searchResult = async (groupingType, pageStart, closeModal) => {
		if (closeModal && closeModal == 'closeModal') {
			setIsConfigureActive(false);
		}
		if (saveFormValue && !formName) {
			setSaveFormError(true);
			return;
		}
		let parseData = JSON.parse(queryParser);
		let checkRightCount = await countKeys(parseData, "right");
		// Parsing Object for Autocomplete search
		let customParseObj = await parseCustomObj(parseData, checkRightCount);
		setTimeout(async () => {
			let parseJsonData = JSON.stringify(customParseObj);
			let searchParam = `&json_query=${parseJsonData}`;

			pageStart >= 0
				? (searchParam += `&start=${pageStart}`)
				: (searchParam += `&start=${searchStartPage}`);
			searchParam += `&rows=${pageCount}`;

			groupingType && groupingType != ('Family' || 'Document')
				? (searchParam += `&grouping=${groupingType}`)
				: (searchParam += `&grouping=${grouping}`);
			if (formName) {
				searchParam += `&template_name=${formName}`
			}

			if (isAuthoritySorting) {
				searchParam += `&Use_authority_sorting=true`;
				let authorityParam = [configure1, configure2, configure3, configure4, configure5].filter(Boolean).join(",");

				searchParam += `&Authorities=${authorityParam}`;
			} else {
				searchParam += `&Use_authority_sorting=false`;
			}

			if (isDateSorting) {
				searchParam += `&Use_date_sorting=true`;
				searchParam += `&Date_sorting_field=${dateSortingField}`
				searchParam += `&Date_sorting_dir=${dateSortingDirection}`
			}

			const searchQueryRes = await fullTextService.getFullTextSearchResult(
				history,
				searchParam
			);
			searchQueryRes &&
				searchQueryRes.response_status == 0 &&
				searchQueryRes.response_content &&
				setDocSearchResult(searchQueryRes.response_content);
		}, 1000);
	};

	function changeGroup(groupingType) {
		setGrouping(groupingType);
		searchResult(groupingType, 0);
	}

	const changePage = async (e, page) => {
		let start, stop;
		if (page) {
			start = page == 1 ? 0 : (page - 1) * pageCount + 1;
			stop = page * pageCount;
			setCurrentPage(page);
			setSearchStartPage(start);
			searchResult(null, start);
			// setSearchStopPage(stop);
		}
	};

	function setFormValue() {
		setSaveFormValue(!saveFormValue);
		setFormName("");
	}

	const handleSaveLater = (e) => {
		const { name, value } = e.target;
		setFormName(value);
		// setSaveFormError(false);
		value ? setSaveFormError(false) : setSaveFormError(true);
	}

	const handleSaveResultAs = (e) => {
		const { name, value } = e.target;
		setSaveResultAs(value);
		// setSaveResultAsError(false);
		value ? setSaveResultAsError(false) : setSaveResultAsError(true);
	}

	const submitSaveResultAs = () => {
		if (!saveResultAs) {
			setSaveResultAsError(true);
		} else {
			//api
		}
	}

	return (
		<div className={classes.grow}>
			<Row>
				<Col md="10" lg="10">
					<p className="loginTitle">{t("fulltext")}</p>
					<div className="form-group" id="searchDiv">
						{/* <TextInput
                            rowsMax="8"
                            rows="8"
                            multiline={true}
                            fullWidth
                            id="fulltext"
                            name="fulltext"
                            label={t('fulltext')}
                            variant="outlined"
                            value={fulltext || ''}
                            // onChange={(e) => setNotes(e.target.value)}
                        /> */}
						{/* <div id="textareaDiv" contentEditable='true' onKeyDown={getKeyCode} onInput={e => callParseQuery(e.target.textContent,e)} tabIndex="0"> */}
						<div
							id="textareaDiv"
							contentEditable="true"
							onPaste={handlePaste}
							//   onKeyPress={getKeyCode}
							onKeyDown={getKeyCode}
							onInput={(e) => callParseQuery(e.target.textContent, e, false)}
							tabIndex="0"
						></div>
						<div
							className={
								"popup-box " + (searchTermPopup ? "d-block" : "d-none")
							}
							style={{ top: topPosition, left: leftPosition }}
							ref={wrapperRef}
						>
							<div className="box">
								{/* <span className="close-icon" onClick={props.handleClose}>x</span> */}
								<ul
									id="megamenu"
									className={"megamenu row " + classes.searchMenuList}
								>
									{searchTermData &&
										searchTermData.length > 0 &&
										searchTermData.map((data, i) => {
											return (
												<li
													key={i}
													className="col-md-12 list-inline"
													onClick={() => selectSearchTerm(data)}
												>
													<span>
														<span
															dataClass="autoList"
															className="border px-0 py-1 col-md-3 align-center float-left"
														>
															{showOntologyCode(data.id)}
														</span>{" "}
														<span
															dataClass="autoList"
															className="float-left col-md-9"
														>
															{data.term}
														</span>
													</span>
												</li>
											);
										})}
								</ul>
							</div>
						</div>
					</div>
					<Row>
						<Col md='4'>
							<CheckBox
								// defaultChecked
								color="primary"
								className={"float-left ml-2"}
								name="saveForm"
								id="saveForm"
								onChange={setFormValue}
								checked={saveFormValue}
							/>
							<label className={"checkBoxContent bodyText cursorPointer float-left ml-0 mr-3"} for="saveForm">{t("SaveFormForlaterUse")}</label>
						</Col>
						<Col md='6'>
							<TextInput
								id="formName"
								name="formName"
								label='Name the form'
								variant="outlined"
								onChange={handleSaveLater}
								fullWidth={true}
								disabled={!saveFormValue}
								value={formName ? formName : ""}
								// manualError={saveFormError}
								error={saveFormError}
								helperText={saveFormError ? t('required') : ""}
							/>
							{/* {saveFormError && <p className={"ManualError"}>{t('required')}</p>} */}
						</Col>
					</Row>

					<div className="form-group">
						<Button
							variant="contained"
							disableRipple={true}
							className={"loginSubmitButton float-right"}
							onClick={() => searchResult(null, null)}
						>
							{t("submit")}
						</Button>
						<Button
							variant="contained"
							disableRipple={true}
							className={"loginSubmitCancel float-right mx-2"}
							onClick={clearParser}
						>
							{t("clear")}
						</Button>
						{/* <div>{ReactHtmlParser(testOutput)}</div> */}
						<Popover
							id={"simple-popover"}
							open={open}
							anchorEl={anchorEl}
							onClose={closePopup}
							anchorReference="anchorPosition"
							anchorPosition={{ top: topPosition, left: leftPosition }}
							anchorOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							className={classes.popverDiv}
						>
							<ul className="megamenu row">
								<li className="col-md-6 list-inline">
									<ul>
										<li className="dropdown-header">
											<b>Text Fields</b>
										</li>
										{Constant.fullTextSearchFields.map((obj, index) => {
											return (
												<li key={index}>
													<a href="#" onClick={(e) => selectField(e, obj)}>
														{obj.value}
													</a>
												</li>
											);
										})}
										<li className="divider"></li>
										<li className="dropdown-header">
											<b>Identification</b>
										</li>
										<li>
											<a href="#">Patent or Publication Number</a>
										</li>
										<li>
											<a href="#">Application Number</a>
										</li>
										<li>
											<a href="#">Patent Kind Code</a>
										</li>
										<li>
											<a href="#">Authority</a>
										</li>
										<li>
											<a href="#">Legal Status</a>
										</li>
										<li>
											<a href="#">Publication Type</a>
										</li>
										<li>
											<a href="#">Publication Language</a>
										</li>
										<li>
											<a href="#">American Invent Act</a>
										</li>
									</ul>
								</li>
								<li className="col-md-6 list-inline">
									<ul>
										<li className="dropdown-header">
											<b>Classification</b>
										</li>
										<li>
											<a href="#">CPC or IPCR Classification</a>
										</li>
										<li>
											<a href="#">CPC Classification</a>
										</li>
										<li>
											<a href="#">IPCR Classification</a>
										</li>
										<li className="divider"></li>
										<li className="dropdown-header">
											<b>Assignees and Inventors</b>
										</li>
										<li>
											<a href="#">All Names</a>
										</li>
										<li>
											<a href="#">Assignee or Applicant (normalized)</a>
										</li>
										<li>
											<a href="#">Assignee or Applicant (full)</a>
										</li>
										<li>
											<a href="#">Inventors</a>
										</li>
										<li className="divider"></li>
										<li className="dropdown-header">
											<b>Dates</b>
										</li>
										<li>
											<a href="#">Filing Date</a>
										</li>
										<li>
											<a href="#">Earliest Priority Date</a>
										</li>
										<li>
											<a href="#">Publication Date</a>
										</li>
										<li>
											<a href="#">GQ Document Added Date</a>
										</li>
										<li>
											<a href="#"> GQ Family Added Date</a>
										</li>
										<li className="divider"></li>
										<li className="dropdown-header">
											<b>Biological Sequences</b>
										</li>
										<li>
											<a href="#">Contains Sequences</a>
										</li>
										<li>
											<a href="#">Nucleotide Sequence Count</a>
										</li>
										<li>
											<a href="#">Protein Sequence Count</a>
										</li>
									</ul>
								</li>
							</ul>
						</Popover>
					</div>
				</Col>
			</Row>

			{/* <Popover
                            id={"autocomplete-popover"}
                            open={searchTermPopup}
                            anchorEl={anchorEl}
                            onClose={closePopup}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: topPosition, left: leftPosition }}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            className={classes.searchTermPopup}
                        >
                            <ul className={"megamenu row "+classes.searchMenuList}>
                                {
                                    searchTermData && searchTermData.length > 0 && searchTermData.map((data, i) =>{
                                        return (
                                            <li key={i} className="col-md-12 list-inline" onClick={()=>selectSearchTerm(data)}>
                                                <span><span className="border px-0 py-1 col-md-3 align-center float-left">{showOntologyCode(data.id)}</span> <span className="float-left col-md-9">{data.term}</span></span>
                                            </li>
                                        )
                                    })
                                }
                                
                            </ul>
                        </Popover> */}
			{docSearchResult && Object.keys(docSearchResult).length > 0 && <div> <p className="subHeading">        <span className="mr-2">Found</span>
				{grouping && grouping == 'Family' && <span onClick={() => { changeGroup('Document') }} className="appLink bold">{docSearchResult && docSearchResult.documents} Documents</span>}
				{
					grouping && grouping == 'Document' && <span>
						{docSearchResult && docSearchResult.documents} Documents
					</span>
				}
				<span className="m-1">/</span>
				{grouping && grouping == 'Document' && <span onClick={() => { changeGroup('Family') }} className="appLink bold">{docSearchResult && docSearchResult.families} Families</span>}
				{
					grouping && grouping == 'Family' && <span>
						{docSearchResult && docSearchResult.families} Families
					</span>
				}
				<span className={"m-2"}>|</span>
				<span className={'appLink'} onClick={() => { setIsConfigureActive(!isConfigureActive) }}>Configure</span>
			</p>
				<div className={'mb-5'}>
					<TextInput
						id="saveResultAs"
						name="saveResultAs"
						label={t('nameYourSearch')}
						variant="outlined"
						onChange={handleSaveResultAs}
						fullWidth={true}
						value={saveResultAs ? saveResultAs : ""}
						// manualError={saveFormError}
						error={saveResultAsError}
						helperText={saveResultAsError ? t('required') : ""}
						className={"w-50"}
					/>
					<Button
						variant="contained"
						disableRipple={true}
						className={"loginSubmitButton ml-3"}
						onClick={submitSaveResultAs}
					>
						{grouping && grouping == 'Document' ? `Save ${docSearchResult && docSearchResult.documents} Documents` : `Save ${docSearchResult && docSearchResult.families} Families`}
					</Button>
				</div>


			</div>
			}

			{docSearchResult && (
				<FullTextResults
					data={docSearchResult}
					fullTextCallBack={changePage}
					currentPage={currentPage}
					pageCount={pageCount}
				/>
			)}
			<Modal
				size="lg"
				show={isConfigureActive}
				// show={true}
				onHide={!isConfigureActive}
				aria-labelledby="example-modal-sizes-title-lg"
			>
				<Modal.Header className={classes.modalHeader}>
					<Link href="#" onClick={(e) => e.preventDefault()} className={"float-right  appTextColor"}><CloseIcon onClick={() => setIsConfigureActive(!isConfigureActive)} /></Link>
				</Modal.Header>
				<Modal.Body className={classes.modalBody}>
					<form name="mergeResultsForm" >
						<h4 className={"subHeading mb-4 " + classes.titleFont}>{t('representativeDocument')}</h4>
						<div className="mb-2">
							<CheckBox
								// defaultChecked
								color="primary"
								className={"float-left ml-2"}
								name="applyPreferredAuthority"
								id="applyPreferredAuthority"
								onChange={() => setIsAuthoritySorting(!isAuthoritySorting)}
								checked={isAuthoritySorting}
							/>
							<label className={"checkBoxContent bodyText cursorPointer ml-0 mr-3"} for="applyPreferredAuthority">{t("applyPreferredAuthority")}</label>
						</div>
						<div className="mb-4">
							{/* {!showConfigure1 &&
						 <TextInput 
						name="configure1"
						value={configure1}
						onFocus={()=>setShowConfigure1(!showConfigure1)}
						onBlur={()=>setShowConfigure1(!showConfigure1)}
						/>
						}  */}
							{/* {showConfigure1 &&  */}
							<SelectBox
								margin="normal"
								variant="outlined"
								name="configure1"
								id="configure1"
								value={configure1}
								items={authorities}
								onChange={(e) => setConfigure1(e.target.value)}
								className={"mr-2 ml-5"}
								disabled={!isAuthoritySorting}
								smallSelectBox={true}
							// onBlur={()=>setShowConfigure1(!showConfigure1)}
							/>
							{/* } */}
							<SelectBox
								margin="normal"
								variant="outlined"
								name="configure2"
								id="configure2"
								value={configure2}
								items={authorities}
								onChange={(e) => setConfigure2(e.target.value)}
								className={"mr-2"}
								disabled={!isAuthoritySorting}
								smallSelectBox={true}
							/>
							<SelectBox
								margin="normal"
								variant="outlined"
								name="configure3"
								id="configure3"
								value={configure3}
								items={authorities}
								onChange={(e) => setConfigure3(e.target.value)}
								className={"mr-2"}
								disabled={!isAuthoritySorting}
								smallSelectBox={true}
							/>
							<SelectBox
								margin="normal"
								variant="outlined"
								name="configure4"
								id="configure4"
								value={configure4}
								items={authorities}
								onChange={(e) => setConfigure4(e.target.value)}
								className={"mr-2"}
								disabled={!isAuthoritySorting}
								smallSelectBox={true}
							/>
							<SelectBox
								margin="normal"
								variant="outlined"
								name="configure5"
								id="configure5"
								value={configure5}
								items={authorities}
								onChange={(e) => setConfigure5(e.target.value)}
								className={"mr-2"}
								disabled={!isAuthoritySorting}
								smallSelectBox={true}
							/>
						</div>
						<div className="mb-4">
							<CheckBox
								// defaultChecked
								color="primary"
								className={"float-left ml-2 mb-5"}
								name="selectDocWith"
								id="selectDocWith"
								onChange={() => setIsDateSorting(!isDateSorting)}
								checked={isDateSorting}
							/>
							<label className={"checkBoxContent bodyText cursorPointer ml-0 mr-3 float-left"} for="selectDocWith">{t("selectDocumentsWith")}</label>
							<SelectBox
								margin="normal"
								variant="outlined"
								name="dateSortingDirection"
								id="dateSortingDirection"
								value={dateSortingDirection}
								items={Constant.dateSortingDirection}
								onChange={(e) => setDateSortingDirection(e.target.value)}
								className={"float-left mr-2 w-25"}
								disabled={!isDateSorting}
							/>
							<SelectBox
								margin="normal"
								variant="outlined"
								name="dateSortingFeld"
								id="dateSortingFeld"
								value={dateSortingField}
								items={Constant.dateSortingField}
								onChange={(e) => setDateSortingField(e.target.value)}
								className={"float-left mr-2 w-25"}
								disabled={!isDateSorting}
							/>
						</div>
						<div className="clear">
							<Button className={"submitButtonClass float-right ml-2"} id="mergeSubmit" onClick={() => searchResult(null, null, 'closeModal')}>{t('apply')}</Button>
							<Button className={"cancelButtonClass float-right"} id="mergeCancel" onClick={() => setIsConfigureActive(!isConfigureActive)}>{t('cancel')}</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>

		</div>
	);
}

export default FullTextSearch;
