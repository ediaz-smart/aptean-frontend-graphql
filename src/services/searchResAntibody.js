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

export const submitAnitbodySearch = async (data, history, t) => {
    // dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
    // const history = useHistory();
    console.log('getdata', data)
    return post(url.antibodySearch, data, history)
        .then(async (response) => {
            if (response) {
                console.log('seqresponse', response)
                return response;
                // toast.success('loginSuccess');
                // localStorage.setItem('isLoggedIn', true);
                // localStorage.setItem('userName', data.GQUSERID);
                // dispatch(setUser({GQUSERID: data.GQUSERID,isLoggedIn: true }));
                // history.push('/home');
            } else {
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

async function getAuthInfoAB(workflowId) {

    try {
        let apiurl = url.authInfoAB;
        if (workflowId) {
            // Comes from the route URL '/antibody/parent_id={parentId}'
            let db = 'db=wf:' + workflowId + '.resdb&parentId='+workflowId;
            apiurl = apiurl.replace('db=', db);
        }
        showLoader();
        return await get(apiurl)
            .then((response) => {
                hideLoader();
                // console.log(JSON.stringify(response),"Password");
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

}
const searchResAntibody = {
    submitAnitbodySearch,
    getAuthInfoAB
};

export default searchResAntibody;
