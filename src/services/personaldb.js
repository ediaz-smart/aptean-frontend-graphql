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
                    ;
                    //const tempNameCheckVal = item.map.workflow_type && item.map.workflow_type == 'GqWfIpSearch' ? 'GqWfIpSearch_launch' : 'GqWfVMIpSearch_launch';
                    const renamedUrl = item + '%2C';
                    dataMapping.push(renamedUrl);

                });
                let combineUrl = dataMapping.join('');
                apiurl = apiurls + combineUrl;

                // template_name[Sequences Search]=GqWfIpSearch_launch
            }


        }
        // apiurl = 'do=gqshareable.delete&format=json&id=' + idData + '&is_recursive=true';
        // let apiurl = 'do=gqtemplate.deletemulti&template_name[hi]=GqWfIpSearch_launch&format=json'
        return await get(apiurl)

            .then((response) => {
                // hideLoader();
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

async function checkDbName(dbname) {
    try {
        let apiurl = "do=gqfetch.physical_seqdb_exists&seqdb_locale=L&text_label=" + dbname + "&format=json";
        return await get(apiurl)
            .then((response) => {
                // hideLoader();
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

async function postfile(urlParam, formData) {
    try {

        return await post(urlParam, formData, null)              //post files services
            .then((response) => {
                console.log("postresponse :", response);
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
    }

}

async function uploadRecieve(file, files, dbname, frmt, seqType) {
    try {


        let apiurl = "do=gqupload.receive&file=" + file + "&files=" + files +
            "&next_step=gqfetch.create_channel&desc=Upload%2520Annotated%2520Sequences&seq_type=" + seqType + "&seq_format=" + frmt +
            "&file_type=ANNOTATED_SEQUENCES&text_label=" + dbname + "&format=json";

        apiurl = encodeURI(apiurl);
        if (frmt == "embl+") {
            apiurl = apiurl.replace("embl+", "embl%2B");

        }


        showLoader();

        console.log(apiurl, "recvurl");
        return await get(apiurl)
            .then((response) => {
                console.log("reciveresponse :", response);
                hideLoader();
                return response;
            })
            .catch((error) => {

                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
    }

}

async function channelCreate(file, dbname) {
    try {
        let apiurl = "do=gqfetch.create_channel&file=" + file + "&text_label=" + dbname + "&format=json";
        apiurl = encodeURI(apiurl);

        console.log(apiurl, "createchannelurl");
        return await get(apiurl)
            .then((response) => {
                console.log("channelcreate :", response);
                return response;
            })
            .catch((error) => {

                console.log("error::", error);

            });
    } catch (error) {
        toast.error(error.response_content.message);
        console.error(error, "errors");
    }

}

async function channelStatus(file, content) {
    try {
        let apiurl = "do=gqfetch.check_channel_creation_status&file=" + file + "&content_channel=" + content + "&format=json";
        showLoader();

        apiurl = encodeURI(apiurl);

        console.log(apiurl, "ststusurl");
        return await get(apiurl)
            .then((response) => {

                console.log("statusresponse :", response);
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
    }

}


const personaldb = {
    getPersonalData,
    getUserInfo,
    deletePerData,
    checkDbName,
    postfile,
    uploadRecieve,
    channelCreate,
    channelStatus

};

export default personaldb;
