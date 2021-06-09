import { post, get } from '../helpers/fetchServicesMethods';
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
const searchResSequence = {
    getSequenceSummary,
    getSequenceShare
};

export default searchResSequence;
