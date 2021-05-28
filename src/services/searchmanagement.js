import { get,post } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getProjectFolders(history) {
    try {
        return await get(url.getprojectFolder,history)
        .then((response) => {
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
async function getProjectFolderData(id,history) {
    try {
        let projectFolderDetail = url.projectFolderDetail
        projectFolderDetail = projectFolderDetail.replace('**', id);
        let urlParam = projectFolderDetail
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
async function getFolderData(id,history) {
    try {
        console.log(id,'id');
        let projectFolderData = url.projectFolderData
        projectFolderData = projectFolderData.replace('**', id);
        let urlParam = projectFolderData
        return await post(urlParam,null,history)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        console.error(error);
    }
}
async function deleteSearchResult(ids,history) {
    try {
        console.log(ids,'ids');
        let deleteSearchResult = url.deleteSearchResult
        deleteSearchResult = deleteSearchResult.replace('**', ids);
        let urlParam = deleteSearchResult;
        return await post(urlParam,history)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        console.error(error);
    }
}
async function moveToFolder(shareId,workflowId,history) {
    try {
        
        let moveToFolder = url.moveToFolder
        moveToFolder = moveToFolder.replace('RID', shareId);
        moveToFolder = moveToFolder.replace('WID', workflowId);
        let urlParam = moveToFolder;
        // console.log(urlParam,'urlParam');
        return await get(urlParam,history)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            //toast.error('A');
            console.log("error::", error);
        });
    } catch (error) {
        console.error(error);
    }
}
const SearchManagementService = {
    getProjectFolders,
    getProjectFolderData,
    getFolderData,
    deleteSearchResult,
    moveToFolder
};

export default SearchManagementService;