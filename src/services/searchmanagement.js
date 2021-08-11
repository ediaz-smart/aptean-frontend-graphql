import { get,post } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import PubSub from 'pubsub-js';

function showLoader() {
    PubSub.publish('msg', true);
}

function hideLoader() {
    PubSub.publish('msg', false);
}

async function getProjectFolders(history) {
    try {
        showLoader();
        return await get(url.getprojectFolder,history)
        .then((response) => {
            hideLoader();
            return response;
        })
        .catch((error) => {
            // toast.error('A');
            console.log("error::", error);
            hideLoader();
            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
   
}
async function getProjectFolderData(id,history) {
    try {
        let projectFolderDetail = url.projectFolderDetail
        projectFolderDetail = projectFolderDetail.replace('**', id);
        let urlParam = projectFolderDetail
        showLoader();
        return await get(urlParam,history)
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
            hideLoader();
            return response;
        })
        .catch((error) => {
            //toast.error('A');
            console.log("error::", error);
            hideLoader();
            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
   
}
async function getFolderData(id,history, start, stop) {
    try {
        console.log(id,'id');
        let projectFolderData = url.projectFolderData
        projectFolderData = projectFolderData.replace('**', id);
        let urlParam = projectFolderData;
        if(start && stop) {
            urlParam  = urlParam+"&start="+start+"&stop="+stop;
        }
        showLoader();
        return await post(urlParam,null,history)
        .then((response) => {
            hideLoader();
            return response;
        })
        .catch((error) => {
            hideLoader();
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
}
async function deleteSearchResult(ids,history) {
    try {
        console.log(ids,'ids');
        let deleteSearchResult = url.deleteSearchResult
        deleteSearchResult = deleteSearchResult.replace('**', ids);
        let urlParam = deleteSearchResult;
        // showLoader();
        return await post(urlParam,history)
        .then((response) => {
            // hideLoader();
            return response;
        })
        .catch((error) => {
            hideLoader();
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
}
async function moveToFolder(shareId,workflowId,history) {
    try {
        
        let moveToFolder = url.moveToFolder
        moveToFolder = moveToFolder.replace('FID', shareId);
        moveToFolder = moveToFolder.replace('WID', workflowId);
        let urlParam = moveToFolder;
        // console.log(urlParam,'urlParam');
        showLoader();
        return await get(urlParam,history)
        .then((response) => {
            hideLoader();
            return response;
        })
        .catch((error) => {
            hideLoader();
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
}
async function addFolder(parentFolderId,folderName,history) {
    try {
        
        let addFolder = url.addFolder
        addFolder = addFolder.replace('FNAME', folderName);
        addFolder = addFolder.replace('PFID', parentFolderId);
        let urlParam = addFolder;
        // console.log(urlParam,'urlParam');
        // console.log(urlParam,'urlParam');
        showLoader();
        return await get(urlParam,history)
        .then((response) => {
            hideLoader();
            return response;
        })
        .catch((error) => {
            hideLoader();
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
}
async function getSearchResultSet(search,history, start, stop) {
    try {
        
        let searchResultSet = url.searchResultSet
        searchResultSet = searchResultSet.replace('**', search);
        let urlParam = searchResultSet;
        if(start && stop) {
            urlParam  = urlParam+"&start="+start+"&stop="+stop;
        }
        showLoader();
        return await get(urlParam,history)
        .then((response) => {
            hideLoader();
            return response;
        })
        .catch((error) => {
            hideLoader();
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        hideLoader();
        console.error(error);
    }
}
const SearchManagementService = {
    getProjectFolders,
    getProjectFolderData,
    getFolderData,
    deleteSearchResult,
    moveToFolder,
    addFolder,
    getSearchResultSet
};

export default SearchManagementService;