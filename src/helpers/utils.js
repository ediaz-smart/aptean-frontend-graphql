import { url } from '../reducers/url';
import { Fragment } from "react";
import ProgressBar from '../shared/ProgressBar/Progress';
import { format } from 'date-fns';
import InfoIcon from '@material-ui/icons/Info';
import RedoIcon from '@material-ui/icons/Redo';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Constant from '../helpers/constant';

async function mostRecentResCalculation(data,pagetype) {
    try {
        let tempArr = [];
        let resultData;
        if(pagetype == 'searchfolder')
        {
            resultData = data.response_content.results;
        }else {
            resultData = data.response_content;
        }
        resultData.forEach(datas => {
            let tempObj = datas;
            let id = datas.id;
            tempObj['date'] = datas.date ? format(new Date(datas.date), 'dd-MMM-yyyy') : null;
            const regex = /Fulltext/i;
            if(datas.type !== null && datas.type !== '')
            {
                const found = datas.type.match(regex);
                if(found && found.length >0){
                    type = 'Documents';
                }
            }else{
                datas.type = ' ' 
            }
            let type = 'Alignments';
            
            let mostRecentTypeUrl = url.mostRecentTypeUrl
            mostRecentTypeUrl = mostRecentTypeUrl.replace('**', id);
            let typeUrl = process.env.REACT_APP_BASE_URL+mostRecentTypeUrl;
            if(datas.type != '')
            {
                if(datas.type !== 'GqFolder')
                {
                    if(datas.status == 'STILL_RUNNING')
                    {
                        tempObj['results'] = <ProgressBar datas={datas} />
                    }
                    else if(datas.status == 'FAILED'){
                        tempObj['results'] = datas.status
                    }
                    else {
                        tempObj['results'] = <a href={typeUrl} target="_blank">{datas.results} {type}</a>
                    }
                }else{
                    tempObj['results'] = <a href="#" onClick={(e)=>e.preventDefault()}>Empty</a>;
                }
            }else {
                tempObj['results'] = <a href="#" onClick={(e)=>e.preventDefault()}>Empty</a>;
            }
            
            let mostRecentClassicUrl = url.mostRecentClassicUrl
            mostRecentClassicUrl = mostRecentClassicUrl.replace('**', id);
            let classicLink = process.env.REACT_APP_API_URL+mostRecentClassicUrl
            if(datas.status == 'FAILED')
            {
                tempObj["report"] = '';
            }else{
                if(datas.type != '')
                {
                    if(datas.type == "GqWfABIpSearch")
                    {
                        let mostRecentReportUrl = url.mostRecentReportUrl
                        mostRecentReportUrl = mostRecentReportUrl.replace('**', id);
                        let reportLink = process.env.REACT_APP_BASE_URL+mostRecentReportUrl
                        tempObj["report"] = <Fragment><a href={reportLink} target="_blank">Report</a>
                                            <span className="mx-2">|</span>
                                            <a href={classicLink} target="_blank">Classic</a>
                                            </Fragment>
                    }else if(datas.type !== "GqFolder"){
                        tempObj["report"] = <Fragment>
                                            <a href={classicLink} target="_blank">Classic</a>
                                            </Fragment>
                    }else {
                        tempObj["report"] = '';
                    }
                }else {
                    tempObj["report"] = '';
                }
            }
            tempObj['type'] = Constant['searchType'][datas.type] ? Constant['searchType'][datas.type]: datas.type;

            if(pagetype === "searchmanagement" || pagetype === "searchfolder")
            {
                tempObj["info"] = <Fragment>
                                    <InfoIcon className="mr-2 appLinkColor"/>
                                    <RedoIcon className="mr-2 appLinkColor" />
                                    <AccessAlarmIcon className="appLinkColor" />
                                </Fragment>
            }
            tempArr.push(tempObj);
        })
        return tempArr;
    } catch (error) {
        console.error(error);
    }
   
}

const UtilsService = {
    mostRecentResCalculation
};

export default UtilsService;