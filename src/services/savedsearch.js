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
            // let apiurl = "do=gqtemplate.get_all&format=json&context=GqWfIpSearch_launch";
            let apiurl = 'do=gqtemplate.get_all_ft&format=json&context[]=GqWfVMIpSearch_launch&context[]=GqWfIpSearch_launch';
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
    async function getParticularTemplate(tempName,type)
    {
        let apiurl ;
        try {
            
            if(type == 'Sequence')
            {
                 apiurl = 'do=gqtemplate.get&context=GqWfIpSearch_launch&template_name='+tempName+'&format=json';

            }
            else{
                apiurl = 'do=gqtemplate.get&context=GqWfVMIpSearch_launch&template_name='+tempName+'&format=json';

            }

            return await get(apiurl)
                .then((response) => {
                    // hideLoader();
                    console.log(JSON.stringify(response),"getParticularTemplate getParticularTemplate");
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
        let apiurl = '';
        try {
           
            if(data && count)
            {
                 if(count === 1)
                {
                    const templateName = data[0].name;
                    const templateType = data[0].map && data[0].map.workflow_type ? data[0].map.workflow_type : 'GqWfIpSearch';
                   
                     apiurl = 'do=gqtemplate.delete&context='+templateType+'_launch&template_name='+templateName+'&format=json';

                }else{
                    let apiurls = 'do=gqtemplate.deletemulti&format=json&';
                    let dataMapping = [];
                    data.forEach(item =>{
                        console.log(item.type,"type content");
                        const tempNameCheckVal = item.map.workflow_type && item.map.workflow_type == 'GqWfIpSearch' ? 'GqWfIpSearch_launch' : 'GqWfVMIpSearch_launch';
                        const renamedUrl = 'template_name['+item.name+']='+item.type;
                        dataMapping.push(renamedUrl);
                      
                    });
                    let combineUrl = dataMapping.join('&');
                     apiurl = apiurls+combineUrl;
                    console.log(apiurl+combineUrl,"dataMapping dataMapping dataMapping dataMapping dataMapping");


                    // template_name[Sequences Search]=GqWfIpSearch_launch
                }
                  

            }
            console.log(apiurl,"apiurl apiurl");
            // let apiurl = 'do=gqtemplate.deletemulti&template_name[hi]=GqWfIpSearch_launch&format=json'
            return await get(apiurl)

                .then((response) => {
                    // hideLoader();
                    console.log(JSON.stringify(response),"getSavedSearchData getSavedSearchData");
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
    deleteSavedTemplate,
    getParticularTemplate,

};

export default savedsearch;
