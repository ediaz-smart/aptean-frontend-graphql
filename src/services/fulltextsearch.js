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

async function getFullTextSearchTerm(history, searchParam) {
    try {
        let apiurl = url.fullTextSearchTerm+searchParam;
        // showLoader();
        return await get(apiurl, history)
        .then((response) => {
            // hideLoader();
            return response;
        })
        .catch((error) => {
            // hideLoader();
            toast.error('A');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        console.error(error);
    }
   
}
async function getFullTextSearchResult(history, searchParam) {
    try {
        let apiurl = url.fullTextSearchResult+searchParam;
        // showLoader();
        return await get(apiurl, history)
        .then((response) => {
            // hideLoader();
            return response;
        })
        .catch((error) => {
            // hideLoader();
            toast.error('A');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        console.error(error);
    }
   
}
const fullTextService = {
    getFullTextSearchTerm,
    getFullTextSearchResult
};

export default fullTextService;

