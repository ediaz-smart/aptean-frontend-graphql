import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ReactHtmlParser from "react-html-parser";

import Popover from "@material-ui/core/Popover";

import Constant from "../../helpers/constant";
import lucenequeryparser from "../../assets/lib/lucene-query-parser";
import fullTextService from "../../services/fulltextsearch";
import FullTextResults from "./FullTextResults";

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
	const [ontology, setOntology] = React.useState(";GO");
	const [searchTermData, setSearchTermData] = React.useState(null);

	// For Search
	const [grouping, setGrouping] = React.useState("Document");
	const [useDateSort, setUseDateSort] = React.useState(true);
	const [dateSorting, setDateSorting] = React.useState("desc");
	const [dateSortField, setDateSortField] = React.useState("pub_date");
	const [searchStartPage, setSearchStartPage] = React.useState(0);
	const [searchStopPage, setSearchStopPage] = React.useState(50);
	const [authoritySorting, setAuthoritySorting] = React.useState(false);
	const [authorities, setAuthorities] = React.useState("");

	//set result
	const [docSearchResult, setDocSearchResult] = useState({});

	const userInfo = useSelector((state) => state.setUserInfo);

	// To detect outside click for Autocomplete popup
	const wrapperRef = useRef(null);

	const [singleSelections, setSingleSelections] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const pageCount = useSelector((state) => state.setCommon["Paging size"]);

	const openPopup = () => {
		// console.log(event.currentTarget,'event.currentTarget');
		// setAnchorEl(event.currentTarget);
		// console.log(anchorEl,'anchorEl');
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
		if (e.type == "keypress") {
			// For Auto Suggest detect right arrow function
			setKeyPressCode(e.keyCode);
		} else {
			setKeyCode(e.keyCode);
		}
		// setKeyCodeEvent(e);
		let getCurrentSel = window.getSelection();
		setKeyCodeEvent(getCurrentSel);
		console.log(pasteContent, "pasteContent");
		console.log(e.keyCode, "e.type");
		console.log(e, "e...");
		let getClass = [];
		let selElTxt = "";

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

		if (e.keyCode == 8) {
			if (removeClassArray.includes(getClass[0])) {
				e.preventDefault();
			}
			setRightArrowEvent(false);
		} else if (e.keyCode == 39) {
			let htmlElement = document.getElementById("textareaDiv");
			setRightArrowEvent(true);
			// callParseQuery(e.target.textContent, htmlElement, true);
			let postObj = {
				value:e.target.textContent,
				element:htmlElement,
				isRightArrow:true,
				pasteContent:null
			}
			parseQuery(postObj);
		} else {
			setRightArrowEvent(false);
			e.stopPropagation();
		}
	};
	const handlePaste = (e) => {
		console.log(e, "detectpaste");
		console.log(e.clipboardData.getData("Text"), "Text");
		let getPasteTxt = e.clipboardData.getData("Text");
		setPasteContent(getPasteTxt);
		let htmlElement = document.getElementById("textareaDiv");
		let postObj = {
			value:htmlElement.textContent,
			element:htmlElement,
			isRightArrow:false,
			pasteContent:getPasteTxt
		}
		parseQuery(postObj);
		
		
	};
	const callParseQuery = (value, element, isArrowRight) => {
		// setTimeout(() => {
		console.log(element, "onminput");
		let getCurrentSel = window.getSelection();
		// console.log(getCurrentSel,'getCurrentSel1');
		// parseQuery(value, element, isArrowRight);
		let postObj = {
			value:value,
			element,
			isRightArrow:false,
			pasteContent:''
		}
		parseQuery(postObj);

		// }, 50);
	};
	const parseQuery = (data) => {
		// let value = element.target.textContent;
		// console.log(element,'innerHTML');
		let {value,element,isRightArrow} = data;
		console.log(keyCode, "keyCode");
		console.log(value, "value");
		// localStorage.setItem('searchData',value);
		// setFullText(value);
		let getLength = value.length;
		let checkLastChar = value.slice(-1);

		// let htmlElement = document.getElementById("textareaDiv");
		// If Space Enters without any string
		if (keyCode == 32) {
			if (value.length > 1) {
				replaceStringHtml(value, keyCode, isRightArrow);
			} else {
				value = "";
				updateHtmlElement(value);
			}
		} else {
			replaceStringHtml(value, keyCode, isRightArrow);
			// replaceStringHtml(value,keyCode);
		}

		// For Popup open on current pointer position
		// console.log(checkLastChar,'checkLastChar');

		if (checkLastChar == "?") {
			let getXYCoordinates = getCaretGlobalPosition();
			if (getXYCoordinates) {
				setTopPosition(getXYCoordinates.top);
				setLeftPosition(getXYCoordinates.left);
			}
			openPopup(element);
		}
	};

	function replaceStringHtml(value, keyCode, isArrowRight) {
		let getCurrentSel = window.getSelection();
		console.log(getCurrentSel, "getCurrentSel");
		console.log(isArrowRight, "isArrowRight");
		let htmlElement = document.getElementById("textareaDiv");

		console.log(pasteContent, "pasteContent1");
		console.log(detectPaste, "detectPaste");
		console.log(keyPressCode, "keyPressCode");
		let lastValue = value.slice(-1);
		let lastPrevValue = value.charAt(value.length - 2);
		// console.log(lastChildEl,'lastChildEl1');
		console.log(lastValue, "lastValue");
		let lastChild = htmlElement.children[htmlElement.children.length - 1];
		let lastPrevChild = htmlElement.children[htmlElement.children.length - 2];
		let placeCursor = true;
		let spanArr = "";

		// if(lastChild)
		// {
		//     console.log(lastChild,'lastChild');
		//     console.log(lastChild.attributes,'lastChildattributes');
		// }
		let getChildClass = "",
			getChildClassName = "",
			getChildText = "",
			getChildEl = "";
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
		let getSearchVal = getChildText;

		// Removing Common CSS class for functionality
		getChildClassName = getChildClassName.split(" ")[0];
		let checkORValues = ["OR ", "or ", "or", "OR"];
		let checkANDValues = ["AND ", "and ", "and", "AND"];
		let checkNOTValues = ["NOT ", "not ", "not", "NOT"];
		// If Delete event for key 8
		console.log(getChildClassName, "getChildClassName");
		console.log(lastChild && lastChild.attributes, "lastChild.attributes");
		let getSelectedNodeId = "";
		let getSelectedNodeText = "";
		let searchPubArr = ["pu", 'PU', 'Pu', 'pU','pu ','PU ','Pu '];
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
			
			
			if (lastChild && lastChild.attributes.length > 0) {
				if (searchPubArr.includes(getChildText)) {
					htmlElement.children[htmlElement.children.length - 1].outerHTML = pubString;
					placeCaretAtEnd(
						htmlElement.children[htmlElement.children.length - 1]
					); // To Place Cursor in Last
					// Removing Auto Suggest Text from DOM
					if (checkpubelements.length > 0) {
						checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
					}
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}else if(convertLowerPublTxt.startsWith(getChildText)){
					htmlElement.children[htmlElement.children.length - 1].outerHTML = publicationString;
					placeCaretAtEnd(
						htmlElement.children[htmlElement.children.length - 1]
					); // To Place Cursor in Last
					// Removing Auto Suggest Text from DOM
					const elements = document.getElementsByClassName("publication");
					if (checkpubelements.length > 0) {
						checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
					}
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}
			} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
				if (searchPubArr.includes(getChildText)) {
					htmlElement.children[htmlElement.children.length - 2].outerHTML =
						pubString;
					// To Place Cursor in Last
					placeCaretAtEnd(
						htmlElement.children[htmlElement.children.length - 2]
					);
					// Removing Auto Suggest Text from DOM
					if (checkpubelements.length > 0) {
						checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
					}
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}else if(convertLowerPublTxt.startsWith(getChildText)){
					htmlElement.children[htmlElement.children.length - 2].outerHTML = publicationString;
					placeCaretAtEnd(
						htmlElement.children[htmlElement.children.length - 2]
					); // To Place Cursor in Last
					// Removing Auto Suggest Text from DOM
					if (checkpubelements.length > 0) {
						checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
					}
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}
			}
		} else if (keyCode == 32) {
			// If Space Enters
			setSearchTermPopup(false);
			console.log(
				lastPrevValue.trim().length,
				"isEmptyOrSpaces(lastPrevValue)"
			);

			if (lastPrevValue.trim().length > 0) {
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
						if (checkANDValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ANDString;
						} else if (checkORValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ORString;
							// lastChildEl.innerHTML = ORString;
							// console.log(lastChildEl1,'lastChildEl1');
						} else if (checkNOTValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								NOTString;
						} else {
							htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
								"<br>",
								""
							);
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "space");
							newSpan.innerHTML = "";
							htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
							placeCursor = false;
						}
					} else if (getChildClassName == "space") {
						if (checkORValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ORString;
							// lastChildEl.innerHTML = ORString;
							// console.log(lastChildEl1,'lastChildEl1');
						} else if (checkANDValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
								ANDString;
						} else if (checkNOTValues.includes(getChildText)) {
							htmlElement.children[htmlElement.children.length - 1].outerHTML =
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
							// console.log(lastChildEl1,'lastChildEl1');
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
							newSpan.innerHTML = "";
							htmlElement.innerHTML = htmlElement.innerHTML + newSpan.outerHTML;
							placeCursor = false;
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
				console.log(htmlElement, "htmlElement..");
				placeCaretAtEnd(htmlElement);
			} else {
				if (htmlElement.innerHTML.slice(-1) != ">") {
					htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
					// htmlElement.innerHTML = htmlElement.innerHTML.replace(/&nbsp;/g,"");
					htmlElement.innerHTML = htmlElement.innerHTML.replaceAll("<br>", "");
					placeCaretAtEnd(htmlElement);
				}
			}
		} else if (keyCode == 8) {

			if (lastChild && lastChild.attributes.length > 0) {

				if (
					htmlElement.children[htmlElement.children.length - 1].textContent
						.length == 0 ||
					classArray.includes(getChildClassName)
				) {
					// Removing the child span tag if empty text in span
					htmlElement.children[htmlElement.children.length - 1].outerHTML = "";
					setSearchTermPopup(false);
				} else if (
					htmlElement.children[htmlElement.children.length - 1].textContent &&
					searchPubArr.includes(htmlElement.children[htmlElement.children.length - 1].textContent)
				) {
					// htmlElement.children[htmlElement.children.length - 1].outerHTML = pubString;
					let trimText = htmlElement.children[htmlElement.children.length - 1].textContent.trim();
					if (trimText.length == 2) {
						
						// Checking If Already Auto Suggest Text updated in DOM
						if (checkpubelements.length == 0) {
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "pub");
							newSpan.innerHTML = "pub";
							newSpan.setAttribute("style", styleAttr);
							console.log(newSpan, "newSpan11");
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
				}else if (
					htmlElement.children[htmlElement.children.length - 1].textContent &&
					convertLowerPublTxt.startsWith(htmlElement.children[htmlElement.children.length - 1].textContent))
				{
					let trimText = htmlElement.children[htmlElement.children.length - 1].textContent.trim();
					if (trimText.length > 3) {
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
					}else{
						if (checkpubelements.length > 0) {
							checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
						}
						if (checkpublicationelements.length > 0) {
							checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
						}
					}
				}
				else {
					if (checkpubelements.length > 0) {
						checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
					}
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}
			} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
				if (
					htmlElement.children[htmlElement.children.length - 2].textContent
						.length == 0 ||
					classArray.includes(getChildClassName)
				) {
					// Removing the child span tag if empty text in span
					htmlElement.children[htmlElement.children.length - 2].outerHTML = "";
					setSearchTermPopup(false);
				} else if (
					htmlElement.children[htmlElement.children.length - 2].textContent &&
					searchPubArr.includes(htmlElement.children[htmlElement.children.length - 2].textContent)
				) {
					// htmlElement.children[htmlElement.children.length - 1].outerHTML = pubString;

					if (htmlElement.children[htmlElement.children.length - 2].textContent.length == 2) {
						// Checking If Already Auto Suggest Text updated in DOM
						if (checkpubelements.length == 0) {
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "pub");
							newSpan.innerHTML = "pub";
							newSpan.setAttribute("style", styleAttr);
							console.log(newSpan, "newSpan11");
							var div = document.getElementById("textareaDiv");
							insertAfter(div, newSpan);
						} else {
							// Updating Current Position
							checkpubelements[0].style.cssText = styleAttr;
						}
					} else {
						// Removing Auto Suggest Text from DOM
						const pubelements = document.getElementsByClassName("pub");
						if (pubelements.length > 0) {
							pubelements[0].parentNode.removeChild(pubelements[0]);
						}
					}
				}else if (
					htmlElement.children[htmlElement.children.length - 2].textContent &&
					convertLowerPublTxt.startsWith(htmlElement.children[htmlElement.children.length - 2].textContent))
				{
					if (htmlElement.children[htmlElement.children.length - 2].textContent.length > 3) {
						// Checking If Already Auto Suggest Text updated in DOM
						if (checkpublicationelements.length == 0) {
							var newSpan = document.createElement("span");
							newSpan.setAttribute("class", "publication");
							newSpan.innerHTML = "publication_Date";
							newSpan.setAttribute("style", styleAttr);
							var div = document.getElementById("textareaDiv");
							insertAfter(div, newSpan);
						} else {
							// Updating Current Position
							checkpublicationelements[0].style.cssText = styleAttr;
						}
					}
				}else{
					if (checkpublicationelements.length > 0) {
						checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
					}
				}
			}

			if (
				getCurrentSel &&
				getCurrentSel.focusNode &&
				getCurrentSel.focusNode.parentNode
			) {
				if (getCurrentSel.focusNode.parentNode.className) {
					let getClass =
						getCurrentSel.focusNode.parentNode.className.split(" ");
					// let getDataId = getCurrentSel.focusNode.parentNode.attributes.dataid;
					console.log(
						getCurrentSel.focusNode.parentNode.getAttribute("dataid"),
						"getCurrentSel.focusNode.parentNode.attributes2"
					);

					if (removeClassArray.includes(getClass[0])) {
						Object.keys(htmlElement.children).forEach(function (key) {
							let getClassVal =
								htmlElement.children[key].attributes.class.value.split(" ");
							let getClassId = htmlElement.children[key].getAttribute("dataid");
							console.log(getClassId, "getClassId");
							if (getClassId == getCurrentSel.focusNode.parentNode.getAttribute("dataid")) {
								if (getClassVal[0] == "andClass") {
									htmlElement.children[key].outerHTML = ANDString;
									placeCaretAtEnd(htmlElement.children[key]);
								} else if (getClassVal[0] == "orClass") {
									htmlElement.children[key].outerHTML = ORString;
									placeCaretAtEnd(htmlElement.children[key]);
								} else if (getClassVal[0] == "notClass") {
									htmlElement.children[key].outerHTML = NOTString;
									placeCaretAtEnd(htmlElement.children[key]);
								}
							}
						});
					}
				}
			}
			// // Replacing Last Empty Space in Inner Html to edit from the last character if we delete the characters
			// var currentIndex = htmlElement.innerHTML.lastIndexOf("&nbsp;");
			// htmlElement.innerHTML = htmlElement.innerHTML.slice(0, currentIndex) + htmlElement.innerHTML.slice(currentIndex).replace('&nbsp;','');

			// // htmlElement.innerHTML = htmlElement.innerHTML.substring(0, currentIndex) +strReplacedWith+ htmlElement.innerHTML.substring(currentIndex + 1, htmlElement.innerHTML.length);
			// htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
		} else {
			if (value != "") {
				let checkOperatorText = ["and", "AND", "or", "OR", "not", "NOT"];
				if (detectPaste) {
					let splitPasteTxt = pasteContent ? pasteContent.split(" ") : [];
					console.log(splitPasteTxt, "splitPasteTxt");
					if (splitPasteTxt && splitPasteTxt.length > 0) {
						let opFlag = 0;
						let getSplitLen = splitPasteTxt.length;
						console.log(getSplitLen, "getSplitLen");
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
						console.log(spanArr, "spanArr");
					}
				}

				console.log(getChildClassName, "getChildClassName");
				console.log(getSelectedNodeText, "getSelectedNodeText");

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
						}else{
							htmlElement.innerHTML =
							htmlElement.innerHTML + ANDString + " " + newSpan.outerHTML;
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
							if (
								htmlElement.children[htmlElement.children.length - 1]
									.textContent.length == 0
							) {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 1
								].textContent = lastValue;
							} else {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 1
								].textContent =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent + lastValue;
							}
						} else if (
							checkORValues.includes(getChildText) ||
							checkANDValues.includes(getChildText) ||
							checkNOTValues.includes(getChildText)
						) {
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							htmlElement.children[
								htmlElement.children.length - 1
							].textContent =
								htmlElement.children[htmlElement.children.length - 1]
									.textContent + lastValue;
						} else {
							// // Adding AND operator if space enters
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							//create the DOM object
							var newSpan = document.createElement("span");
							// add the class to the 'span'
							newSpan.setAttribute("class", "query");
							// let checkOpText = lastPrevChild.innerText+lastValue;
							if (lastChild.innerText.length == 0) {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);

								newSpan.innerHTML = lastValue;
							} else {
								newSpan.innerHTML = lastChild.innerText + lastValue;
							}
							// htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;

							if (checkOperatorText.includes(newSpan.textContent)) {
								htmlElement.children[
									htmlElement.children.length - 1
								].outerHTML = newSpan.outerHTML;
							} else {
								htmlElement.children[
									htmlElement.children.length - 1
								].outerHTML = ANDString + " " + newSpan.outerHTML;
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
						htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = lastValue;
						htmlElement.innerHTML =
							htmlElement.innerHTML + " " + newSpan.outerHTML;
					} else if (getChildClassName == "pubClass") {
						if (htmlElement.innerHTML.slice(-1) != ">") {
							getSelectedNodeText =
								htmlElement.children[htmlElement.children.length - 1]
									.textContent+lastValue;
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
									console.log(newSpan, "newSpan11");
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
						}else if (
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
									console.log(newSpan, "newSpan11");
									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpublicationelements[0].style.cssText = styleAttr;
								}
							}else{
								// Removing Auto Suggest Text from DOM
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						}
					}else if (getChildClassName == "publicationClass") {
						var getCurrentSelectChild = getCurrentSel.focusNode.parentNode;
						// if(getCurrentSelectChild && getCurrentSelectChild.children.length > 0)
						// {
							
						// }
						
						// htmlElement.children[htmlElement.children.length - 1].outerHTML =
						// 		ANDString + " " + spanArr;
						
					}else if (getChildClassName == "query") {
						let childElId = getChildEl.getAttribute("dataid");
						// console.log(lastElClass,'lastElClass');
						console.log(childElId, "childElId");
						console.log(getChildEl.getAttribute("dataid"), "checkdataid");

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
							getSearchVal =
								htmlElement.children[htmlElement.children.length - 1]
									.textContent;
							console.log(getRemLastStr, "getRemLastStr");
						}
						if (htmlElement.children.length == 1) {
							placeCursor = true;
						} else if (
							getSelectedNodeId != "" &&
							getSelectedNodeId != childElId
						) {
							placeCursor = false;
						} else {
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
							if (htmlElement.innerHTML.slice(-1) != ">") {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 1
								].textContent =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent + lastValue;
								getSelectedNodeText =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent;
							} else {
								getSelectedNodeText =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent;
							}
						}
						console.log(getSelectedNodeText, "getSelectedNodeText");
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
									console.log(newSpan, "newSpan11");
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
						}else if (
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
									console.log(newSpan, "newSpan11");
									var div = document.getElementById("textareaDiv");
									insertAfter(div, newSpan);
								} else {
									// Updating Current Position
									checkpublicationelements[0].style.cssText = styleAttr;
								}
							}else{
								if (checkpubelements.length > 0) {
									checkpubelements[0].parentNode.removeChild(checkpubelements[0]);
								}
								if (checkpublicationelements.length > 0) {
									checkpublicationelements[0].parentNode.removeChild(checkpublicationelements[0]);
								}
							}
						}else {
							console.log(htmlElement.children, "htmlElement.children");
							if (htmlElement.innerHTML.slice(-1) != ">") {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 1
								].textContent =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent + lastValue;
								getSearchVal =
									htmlElement.children[htmlElement.children.length - 1]
										.textContent;
							}else{
								getSearchVal = htmlElement.children[htmlElement.children.length - 1].textContent;
							}
							console.log(htmlElement.children, "htmlElement.children1");
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
				} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
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
							if (
								htmlElement.children[htmlElement.children.length - 2]
									.textContent.length == 0
							) {
								
								newSpan.innerHTML = lastValue;
							} else {
								newSpan.innerHTML = lastChild.innerText + lastValue;
							}
							htmlElement.innerHTML =
								htmlElement.innerHTML + " " + newSpan.outerHTML;
						}else{
							if (lastChild.innerText.length == 0) {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
	
								newSpan.innerHTML = lastValue;
							} else {
								newSpan.innerHTML = lastChild.innerText + lastValue;
							}
							htmlElement.innerHTML =
								htmlElement.innerHTML + ANDString + " " + newSpan.outerHTML;
						}
						
					} else if (getChildClassName == "pastequery") {
						htmlElement.innerHTML = htmlElement.innerHTML.replaceAll(
							"<br>",
							""
						);
						var newSpan = document.createElement("span");
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = lastValue;
						htmlElement.innerHTML =
							htmlElement.innerHTML + ANDString + newSpan.outerHTML;
					} else if (getChildClassName == "space") {
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
							if (
								htmlElement.children[htmlElement.children.length - 2]
									.textContent.length == 0
							) {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 2
								].textContent = lastValue;
							} else {
								htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								htmlElement.children[
									htmlElement.children.length - 2
								].textContent =
									htmlElement.children[htmlElement.children.length - 2]
										.textContent + lastValue;
							}
						} else if (
							checkORValues.includes(getChildText) ||
							checkANDValues.includes(getChildText) ||
							checkNOTValues.includes(getChildText)
						) {
							htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
							htmlElement.children[
								htmlElement.children.length - 2
							].textContent =
								htmlElement.children[htmlElement.children.length - 2]
									.textContent + lastValue;
						} else {
							htmlElement.innerHTML = htmlElement.innerHTML.replace("<br>", "");
							// Adding AND operator if space enters
							
							
							//create the DOM object
							var newSpan = document.createElement("span");
							// add the class to the 'span'
							newSpan.setAttribute("class", "query");
							let checkOpText = lastPrevChild.innerText + lastValue;

							if (lastPrevChild.innerText.length == 0) {
								if (htmlElement.innerHTML.slice(-1) != ">") {
									htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
								}
								newSpan.innerHTML = lastValue;
							} else {
								newSpan.innerHTML = lastPrevChild.innerText + lastValue;
							}
							if (checkOperatorText.includes(newSpan.textContent)) {
								htmlElement.children[
									htmlElement.children.length - 2
								].outerHTML = newSpan.outerHTML;
							} else {
								htmlElement.children[
									htmlElement.children.length - 2
								].outerHTML = ANDString + " " + newSpan.outerHTML;
							}
						}
						htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g, "");
					} else if (
						getChildClassName == "orClass" ||
						getChildClassName == "andClass" ||
						getChildClassName == "notClass" ||
						getChildClassName == "autoquery"
					) {
						htmlElement.innerHTML = htmlElement.innerHTML.slice(0, -1);
						//create the DOM object
						var newSpan = document.createElement("span");
						// add the class to the 'span'
						newSpan.setAttribute("class", "query");
						newSpan.innerHTML = lastValue;
						htmlElement.innerHTML =
							htmlElement.innerHTML + " " + newSpan.outerHTML;
					}
				} else {
					if (detectPaste) {
						let splitPasteTxt = pasteContent ? pasteContent.split(" ") : [];
						console.log(splitPasteTxt, "splitPasteTxt1");

						if (splitPasteTxt && splitPasteTxt.length > 0) {
							let spanArr = "";
							let opFlag = 0;
							let getSplitLen = splitPasteTxt.length;
							console.log(getSplitLen, "getSplitLen");
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
				console.log(placeCursor, "placeCursor");
				if (placeCursor) {
					htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g, "");
					placeCaretAtEnd(htmlElement);
				}
			}

			// trimText = htmlElement.textContent.toString();
			// console.log(trimText,'trimText');

			// updateHtmlElement(value);
		}
		// For Auto complete
		let checkLastThreeVal = getChildText;
		console.log(getSearchVal, "getSearchVal");
		let checkCharLen = getSearchVal.length;

		console.log(checkCharLen, "checkCharLen");
		if (checkCharLen > 2 && keyCode != 32) {
			searchTerm(getSearchVal);
		} else if (checkCharLen < 3) {
			setSearchTermPopup(false);
		}
		try {
			let queryTxt = "";
			let prevClass = "";
			let prevClassData = "";
			let nextClass = "";
			let nextClassData = "";
			let getClass = "";
			let splitClass = [];
			let prevKey = 0;
			let nextKey = 0;
			let currKey = 0;
			Object.keys(htmlElement.children).forEach(function (key) {
				if (htmlElement.children[key]) {
					getClass = htmlElement.children[key]
						? htmlElement.children[key].attributes.class.value
						: "";
					splitClass = getClass ? getClass.split(" ") : [];

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
						if (getClass == "autoquery") {
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
			// htmlElement.children = htmlElement.children.trim();
			setTimeout(() => {
				Object.keys(htmlElement.children).forEach(function (key) {
					htmlElement.children[key].setAttribute("dataId", parseInt(key) + 1);
				});
			}, 100);
			console.log(htmlElement.children, "htmlElement.children");

			queryTxt.replace(/[()]/g, "");
			console.log(htmlElement, "htmlElement");
			// queryTxt = queryTxt.replace('(', ' ').replace(')', '')
			queryTxt = queryTxt.trim();
			console.log(queryTxt, "queryTxt");
			var results = lucenequeryparser.parse(queryTxt);

			setQueryParser(JSON.stringify(results));
			results = JSON.stringify(results, undefined, 2);
			results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
			// console.log(queryParser,'queryParser');
			setTestOutput(results);
		} catch (err) {
			console.log(err, "err");
			// error handling
		}
		// Place Curstor at Last in Textarea
		// placeCaretAtEnd(htmlElement);
	}
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
		console.log(replaceStr, "replaceStr");
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
		console.log(getText, "getText");
		console.log(getLength, "getLength");
		closePopup();
		if (getLength == 1 && getText == "?") {
			htmlElement.innerHTML = obj.key + ":";
		} else {
		}
		placeCaretAtEnd(htmlElement);
	};
	const searchTerm = async (value) => {
		setSearchTermPopup(false);
		let userId = userInfo && userInfo.current_user.gq_user_id;
		let searchParam = `&json_query=${value}&rows=25&ontologies=${ontology}&user_id=${userId}`;
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
				console.log(keyCode, "searchkeycode");
				if (keyCode != 32) {
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
		}

		console.log(searchRes, "searchRes");
	};
	function placeCaretAtEnd(el) {
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
		console.log(data, "data");
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
			console.log("firstchild");
		} else if (lastPrevChild && lastPrevChild.attributes.length > 0) {
			getChildClass = lastPrevChild.attributes.class
				? lastPrevChild.attributes.class
				: "";
			getChildClassName = getChildClass ? getChildClass.value : "";
			getChildText = lastPrevChild.textContent;
			console.log("prevchild");
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
			let getClass = htmlElement.children[key].attributes.class.value;
			if (htmlElement.children[key].textContent != "") {
				if (getClass == "autoquery") {
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
		console.log(queryTxt, "queryTxt1");
		// htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
		placeCaretAtEnd(htmlElement);
		setSearchTermPopup(false);
		console.log(htmlElement, "htmlElementauto");
		try {
			var results = lucenequeryparser.parse(queryTxt);

			setQueryParser(JSON.stringify(results));
			results = JSON.stringify(results, undefined, 2);
			results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
			console.log(queryParser, "queryParser");
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
		console.log("clear");
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
		//     console.log(key, parseData[key]);
		//     if(key == 'left' && (parseData[key].quoted_term && parseData[key].quoted_term != ''))
		//     {
		//         let splitTerm = parseData[key].quoted_term.split('-');
		//         console.log(splitTerm,'splitTerm');
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
		//             console.log(splitTerm,'splitTerm');
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
				// console.log(splitTerm,'splitTerm');
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
					console.log(parseData, "parseData" + i);
				}
			}
		});
		return parseData;
		// console.log(parserDataObj,'parserDataObj');
	};
	async function leaf(obj, path) {
		const pList = path.split(".");
		const key = pList.pop();
		const pointer = pList.reduce((accumulator, currentValue) => {
			if (accumulator[currentValue] === undefined)
				accumulator[currentValue] = {};
			return accumulator[currentValue];
		}, obj);
		console.log(key, "keyyy");
		console.log(pointer[key], "pointer");
		let splitTerm = "";
		if (pointer[key]) {
			if (
				pointer[key].hasOwnProperty("left") &&
				pointer[key]["left"].quoted_term &&
				pointer[key]["left"].quoted_term != ""
			) {
				splitTerm = pointer[key]["left"].quoted_term.split("-");
				// console.log(splitTerm,'splitTerm');
				pointer[key]["left"]["term"] = {
					quoted_term: splitTerm[0],
				};
				pointer[key]["left"]["decoration"] = splitTerm[1];
				delete pointer[key]["left"].quoted_term;
			} else if (pointer[key].quoted_term && pointer[key].quoted_term != "") {
				splitTerm = pointer[key].quoted_term.split("-");
				// console.log(splitTerm,'splitTerm');
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

	const searchResult = async (groupingType, pageStart) => {
		console.log("pagestart", pageStart);
		console.log("searchGroup", groupingType);
		console.log(queryParser, "queryParser");
		let parseData = JSON.parse(queryParser);
		let checkRightCount = await countKeys(parseData, "right");
		// console.log(checkRightCount,'checkRightCount');
		// Parsing Object for Autocomplete search
		let customParseObj = await parseCustomObj(parseData, checkRightCount);
		console.log(customParseObj, "customParseObj");
		setTimeout(async () => {
			let parseJsonData = JSON.stringify(customParseObj);
			console.log(parseJsonData, "parseJsonData");
			let searchParam = `&json_query=${parseJsonData}&use_authority_sorting=${authoritySorting}`;
			if (useDateSort) {
				searchParam += `&date_sorting_field=${dateSortField}`;
				searchParam += `&date_sorting_dir=${dateSorting}`;
				searchParam += `&use_date_sorting=${useDateSort}`;
			}
			pageStart >= 0
				? (searchParam += `&start=${pageStart}`)
				: (searchParam += `&start=${searchStartPage}`);
			searchParam += `&rows=${pageCount}`;
			if (authorities) {
				searchParam += `&authorities=${authorities}`;
			}

			groupingType
				? (searchParam += `&grouping=${groupingType}`)
				: (searchParam += `&grouping=${grouping}`);
			console.log(searchParam, "searchParam");
			const searchQueryRes = await fullTextService.getFullTextSearchResult(
				history,
				searchParam
			);
			searchQueryRes &&
				searchQueryRes.response_status == 0 &&
				searchQueryRes.response_content &&
				setDocSearchResult(searchQueryRes.response_content);
			console.log(searchQueryRes, "searchQueryRes");
		}, 1000);
	};

	function changeGroup(groupingType) {
		setGrouping(groupingType);
		searchResult(groupingType, 0);
	}

	const changePage = async (e, page) => {
		console.log(e, "ee");
		console.log(page, "page");
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
	console.log("grouping", grouping);
	console.log("docSearchResult", docSearchResult);
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
              onKeyPress={getKeyCode}
              onKeyDown={getKeyCode}
              onInput={(e) => callParseQuery(e.target.textContent, e,false)}
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
          <div className="form-group">
            <Button
              variant="contained"
              disableRipple={true}
              className={"loginSubmitButton float-right"}
              onClick={searchResult}
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
      {docSearchResult && Object.keys(docSearchResult).length > 0 && <p className="subHeading">
        <span className="mr-2">Found</span>
        {grouping && grouping == 'Family' && <span onClick={() => { changeGroup('Document') }} className="appLink">{docSearchResult && docSearchResult.documents} Documents</span>}
        {
          grouping && grouping == 'Document' && <span>
            {docSearchResult && docSearchResult.documents} Documents
                       </span>
        }
        <span className="m-1">/</span>
        {grouping && grouping == 'Document' && <span onClick={() => { changeGroup('Family') }} className="appLink">{docSearchResult && docSearchResult.families} Families</span>}
        {
          grouping && grouping == 'Family' && <span>
            {docSearchResult && docSearchResult.families} Families
                       </span>
        }
      </p>}

      {docSearchResult && (
        <FullTextResults
          data={docSearchResult}
          fullTextCallBack={changePage}
          currentPage={currentPage}
          pageCount={pageCount}
        />
      )}
    </div>
  );
}

export default FullTextSearch;
