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
            // let apiurl = 'do=gqtemplate.get_all_ft&format=json&context[]=GqWfIpSearch_launch&context[]=GqWfVMIpSearch_launch';
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
    async function deleteSavedTemplate(data,count)
    {
        try {
            let apiurl = '';
            if(data && count)
            {
                if(count == 1)
                {
                    const templateName = data.name;
                    const templateType = data.map && data.map.workflow_type ? data.map.workflow_type : 'GqWfIpSearch';
                    let apiurl = 'do=gqtemplate.delete&context='+templateType+'_launch&template_name='+templateName+'&format=json';

                }else{
                    
                }
                  console.log(data,"GqWfIpSearch_launch GqWfIpSearch_launch GqWfIpSearch_launch GqWfIpSearch_launch");
                  console.log(count,"count count count count count");

            }
            // let apiurl = 'do=gqtemplate.deletemulti&template_name[hi]=GqWfIpSearch_launch&format=json'
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

    // http://localhost/GQ/query?do=gqtemplate.deletemulti&template_name[hi]=GqWfIpSearch_launch&template_name[hello]=GqWfIpSearch_launch&format=json&template_name[data]=GqWfIpSearch_launch
    // let apiurl = 'do=gqtemplate.delete&context=GqWfIpSearch_launch&template_name=tempo&format=json';

const savedsearch = {
    getSavedSearchData,
    deleteSavedTemplate
};

export default savedsearch;
