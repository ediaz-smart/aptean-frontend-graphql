import { post, get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import { id } from 'date-fns/locale';
import PubSub from 'pubsub-js';

function showLoader() {
    PubSub.publish('msg', true);
}

function hideLoader() {
    PubSub.publish('msg', false);
}

export async function getSeqSearchInit(history, parentId) {
    try {
        let getUrl = url.seqSearchInit;
        if (parentId) {
            getUrl = getUrl + '&parent_id=' + parentId;
        }
        showLoader();
        return await get(getUrl, history)
            .then((response) => {
                hideLoader();
                // if(response && response.data.response_status == 0)
                // {
                // }else {

                //     let errorMsg = 'Unable to Login';
                //     if(response && typeof response.data.response_content === 'object' && response.data.response_content !== null){
                //         errorMsg = response.data.response_content.message;
                //     }
                //     toast.error(errorMsg);
                // }
                return response;
            })
            .catch((error) => {
                hideLoader();
                toast.error('A');
                console.log("error::", error);

                // return dispatch(loginError(error));
                // dispatch(showMessage({ message: error }));
            });
    } catch (error) {
        console.error(error);
    }

}


export const submitSeqSearch = (data, history, t) => {
    try {
        showLoader();
        return post(url.seqSearchSubmit, data, history)
            .then(async (response) => {
                if (response) {
                    hideLoader();
                    return response;
                }
            })
            .catch((error) => {
                hideLoader();
                toast.error('failed');
                return error
            });
    } catch (error) {
        hideLoader();
    }
};

