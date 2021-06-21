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


async function getSavedSearchData() {

    try {
        let apiurl = "do=gqtemplate.get_all&format=json&context=GqWfIpSearch_launch";
        //  url.authInfoAB;
        // if (workflowId) {
        //     let db = 'db=wf:' + workflowId + '.resdb&parentId='+workflowId;
        //     apiurl = apiurl.replace('db=', db);
        // }
        // showLoader();
        return await get(apiurl)
            .then((response) => {
                // hideLoader();
                // console.log(JSON.stringify(response),"getSavedSearchData getSavedSearchData");
                return response;
            })
            .catch((error) => {
            //   hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
    }

}
const savedsearch = {
    getSavedSearchData
};

export default savedsearch;
