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

export async function getSeqSearchResults(history) {
    try {
        showLoader();
        return await get(url.seqSearchInit, history)
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


export const submitSeqSearch = (data,history, t) => {
    // dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
   // const history = useHistory();
   console.log('getdata', data)
    return post(url.seqSearchSubmit, data,history)
        .then(async (response) => {
            if(response )
            {
                console.log('seqresponse', response)
                return response;
                // toast.success('loginSuccess');
                // localStorage.setItem('isLoggedIn', true);
                // localStorage.setItem('userName', data.GQUSERID);
                // dispatch(setUser({GQUSERID: data.GQUSERID,isLoggedIn: true }));
                // history.push('/home');
            }else {
                console.log('seqerrorresponse', response)

                // let errorMsg = 'Unable to Login';
                // if(response && typeof response.response_content === 'object' && response.response_content !== null){
                //     errorMsg = response.response_content.message;
                // }
                // toast.error(errorMsg);
                // dispatch(setUser({isLoggedIn: false }));
            }
        })
        .catch((error) => {
            toast.error('failed');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
};

export async function getRedoData(parentId, history) {
    try {
        showLoader();
        let redoUrl = url.seqSearchInit + '&parent_id='+parentId;
        return await get(redoUrl, history)
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

