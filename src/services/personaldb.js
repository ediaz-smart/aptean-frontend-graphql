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


async function getPersonalData(homeId) {
    try {
        let apiurl = "do=gqfolder.get_elements_v2&id=" + homeId + "&sort=-create_time&format=json";
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"getSavedSearchData getSavedSearchData");
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
    }
    // do= gqshareable.delete & format= json & id=871 % 2C879 % 2C702 & is_recursive=true
}
async function deletePerData(data, count) {
    console.log(data, "data");
    let apiurl = '';
    try {
        const idData = data.join("%2C");
        if (data && count) {
            if (count === 1) {
                apiurl = 'do=gqshareable.delete&format=json&id=' + data[0] + '%2C&is_recursive=true';

            } else {

                let apiurls = 'do=gqshareable.delete&is_recursive=true&format=json&id=';
                let dataMapping = [];
                // do=gqshareable.delete&format=json&id=' + data[0] + '%2c&is_recursive=true
                data.forEach(item => {
                    console.log(item.type, "type content");
                    //const tempNameCheckVal = item.map.workflow_type && item.map.workflow_type == 'GqWfIpSearch' ? 'GqWfIpSearch_launch' : 'GqWfVMIpSearch_launch';
                    const renamedUrl = item + '%2C';
                    dataMapping.push(renamedUrl);

                });
                let combineUrl = dataMapping.join('');
                apiurl = apiurls + combineUrl;
                console.log(apiurl + combineUrl, "dataMapping dataMapping dataMapping dataMapping dataMapping");

                // template_name[Sequences Search]=GqWfIpSearch_launch
            }


        }
        // apiurl = 'do=gqshareable.delete&format=json&id=' + idData + '&is_recursive=true';
        console.log(apiurl, "apiurl apiurl");
        // let apiurl = 'do=gqtemplate.deletemulti&template_name[hi]=GqWfIpSearch_launch&format=json'
        return await get(apiurl)

            .then((response) => {
                // hideLoader();
                console.log(JSON.stringify(response), "getSavedSearchData getSavedSearchData");
                return response;
            })
            .catch((error) => {
                //   hideLoader();
                // toast.error('Failed to change password');
                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error);
        console.error(error, "errors");
    }
}
async function getUserInfo() {
    try {
        let apiurl = "do=gquser.get_info&format=json";
        return await get(apiurl)
            .then((response) => {
                // hideLoader();
                console.log(JSON.stringify(response), "getSavedSearchData getSavedSearchData");
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


const personaldb = {
    getPersonalData,
    getUserInfo,
    deletePerData

};

export default personaldb;
