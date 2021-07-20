import { post, get,getFile } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import PubSub from 'pubsub-js';

function showLoader() {
    PubSub.publish('msg', true);
}

function hideLoader() {
    PubSub.publish('msg', false);
}

async function getSequenceSummary(workflowId) {

    try {
        let apiurl = url.seqWorkflow;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }

}
async function getSequenceShare(workflowId) {

    try {
        let apiurl = url.seqShareInfo;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function getSequenceResultShare(workflowId) {

    try {
        let apiurl = url.seqShareList;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function getSeqAlert(workflowId) {

    try {
        let apiurl = url.seqAlertInfo;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function getSeqTechnical(workflowId) {

    try {
        let apiurl = url.seqTechnicalData;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await getFile(apiurl,'techLog')
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function getAlertRedo(workflowId) {

    try {
        let apiurl = url.getAlertRedos;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function updateSeqNotes(workflowId,updateParam) {

    try {
        let apiurl = url.updateSeqData;
        apiurl = apiurl.replace('WID',workflowId)+updateParam
        // apiurl = apiurl.replace('**',notes)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function downloadQuerySeq(workflowId) {

    try {
        let apiurl = url.downloadQuerySeq;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await getFile(apiurl,'querySeq')
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function updateAlertSettings(workflowId,alertSettingValue) {

    try {
        let apiurl = url.updateAlertSetting;
        apiurl = apiurl.replace('WID',workflowId)
        apiurl = apiurl.replace('**',alertSettingValue)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function removeAlertSettings(workflowId) {

    try {
        let apiurl = url.removeAlert;
        apiurl = apiurl.replace('WID',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function removeResultSharing(postdata) {

    try {

        let apiurl = url.seqRemoveSharee;
        apiurl = apiurl.replace('**',postdata.workflowId)
        apiurl = apiurl.replaceAll('UID',postdata.removeId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function getUserList(workflowId) {

    try {
        let apiurl = url.userList;
        apiurl = apiurl.replace('**',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
async function addResultSharing(postdata) {

    try {
        let apiurl = url.seqAddSharee;
        apiurl = apiurl.replace('**',postdata.workflowId)
        apiurl = apiurl.replaceAll('UID',postdata.userId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
                return response;
            })
            .catch((error) => {
                hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}
const searchResSequence = {
    getSequenceSummary,
    getSequenceShare,
    getSeqAlert,
    getSeqTechnical,
    getAlertRedo,
    updateSeqNotes,
    downloadQuerySeq,
    updateAlertSettings,
    removeAlertSettings,
    addResultSharing,
    removeResultSharing,
    getUserList,
    getSequenceResultShare
};

export default searchResSequence;
