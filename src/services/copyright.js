import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import PubSub from 'pubsub-js';

function showLoader() {
	PubSub.publish('msg', true);
}

function hideLoader() {
	PubSub.publish('msg', false);
}
async function getCopyright() {
    try {
        // showLoader();
        return await get(url.copyright)
        .then((response) => {
            // hideLoader();
            if(response && response.response_content)
            {
                return response.response_content;
            }else {
                return response;
            }
            
        })
        .catch((error) => {
            toast.error('Failed to retrieve copyright info');
            // console.log(JSON.stringify(response));
            console.log("error::", error);

        });
    } catch (error) {
        console.error(error);
    }
   
}

const CopyrightService = {
    getCopyright
};

export default CopyrightService;