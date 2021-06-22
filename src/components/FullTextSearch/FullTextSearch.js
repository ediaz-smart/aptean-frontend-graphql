import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ReactHtmlParser from 'react-html-parser';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';


import Constant from '../../helpers/constant';
import TextInput from '../../shared/Fields/TextInput';
import lucenequeryparser from '../../assets/lib/lucene-query-parser';


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
    }
    
}));

function FullTextSearch() {
    const { t, i18n } = useTranslation("common");
    const classes = useStyles();
    const [fulltext,setFullText] = useState();
    const [testOutput,setTestOutput] = useState();

    // For Popup
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setopen] = React.useState(false);
    const [topPosition,setTopPosition] = useState(220);
    const [leftPosition,setLeftPosition] = useState(65);

    const openPopup = () => {
        // console.log(event.currentTarget,'event.currentTarget');
        // setAnchorEl(event.currentTarget);
        // console.log(anchorEl,'anchorEl');
        setopen(true);
    };

    const closePopup = () => {
        setAnchorEl(null);
        setopen(false);
        let htmlElement = document.getElementById("textareaDiv");
        placeCaretAtEnd(htmlElement);
    };
    // const open = Boolean(anchorEl);
    // const id = open ? 'simple-popover' : undefined;

    // reset login status
    useEffect(async () => {
        //dispatch(userActions.logout());
    }, []);
    const parseQuery = (value,element) =>{
        // console.log(element.currentTarget.offsetLeft,'pageX');
        // For Popup open on current pointer position
        let getXYCoordinates = getCaretGlobalPosition();
        if(getXYCoordinates)
        {
            setTopPosition(getXYCoordinates.top);
            setLeftPosition(getXYCoordinates.left);
        }
        // console.log(coor,'coor');
        
        // localStorage.setItem('searchData',value);
        // setFullText(value);
        let checkLastChar = value.slice(-1);
        if(checkLastChar == "?")
        {
            openPopup(element);
        }
        
        // Replacing AND OR with text function
        replaceANDORString(value);
        
        var results = lucenequeryparser.parse(value);
        results = JSON.stringify(results, undefined, 2);
        results = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
        setTestOutput(results)
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
    function replaceANDORString(value){
        let checkAnd,checkAndStr = '';
        let checkOr,checkOrStr = '';
        checkAnd = value.slice(-3);
        checkOr = value.slice(-2);

        // value = value.slice(-3);
        let getLength = value.length;
        let getRemString = '';
        let checkANDValues = ['AND','and','And','anD','ANd','aNd'];
        let checkORValues = ['OR','or','Or','oR'];
        let ANDString = ' <span class="operatorClass">AND</span>';
        let ORString = ' <span class="operatorClass">OR</span>';
        let htmlElement = document.getElementById("textareaDiv");
        if(checkANDValues.includes(checkAnd))
        {
            getLength = getLength - 3;
            let checkAndSpace = " ";
            if(getLength > 0)
            {
                checkAndStr = value.slice(-4);
                checkAndSpace = checkAndStr.charAt(0);
            }
            
            // console.log(checkAndSpace,'checkAndSpace');
            if(checkAndSpace == " ")
            {
                
                getRemString = value.substring(0, getLength);
                if(getRemString)
                {
                    let storageValue = getRemString+'AND';
                    localStorage.setItem('searchValue',storageValue);

                    let storageData = localStorage.getItem('searchValue');
                    let replaceStr = storageData.replaceAll(' AND',ANDString);
                    replaceStr = replaceStr.replaceAll(' OR',ORString);
                    replaceStr = replaceStr.replaceAll(' or',ORString);
                    replaceStr = replaceStr.replaceAll(' and',ANDString);
                    htmlElement.innerHTML = replaceStr;
                }else {
                    htmlElement.innerHTML = '';
                    htmlElement.innerHTML = ANDString;
                }
                placeCaretAtEnd(htmlElement);
                
                // localStorage.setItem('searchValue',value);
            }
        }else if(checkORValues.includes(checkOr))
        {
            getLength = getLength - 2;
            checkOrStr = value.slice(-3);
            let checkORSpace = checkOrStr.charAt(0);
            if(checkORSpace == " ")
            {
                
                getRemString = value.substring(0, getLength);
                if(getRemString)
                {
                    let storageValue = getRemString+'OR';
                    localStorage.setItem('searchValue',storageValue);

                    let storageData = localStorage.getItem('searchValue');
                    let replaceStr = storageData.replaceAll(' AND',ANDString);
                    replaceStr = replaceStr.replaceAll(' OR',ORString);
                    replaceStr = replaceStr.replaceAll(' or',ORString);
                    replaceStr = replaceStr.replaceAll(' and',ANDString);
                    htmlElement.innerHTML = replaceStr;
                }else {
                    htmlElement.innerHTML = '';
                    htmlElement.innerHTML = ORString;
                }
                placeCaretAtEnd(htmlElement);
                
                // localStorage.setItem('searchValue',value);
            }
        }
    }
    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            
            range.selectNodeContents(el);
            range.collapse(false);
            console.log(range,'range');
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
            console.log(textRange,'textRange');
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
            console.log(htmlElement,'obj');
            htmlElement.innerHTML = obj.key+':';
            
        }
        placeCaretAtEnd(htmlElement);
        
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
                        <div id="textareaDiv" contentEditable='true' onInput={e => parseQuery(e.currentTarget.textContent,e)}>
                        
                        </div>
                        <div>{ReactHtmlParser(testOutput)}</div>
                        <Button aria-describedby={"simple-popover"} variant="contained" color="primary" onClick={openPopup}>
                            Open Popover
                        </Button>
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
        </div>
    );
}

export default FullTextSearch;
