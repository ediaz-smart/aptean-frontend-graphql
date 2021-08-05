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

export const convertXml = async (data, history, t) => {
    // dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
    // const history = useHistory();
    console.log('getdata', data)
    console.log(data.st26input)
    var domParser = new DOMParser();
    
    var dom = domParser.parseFromString(data.st26input, 'text/xml');
    console.log(dom);
    var x = dom.getElementsByTagName('parsererror').length ? (new XMLSerializer()).serializeToString(dom) : 'all good';
    console.log(x,'value of x');
    // ? (new XMLSerializer()).serializeToString(dom) : 'all good';

        if (dom.getElementsByTagName('parsererror').length) {
            return 'parsererror';
        } 
        else {
            var sd = dom.getElementsByTagName('SequenceData');
            var prt = '';
            var dna = '';
            var prtCount = 0;
            var dnaCount = 0;
            if(sd.length == 0){
                return 'empty';
            }
            for (var i = 0; i < sd.length; i++) {
                var nNode = sd.item(i);
                if (nNode.nodeType == Node.ELEMENT_NODE) {
                    var mol = nNode.getElementsByTagName('INSDSeq_moltype');
                    var seqId = nNode.getAttribute('sequenceIDNumber');
                    var seqTag = nNode.getElementsByTagName('INSDSeq_sequence');
                    if (mol.length == 0 || seqId == null || seqTag.length == 0 || seqId.length == 0){
                        return 'missing';
                    }
                    else {
                        var moltype = mol.item(0).textContent;
                        var seq = seqTag.item(0).textContent;
                        if (moltype == 'AA') {
                            prt += '>SEQ_NO_' + seqId + '\n' + seq + '\n';
                            prtCount++;
                        }
                        if (moltype == 'DNA' || moltype == 'RNA') {
                            dna += '>SEQ_NO_' + seqId + '\n' + seq + '\n';
                            dnaCount++;
                        }
                    }

                }
            }

            var x = [prt, dna, prtCount, dnaCount];
            //console.log(prt);
            //console.log(dna);
            return x;
        }
    /*
    post(url.antibodySearch, data, history)
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
        */
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
const st26service = {
    convertXml,
    getAuthInfoAB
};

export default st26service;
