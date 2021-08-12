import React, { useState, useEffect,useRef } from "react";
import { useHistory,useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ReactHtmlParser from 'react-html-parser';


import Popover from '@material-ui/core/Popover';


import Constant from '../../helpers/constant';
import lucenequeryparser from '../../assets/lib/lucene-query-parser';
import fullTextService from '../../services/fulltextsearch';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: "96%",
        margin: "0 auto 28px",
        minHeight: "500px",
        borderBottom: "1px solid #cec7c7",
        padding: "23px 0 5px",
    },
    popverDiv:{
        // height:'500px',
        // overflowX:'scroll'
    },
    searchTermPopup:{
        width:'40%'
    },
    searchMenuList:{
        padding:'20px !important'
    }
    
}));
let ANDString = '<span class="andClass opClass">AND</span>';
let ORString = '<span class="orClass opClass">OR</span> ';
let NOTString = '<span class="notClass opClass">NOT</span> ';
let SpaceString = '<span class="space"> </span>';
let queryString = '<span class="query"></span>';
function FullTextSearch() {
    const { t, i18n } = useTranslation("common");
    const classes = useStyles();
    const history = useHistory();
    const [fulltext,setFullText] = useState();
    const [testOutput,setTestOutput] = useState();
    const [queryParser,setQueryParser] = useState({});

    // For Popup
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setopen] = React.useState(false);
    const [topPosition,setTopPosition] = useState(220);
    const [leftPosition,setLeftPosition] = useState(65);
    const [keyCode, setKeyCode] = React.useState(null);

    // For Auto Complete Search
    const [searchTermPopup, setSearchTermPopup] = React.useState(false);
    const [ontology, setOntology] = React.useState(';GO');
    const [searchTermData, setSearchTermData] = React.useState(null);

    // For Search
    const [grouping,setGrouping] = React.useState('Document');
    const [useDateSort,setUseDateSort] = React.useState(true);
    const [dateSorting,setDateSorting] = React.useState('desc');
    const [dateSortField,setDateSortField] = React.useState('pub_date');
    const [searchStartPage,setSearchStartPage] = React.useState(0);
    const [searchStopPage,setSearchStopPage] = React.useState(50);
    const [authoritySorting,setAuthoritySorting] = React.useState(false);
    const [authorities,setAuthorities] = React.useState('');


    const userInfo = useSelector(state => state.setUserInfo);

    // To detect outside click for Autocomplete popup
	const wrapperRef = useRef(null);

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

    const handleClickOutside = event => {
        
        if(event.target.id != "megamenu")
        {
            // Delay some seconds to get popup value before close
            setTimeout(() => {
                // we already define dataclass attr to megamenu list, if outside of any event will close the popup
                if(event.target.attributes.dataclass == undefined)
                {
                    setSearchTermPopup(false);
                }
            }, 100);
        }
	};
    const getKeyCode = (e)=>{
        setKeyCode(e.keyCode)
    }
    
    const parseQuery = (value,element) =>{
        // let value = element.target.textContent;
        console.log(element,'innerHTML');
        
        console.log(keyCode,'keyCode');
        console.log(value,'value');
        // localStorage.setItem('searchData',value);
        // setFullText(value);
        let getLength = value.length;
        let checkLastChar = value.slice(-1);
        
        
        // let htmlElement = document.getElementById("textareaDiv");
        // If Space Enters without any string
        if(keyCode == 32)
        {
            if(value.length > 1)
            {
                replaceStringHtml(value,keyCode,element);
                
            }else {
                value="";
                updateHtmlElement(value);
            }
        }else {
            replaceStringHtml(value,keyCode,element);
            // replaceStringHtml(value,keyCode);
        }
        
        // For Popup open on current pointer position
        // console.log(checkLastChar,'checkLastChar');
        
        

        if(checkLastChar == "?")
        {
            let getXYCoordinates = getCaretGlobalPosition();
            if(getXYCoordinates)
            {
                setTopPosition(getXYCoordinates.top);
                setLeftPosition(getXYCoordinates.left);
            }
            openPopup(element);
        }
        
        
        
    }
    
    function replaceStringHtml(value,keyCode,element){

        console.log(value,'value');
        let htmlElement = document.getElementById("textareaDiv");
        // console.log(htmlElement,'htmlElement');
        let lastValue = value.slice(-1);
        let lastPrevValue = value.charAt(value.length-2);
        // console.log(lastChildEl,'lastChildEl1');
        console.log(lastValue,'lastValue');
        console.log(htmlElement.children,'children');
        let lastChild = htmlElement.children[htmlElement.children.length - 1];
        let lastPrevChild = htmlElement.children[htmlElement.children.length - 2];
        
        // if(lastChild)
        // {
        //     console.log(lastChild,'lastChild');
        //     console.log(lastChild.attributes,'lastChildattributes');
        // }
        let getChildClass='',getChildClassName='',getChildText='';
        // let getPrevChildClass='',getPrevChildClassName='',getPrevChildText='';
        if(lastChild && lastChild.attributes.length > 0)
        {
            getChildClass = lastChild.attributes.class ? lastChild.attributes.class:'';
            getChildClassName = getChildClass ? getChildClass.value:'';
            getChildText = lastChild.textContent;
            console.log('firstchild',getChildText);
            console.log('lastChild',lastChild);
        }
        else if(lastPrevChild && lastPrevChild.attributes.length > 0)
        {
            getChildClass = lastPrevChild.attributes.class ? lastPrevChild.attributes.class:'';
            getChildClassName = getChildClass ? getChildClass.value:'';
            getChildText = lastPrevChild.textContent;
            console.log('prevchild',getChildText);
            console.log('lastPrevChild',lastPrevChild);
        }
        let checkLastThreeVal = getChildText+lastValue;
        // For Auto complete
        if(checkLastThreeVal.length > 2)
        {
            searchTerm(checkLastThreeVal);
        }
        // Removing Common CSS class for functionality
        getChildClassName = getChildClassName.split(" ")[0];
        console.log(getChildClassName,'getChildClassName');
        console.log(getChildText,'getChildText');
        let checkORValues = ['OR ','or ','or','OR','o','O'];
        let checkANDValues = ['AND ','and ','and','AND','a','A'];
        let checkNOTValues = ['NOT ','not ','not','NOT','n','N'];
        // If Delete event for key 8
        // If Space Enters
        if(keyCode == 32)
        {
            console.log(lastPrevValue.trim().length,'isEmptyOrSpaces(lastPrevValue)')
           
                if(lastPrevValue.trim().length > 0)
                {
                    
                    if(lastChild && lastChild.attributes.length > 0)
                    {
                        if(getChildClassName == "autoquery")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                            var newSpan = document.createElement('span');
                            newSpan.setAttribute('class', 'space');
                            newSpan.innerHTML = "";
                            htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                        }
                        else if(getChildClassName == "query")
                        {
                            if(checkANDValues.includes(getChildText))
                            {
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString;
                            }else if(checkORValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = ORString
                                // lastChildEl.innerHTML = ORString;
                                // console.log(lastChildEl1,'lastChildEl1');
                            }else if(checkNOTValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = NOTString;
                            }else {
                                htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                                var newSpan = document.createElement('span');
                                newSpan.setAttribute('class', 'space');
                                newSpan.innerHTML = "";
                                htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                            }
                            
                        }else if(getChildClassName == "space"){
                            if(checkORValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = ORString
                                // lastChildEl.innerHTML = ORString;
                                // console.log(lastChildEl1,'lastChildEl1');
                            }else if(checkANDValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString;
                            }else if(checkNOTValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = NOTString;
                            }else {
                                // // Adding AND operator if space enters
                                // htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                //create the DOM object
                                var newSpan = document.createElement('span');
                                // add the class to the 'span'
                                newSpan.setAttribute('class', 'query');
                                newSpan.innerHTML = htmlElement.children[htmlElement.children.length - 1].textContent.trimRight();
                                // newSpan.textContent = htmlElement.children[htmlElement.children.length - 1].textContent.trimRight();
                                htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;
                                htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
                                htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
                            }
                            
                        }
                    }else if(lastPrevChild && lastPrevChild.attributes.length > 0){
                        
                        if(getChildClassName == "space")
                        {
                            if(checkORValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = ORString
                                // lastChildEl.innerHTML = ORString;
                                // console.log(lastChildEl1,'lastChildEl1');
                            }else if(checkANDValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = ANDString;
                            }else if(checkNOTValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = NOTString;
                            }else {
                                // // Adding AND operator if space enters
                                // htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                //create the DOM object
                                var newSpan = document.createElement('span');
                                // add the class to the 'span'
                                newSpan.setAttribute('class', 'query');
                                newSpan.innerHTML = htmlElement.children[htmlElement.children.length - 2].textContent.trimRight();
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = ANDString+' '+newSpan.outerHTML;
                                htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
                                htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
                            }
                        }else if(getChildClassName == "query")
                        {
                            if(checkANDValues.includes(getChildText))
                            {
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = ANDString;
                            }else if(checkORValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = ORString
                            }else if(checkNOTValues.includes(getChildText)){
                                htmlElement.children[htmlElement.children.length - 2].outerHTML = NOTString;
                            }else {
                                htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                                var newSpan = document.createElement('span');
                                newSpan.setAttribute('class', 'space');
                                newSpan.innerHTML = "";
                                htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                            }
                        }
                    }
                    else {
                        // if(lastChildEl.tagName != "BR")
                        // {
                            htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                            var newSpan = document.createElement('span');
                            newSpan.setAttribute('class', 'space');
                            newSpan.innerHTML = "";
                            htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                            htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                        // }               
                    }
                    
                    placeCaretAtEnd(htmlElement);
                }else {
                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                    htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
                    placeCaretAtEnd(htmlElement);
                }
        
            
        }
        else if(keyCode == 8)
        {
            let classArray = ['andClass','orClass','notClass','autoquery']
            if(lastChild && lastChild.attributes.length > 0)
            {
                
                if((htmlElement.children[htmlElement.children.length - 1].textContent.length == 0) || (classArray.includes(getChildClassName))){
                    htmlElement.children[htmlElement.children.length - 1].outerHTML = '';
                    setSearchTermPopup(false);
                }
            }else if(lastPrevChild && lastPrevChild.attributes.length > 0){
                if((htmlElement.children[htmlElement.children.length - 2].textContent.length == 0) || (classArray.includes(getChildClassName))){
                    htmlElement.children[htmlElement.children.length - 2].outerHTML = '';
                    setSearchTermPopup(false);
                }
            }
            
            // Replacing Last Empty Space in Inner Html to edit from the last character if we delete the characters
            var currentIndex = htmlElement.innerHTML.lastIndexOf("&nbsp;");
            htmlElement.innerHTML = htmlElement.innerHTML.slice(0, currentIndex) + htmlElement.innerHTML.slice(currentIndex).replace('&nbsp;','');

            
            // htmlElement.innerHTML = htmlElement.innerHTML.substring(0, currentIndex) +strReplacedWith+ htmlElement.innerHTML.substring(currentIndex + 1, htmlElement.innerHTML.length);
            htmlElement.innerHTML = htmlElement.innerHTML.trimRight();
            placeCaretAtEnd(htmlElement);
        }    
        else {
            if(value != "")
            {
                let checkOperatorText = ['and','AND','or','OR','not','NOT'];
                    if(lastChild && lastChild.attributes.length > 0)
                    {
                        if(getChildClassName == "autoquery")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                            var newSpan = document.createElement('span');
                            newSpan.setAttribute('class', 'query');
                            newSpan.innerHTML = lastValue;
                            if(lastChild.innerText.length == 0)
                            {
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                
                                newSpan.innerHTML = lastValue;
                            }else {
                                newSpan.innerHTML = lastChild.innerText+lastValue;
                            }
                            htmlElement.innerHTML = htmlElement.innerHTML+ANDString+' '+newSpan.outerHTML;
                        }
                        else if(getChildClassName == "space")
                        {
                            if((lastValue == "o" || lastValue == "O") || (lastValue == "a" || lastValue == "A") || (lastValue == "n" || lastValue == "N"))
                            {
                                if(htmlElement.children[htmlElement.children.length - 1].textContent.length == 0)
                                {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    htmlElement.children[htmlElement.children.length - 1].textContent = lastValue;
                                }else {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;        
                                }
                                
                            }else if(checkORValues.includes(getChildText) || checkANDValues.includes(getChildText) || checkNOTValues.includes(getChildText)){
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;    
                            }else {
                                // // Adding AND operator if space enters
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                //create the DOM object
                                var newSpan = document.createElement('span');
                                // add the class to the 'span'
                                newSpan.setAttribute('class', 'query');
                                // let checkOpText = lastPrevChild.innerText+lastValue;
                                if(lastChild.innerText.length == 0)
                                {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    
                                    newSpan.innerHTML = lastValue;
                                }else {
                                    newSpan.innerHTML = lastChild.innerText+lastValue;
                                }
                                // htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;
                                
                                if(checkOperatorText.includes(newSpan.textContent))
                                {
                                    htmlElement.children[htmlElement.children.length - 1].outerHTML = newSpan.outerHTML;
                                }else {
                                    htmlElement.children[htmlElement.children.length - 1].outerHTML = ANDString+' '+newSpan.outerHTML;
                                }

                                // htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                // htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;
                            }
                            htmlElement.innerHTML = htmlElement.innerHTML.replace('<br>',"");
                        }else if(getChildClassName == "orClass" || getChildClassName == "andClass" || getChildClassName == "notClass" || getChildClassName == "autoquery")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                            //create the DOM object
                            var newSpan = document.createElement('span');
                            // add the class to the 'span'
                            newSpan.setAttribute('class', 'query');
                            newSpan.innerHTML = lastValue;
                            htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                        }
                        else if(getChildClassName == "query")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                            htmlElement.children[htmlElement.children.length - 1].textContent = htmlElement.children[htmlElement.children.length - 1].textContent+lastValue;
                        }
                    }else if(lastPrevChild && lastPrevChild.attributes.length > 0){
                        if(getChildClassName == "autoquery")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                            var newSpan = document.createElement('span');
                            newSpan.setAttribute('class', 'query');
                            newSpan.innerHTML = lastValue;
                            if(lastChild.innerText.length == 0)
                            {
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                
                                newSpan.innerHTML = lastValue;
                            }else {
                                newSpan.innerHTML = lastChild.innerText+lastValue;
                            }
                            htmlElement.innerHTML = htmlElement.innerHTML+ANDString+' '+newSpan.outerHTML;
                        }else if(getChildClassName == "space")
                        {
                            if((lastValue == "o" || lastValue == "O") || (lastValue == "a" || lastValue == "A") || (lastValue == "n" || lastValue == "N"))
                            {
                                if(htmlElement.children[htmlElement.children.length - 2].textContent.length == 0)
                                {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    htmlElement.children[htmlElement.children.length - 2].textContent = lastValue;
                                }else {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    htmlElement.children[htmlElement.children.length - 2].textContent = htmlElement.children[htmlElement.children.length - 2].textContent+lastValue;        
                                }
                            }else if(checkORValues.includes(getChildText) || checkANDValues.includes(getChildText) || checkNOTValues.includes(getChildText)){
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                htmlElement.children[htmlElement.children.length - 2].textContent = htmlElement.children[htmlElement.children.length - 2].textContent+lastValue;    
                            }else {
                                // Adding AND operator if space enters
                                htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                //create the DOM object
                                var newSpan = document.createElement('span');
                                // add the class to the 'span'
                                newSpan.setAttribute('class', 'query');
                                let checkOpText = lastPrevChild.innerText+lastValue;
                                
                                if(lastPrevChild.innerText.length == 0)
                                {
                                    htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                                    
                                    newSpan.innerHTML = lastValue;
                                }else {
                                    newSpan.innerHTML = lastPrevChild.innerText+lastValue;
                                }
                                if(checkOperatorText.includes(newSpan.textContent))
                                {
                                    htmlElement.children[htmlElement.children.length - 2].outerHTML = newSpan.outerHTML;
                                }else {
                                    htmlElement.children[htmlElement.children.length - 2].outerHTML = ANDString+' '+newSpan.outerHTML;
                                }

                            }
                            htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
                        }
                        else if(getChildClassName == "orClass" || getChildClassName == "andClass"  || getChildClassName == "notClass" || getChildClassName == "autoquery")
                        {
                            htmlElement.innerHTML = htmlElement.innerHTML.slice(0,-1);
                            //create the DOM object
                            var newSpan = document.createElement('span');
                            // add the class to the 'span'
                            newSpan.setAttribute('class', 'query');
                            newSpan.innerHTML = lastValue;
                            htmlElement.innerHTML = htmlElement.innerHTML+newSpan.outerHTML;
                        }
                    }else {
                        //create the DOM object
                        var newSpan = document.createElement('span');
                        // add the class to the 'span'
                        newSpan.setAttribute('class', 'query');
                        newSpan.innerHTML = value;
                        htmlElement.innerHTML = newSpan.outerHTML;
                        htmlElement.innerHTML = htmlElement.innerHTML.replaceAll('<br>','');
                    }
                
            }
            htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
            placeCaretAtEnd(htmlElement);
            // trimText = htmlElement.textContent.toString();
            // console.log(trimText,'trimText');
            
            
            
            
            
            // updateHtmlElement(value);
        }
        try {
            console.log(htmlElement,'htmlElement');
            var results = lucenequeryparser.parse(htmlElement.textContent);

            
            setQueryParser(JSON.stringify(results));
            results = JSON.stringify(results, undefined, 2);
            results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
            console.log(queryParser,'queryParser');
            setTestOutput(results)
          
        } catch (err) {
            console.log(err,'err')
            // error handling
          
        }
        // Place Curstor at Last in Textarea
        // placeCaretAtEnd(htmlElement);
        
        
    }
    function updateHtmlElement(value){
        localStorage.setItem('searchValue',value);
        let htmlElement = document.getElementById("textareaDiv");
        let storageData = localStorage.getItem('searchValue');
        let replaceStr = storageData.replaceAll(' AND',ANDString);
        replaceStr = replaceStr.replaceAll(' OR',ORString);
        replaceStr = replaceStr.replaceAll(' or',ORString);
        replaceStr = replaceStr.replaceAll(' and',ANDString);
        console.log(replaceStr,'replaceStr');
        htmlElement.innerHTML = replaceStr;
        // setTimeout(() => {
            placeCaretAtEnd(htmlElement);
        // }, 2000);
        
        
    }
    function placeCaretAtEnd(e) {
        const el = document.getElementById('textareaDiv');  
        const selection = window.getSelection();  
        const range = document.createRange();  
        selection.removeAllRanges();  
        range.selectNodeContents(el);  
        range.collapse(false);  
        selection.addRange(range);  
        el.focus();
    }

    function getCaretGlobalPosition(){
        const r = document.getSelection().getRangeAt(0)
        const node = r.startContainer
        const offset = r.startOffset
        const pageOffset = {x:window.pageXOffset, y:window.pageYOffset}
        let rect,  r2;
    
        if (offset > 0) {
            r2 = document.createRange()
            r2.setStart(node, (offset - 1))
            r2.setEnd(node, offset)
            rect = r2.getBoundingClientRect()
            return { left:rect.right + pageOffset.x, top:rect.bottom + pageOffset.y }
        }
    }
    const selectField= (e,obj)=>{
        e.preventDefault();
        let htmlElement = document.getElementById("textareaDiv");
        let getText = htmlElement.textContent || htmlElement.innerText;
        let getLength = getText.length;
        console.log(getText,'getText');
        console.log(getLength,'getLength');
        closePopup();
        if(getLength == 1 && getText == '?')
        {
            htmlElement.innerHTML = obj.key+':';
            
        }else {

        }
        placeCaretAtEnd(htmlElement);
        
    }
    const searchTerm = async (value)=>{
        let userId=userInfo && userInfo.current_user.gq_user_id;
        let searchParam = `&json_query=${value}&rows=25&ontologies=${ontology}&user_id=${userId}`;
        const searchRes = await fullTextService.getFullTextSearchTerm(history,searchParam);
        if(searchRes && searchRes.response_status == 0){
            if(searchRes.response_content.length > 0)
            {
                setSearchTermData(searchRes.response_content);
                let getXYCoordinates = getCaretGlobalPosition();
                let top = getXYCoordinates.top;
                if(getXYCoordinates)
                {
                    setTopPosition(top);
                    setLeftPosition(getXYCoordinates.left);
                }
                setSearchTermPopup(true);
                // setTimeout(() => {
                    let htmlElement = document.getElementById("textareaDiv");
                    // htmlElement.focus();
                    
                    placeCaretAtEnd(htmlElement);
                    // placeCaretAtEnd(htmlElement);
                    // htmlElement.innerHTML.focus();
                // }, 500);
                
            }
        }
        
        console.log(searchRes,'searchRes');
    }
    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
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
    const selectSearchTerm=(data)=>{
        console.log(data,'data');
        let htmlElement = document.getElementById("textareaDiv");
        let lastChild = htmlElement.children[htmlElement.children.length - 1];
        let lastPrevChild = htmlElement.children[htmlElement.children.length - 2];
        let getChildClass='',getChildClassName='',getChildText='';
        // let getPrevChildClass='',getPrevChildClassName='',getPrevChildText='';
        if(lastChild && lastChild.attributes.length > 0)
        {
            getChildClass = lastChild.attributes.class ? lastChild.attributes.class:'';
            getChildClassName = getChildClass ? getChildClass.value:'';
            getChildText = lastChild.textContent;
            console.log('firstchild');
        }
        else if(lastPrevChild && lastPrevChild.attributes.length > 0)
        {
            getChildClass = lastPrevChild.attributes.class ? lastPrevChild.attributes.class:'';
            getChildClassName = getChildClass ? getChildClass.value:'';
            getChildText = lastPrevChild.textContent;
            console.log('prevchild');
        }
        var spaceSpan = document.createElement('span');
        // add the class to the 'span'
        spaceSpan.setAttribute('class', 'space');
        var newSpan = document.createElement('span');
        // add the class to the 'span'
        newSpan.setAttribute('class', 'autoquery');
        newSpan.innerHTML = data.term+' ';
        if(lastChild && lastChild.attributes.length > 0)
        {
            htmlElement.children[htmlElement.children.length - 1].outerHTML = newSpan.outerHTML+spaceSpan.outerHTML;
        }else {
            htmlElement.children[htmlElement.children.length - 2].outerHTML = newSpan.outerHTML+spaceSpan.outerHTML;
        }
        // htmlElement.innerHTML = htmlElement.innerHTML.replace(/<br>/g,"");
        placeCaretAtEnd(htmlElement);
        setSearchTermPopup(false);
        console.log(htmlElement,'htmlElementauto');
    }
    const showOntologyCode=(id)=>{
        let splitId = id.split(':');
        return splitId[0];
    }
    const clearParser=()=>{
        console.log('clear');
        let htmlElement = document.getElementById("textareaDiv");
        htmlElement.innerHTML = '';
    }
    const searchResult=async()=>{
        console.log(queryParser,'queryParser');
        let searchParam = `&json_query=${queryParser}&use_authority_sorting=${authoritySorting}`;
        if(useDateSort)
        {
            searchParam += `&date_sorting_field=${dateSortField}`;
            searchParam += `&date_sorting_dir=${dateSorting}`;
            searchParam += `&use_date_sorting=${useDateSort}`;
        }
        searchParam += `&start=${searchStartPage}`;
        searchParam += `&rows=${searchStopPage}`;
        if(authorities)
        {
            searchParam += `&authorities=${authorities}`;
        }
        searchParam += `&grouping=${grouping}`;
        console.log(searchParam,'searchParam');
        const searchQueryRes = await fullTextService.getFullTextSearchResult(history,searchParam);
        console.log(searchQueryRes,'searchQueryRes');
    }
    return (
        <div className={classes.grow}>
            <Row>
                <Col md="10" lg="10">
                    <p className="loginTitle">{t('fulltext')}</p>
                    <div className="form-group">
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
                        <div id="textareaDiv" contentEditable='true' onKeyDown={getKeyCode} onInput={e => parseQuery(e.target.textContent,e)}>
                        
                        </div>
                        <div className={"popup-box "+(searchTermPopup ? 'd-block':'d-none')} style={{top: topPosition, left: leftPosition}} ref={wrapperRef}>
                            <div className="box">
                                {/* <span className="close-icon" onClick={props.handleClose}>x</span> */}
                                <ul id="megamenu" className={"megamenu row "+classes.searchMenuList}>
                                            {
                                                searchTermData && searchTermData.length > 0 && searchTermData.map((data, i) =>{
                                                    return (
                                                        <li key={i} className="col-md-12 list-inline" onClick={()=>selectSearchTerm(data)}>
                                                            <span><span dataClass="autoList" className="border px-0 py-1 col-md-3 align-center float-left">{showOntologyCode(data.id)}</span> <span dataClass="autoList" className="float-left col-md-9">{data.term}</span></span>
                                                        </li>
                                                    )
                                                })
                                            }
                                            
                                        </ul>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <Button variant="contained" disableRipple={true} className={'loginSubmitButton float-right'} onClick={searchResult}>{t('submit')}</Button>
                        <Button variant="contained" disableRipple={true} className={'loginSubmitCancel float-right mx-2'} onClick={clearParser}>{t('clear')}</Button>
                        <div>{ReactHtmlParser(testOutput)}</div>
                        <Popover
                            id={"simple-popover"}
                            open={open}
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
                            className={classes.popverDiv}
                        >
                            <ul className="megamenu row">
                                <li className="col-md-6 list-inline">
                                <ul>
                                    <li className="dropdown-header"><b>Text Fields</b></li>
                                    {
                                        Constant.fullTextSearchFields.map((obj, index) => {
                                            return <li key={index}><a href="#" onClick={(e)=>selectField(e,obj)}>{obj.value}</a></li>
                                        })
                                    }
                                    <li className="divider"></li>
                                    <li className="dropdown-header"><b>Identification</b></li>
                                    <li><a href="#">Patent or Publication Number</a></li>
                                    <li><a href="#">Application Number</a></li>
                                    <li><a href="#">Patent Kind Code</a></li>
                                    <li><a href="#">Authority</a></li>
                                    <li><a href="#">Legal Status</a></li>
                                    <li><a href="#">Publication Type</a></li>
                                    <li><a href="#">Publication Language</a></li>
                                    <li><a href="#">American Invent Act</a></li>
                                </ul>
                                </li>
                                <li className="col-md-6 list-inline">
                                <ul>
                                    <li className="dropdown-header"><b>Classification</b></li>
                                    <li><a href="#">CPC or IPCR Classification</a></li>
                                    <li><a href="#">CPC Classification</a></li>
                                    <li><a href="#">IPCR Classification</a></li>
                                    <li className="divider"></li>
                                    <li className="dropdown-header"><b>Assignees and Inventors</b></li>
                                    <li><a href="#">All Names</a></li>
                                    <li><a href="#">Assignee or Applicant (normalized)</a></li>
                                    <li><a href="#">Assignee or Applicant (full)</a></li>
                                    <li><a href="#">Inventors</a></li>
                                    <li className="divider"></li>
                                    <li className="dropdown-header"><b>Dates</b></li>
                                    <li><a href="#">Filing Date</a></li>
                                    <li><a href="#">Earliest Priority Date</a></li>
                                    <li><a href="#">Publication Date</a></li>
                                    <li><a href="#">GQ Document Added Date</a></li>
                                    <li><a href="#"> GQ Family Added Date</a></li>
                                    <li className="divider"></li>
                                    <li className="dropdown-header"><b>Biological Sequences</b></li>
                                    <li><a href="#">Contains Sequences</a></li>
                                    <li><a href="#">Nucleotide Sequence Count</a></li>
                                    <li><a href="#">Protein Sequence Count</a></li>
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
        </div>
        
    );
}

export default FullTextSearch;
