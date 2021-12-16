import { url } from "../reducers/url";
import { Fragment } from "react";
import ProgressBar from "../shared/ProgressBar/Progress";
import { format } from "date-fns";
import InfoIcon from "@material-ui/icons/Info";
import RedoIcon from "@material-ui/icons/Redo";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import Constant from "../helpers/constant";
import { toast } from 'react-toastify';

export const TOAST_TYPE = {
  ERROR: 0,
  SUCCESS: 1,
  INFO: 2
}
async function mostRecentResCalculation(data, pagetype) {
  try {
    let tempArr = [];
    let resultData;
    if (pagetype == "searchfolder") {
      resultData = data.response_content.results;
    } else {
      resultData = data.response_content;
    }
    resultData.forEach((datas) => {
      let tempObj = datas;
      let id = datas.id;
      tempObj["date"] = datas.date
        ? format(new Date(datas.date), "dd-MMM-yyyy")
        : null;
      const regex = /Fulltext/i;
      if (datas.type !== null && datas.type !== "") {
        const found = datas.type.match(regex);
        if (found && found.length > 0) {
          type = "Documents";
        }
      } else {
        datas.type = " ";
      }
      let type = "Alignments";

      let mostRecentTypeUrl = url.mostRecentTypeUrl;
      mostRecentTypeUrl = mostRecentTypeUrl.replace("**", id);
      let typeUrl = process.env.REACT_APP_BASE_URL + mostRecentTypeUrl;
      if (datas.type != "") {
        if (datas.type !== "GqFolder") {
          if (datas.status == "STILL_RUNNING") {
            tempObj["results"] = <ProgressBar datas={datas} />;
          } else if (datas.status == "FAILED") {
            tempObj["results"] = (
              <a
                href="#"
                className={datas.status == "FAILED" ? "failedIconColor" : ""}
                onClick={(e) => e.preventDefault()}
              >
                Search Failed
              </a>
            );
          } else {
            tempObj["results"] = (
              <a href={typeUrl} target="_blank" rel="noreferrer">
                {datas.results} {type}
              </a>
            );
          }
        } else {
          tempObj["results"] = (
            <a href="#" onClick={(e) => e.preventDefault()}>
              Empty
            </a>
          );
        }
      } else {
        tempObj["results"] = (
          <a href="#" onClick={(e) => e.preventDefault()}>
            Empty
          </a>
        );
      }

      let mostRecentClassicUrl = url.mostRecentClassicUrl;
      mostRecentClassicUrl = mostRecentClassicUrl.replace("**", id);
      let classicLink = process.env.REACT_APP_API_URL + mostRecentClassicUrl;
      if (datas.status == "FAILED") {
        tempObj["report"] = "";
      } else {
        if (datas.type != "" && datas.status != "STILL_RUNNING") {
          if (datas.type == "GqWfABIpSearch") {
            let mostRecentReportUrl = url.mostRecentReportUrl;
            mostRecentReportUrl = mostRecentReportUrl.replace("**", id);
            let reportLink =
              process.env.REACT_APP_BASE_URL + mostRecentReportUrl;
            tempObj["report"] = (
              <Fragment>
                <a href={reportLink} target="_blank" rel="noreferrer">
                  Report
                </a>
                <span className="mx-2">|</span>
                <a href={classicLink} target="_blank" rel="noreferrer">
                  Classic
                </a>
              </Fragment>
            );
          } else if (datas.type !== "GqFolder") {
            tempObj["report"] = (
              <Fragment>
                <a href={classicLink} target="_blank" rel="noreferrer">
                  Classic
                </a>
              </Fragment>
            );
          } else {
            tempObj["report"] = "";
          }
        } else {
          tempObj["report"] = "";
        }
      }
      tempObj["type"] = Constant["searchType"][datas.type]
        ? Constant["searchType"][datas.type]
        : datas.type;
      if (pagetype === "searchmanagement" || pagetype === "searchfolder") {
        tempObj["info"] = (
          <Fragment>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <InfoIcon
                className={
                  "mr-2 appLink pe-none " +
                  (datas.status == "FAILED" ? "failedIconColor" : "")
                }
              />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <RedoIcon className="mr-2 appLink" />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <AccessAlarmIcon className="appLink" />
            </a>
          </Fragment>
        );
      }
      tempArr.push(tempObj);
    });
    return tempArr;
  } catch (error) {
    console.error(error);
  }
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function restrictCharacter(event) {
  var key = window.event ? event.keyCode : event.which;
  if (key == 8 || key == 46 || key == 37 || key == 39) {
    return true;
  } else if (key < 48 || key > 57 || key == 110 || key == 190) {
    event.preventDefault();
    return false;
  }
}

const showToast = (toastType, data, toastRef, autoCloseObject) => {
  if (!toast.isActive(toastRef.current)) {
    toastRef.current = (toastType === TOAST_TYPE.ERROR) ? toast.error(data, autoCloseObject)
      : (toastType === TOAST_TYPE.INFO) ? toast.info(data, autoCloseObject)
        : (toastType === TOAST_TYPE.SUCCESS) ? toast.success(data, autoCloseObject) : null;
  }
}

const UtilsService = {
  mostRecentResCalculation,
  numberWithCommas,
  restrictCharacter,
  showToast
};

export default UtilsService;
