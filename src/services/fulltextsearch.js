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

async function getFullTextSearchTerm(history, searchParam) {
    try {
        let apiurl = url.fullTextSearchTerm + searchParam;
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
        let apiurl = url.fullTextSearchResult + searchParam;
        showLoader();
        return await get(apiurl, history)
            .then((response) => {
                hideLoader();
                if(response && response.response_status == 0 && response.response_content && response.response_content.status == 500){
                    toast.error('Something went wrong');
                }
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

async function fullDocViewService(history, searchParam) {
    try {
        let apiurl = `${url.fullDocView}&patent_number=${searchParam}`;
        showLoader();
        return await get(apiurl, history)
            .then((response) => {
                hideLoader();
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
async function getACSynonyms(history, selectedTermId) {
    try {
        let apiurl = url.autoqueryfindterm;
        apiurl = apiurl.replace('**', selectedTermId);
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
async function updateACSynonyms(userId, searchTerm,postData) {
    try {
        let apiurl = url.updateAutoQueryTerm;
        apiurl = apiurl.replace(':TERMID', searchTerm ? searchTerm.id:'');
        apiurl = apiurl.replace(':UID', userId);
        apiurl = apiurl.replace(':searchTerm', searchTerm ? searchTerm.term:'');
        // showLoader();
        return await post(apiurl, postData)
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
    getFullTextSearchResult,
    fullDocViewService,
    getACSynonyms,
    updateACSynonyms
};

export default fullTextService;
