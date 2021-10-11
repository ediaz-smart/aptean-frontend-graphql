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

async function shareableList(workflowId) {

    try {

        let apiurl = url.shareableList;
        apiurl = apiurl.replace(':id:', workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                return response;
            })
            .catch((error) => {
                hideLoader();
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}

async function addAccess(itemId, usrs) {

    try {

        let apiurl = url.addAccess;
        apiurl = apiurl.replace(':id:', itemId);
        apiurl = apiurl.replaceAll(':usr:', usrs);
        apiurl = apiurl.replaceAll(':acl:', 'read');
       
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

async function removeAccess(id, usrs) {

    try {

        let apiurl = url.removeAccess;
        apiurl = apiurl.replace(':id:', id)

        //usrs = multiIdString(usrs);
        apiurl = apiurl.replaceAll(':usr:', usrs)
       
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

async function removeAll(postdata) {

    try {

        let apiurl = url.removeAll;
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

async function sharedWithMe(workflowId) {

    try {

        let apiurl = url.sharedWith;
        apiurl = apiurl.replace(':id:',workflowId)
       
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                return response;
            })
            .catch((error) => {
                hideLoader();
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
        hideLoader();
    }
}

function multiIdString(ray){
    let str = "";
    ray.forEach(element => {
        str+= element+",";
    });


    return str;
}


const ftAccess = {
    shareableList,
    addAccess,
    removeAccess,
    removeAll,
    sharedWithMe,

};

export default ftAccess;