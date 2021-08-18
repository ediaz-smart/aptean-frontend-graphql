import { post,get } from '../helpers/fetchServicesMethods';
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

async function getSearchResults(history, start, stop) {
    try {
        showLoader();
        let urlParam = url.searchResult;
        if(start && stop) {
            urlParam = `${urlParam}&start=${start}&stop=${stop}`
        }
        return await get(urlParam,history)
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
            toast.error('A');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        console.error(error);
    }
   
}
async function getSearchResultsStatus(id) {
    try {
        let urlParam = url.searchResultStatus+'&workflow=id:'+id;
        return await get(urlParam)
        .then((response) => {
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
            //toast.error('A');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        console.error(error);
    }
   
}

async function getSearchCount(id) {
    try {
        showLoader();
        let urlParam = url.getSearchCount+'&id='+id;
        return await get(urlParam)
        .then((response) => {
            hideLoader();
            console.log('recentCountResult', response)
            return response;
        })
        .catch((error) => {
            console.log("error::", error);
        });
    } catch (error) {
        console.error(error);
    }
   
}
const HomeService = {
    getSearchResults,
    getSearchResultsStatus,
    getSearchCount
};

export default HomeService;