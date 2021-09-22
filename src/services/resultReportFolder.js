import { get } from '../helpers/fetchServicesMethods';
import { url } from '../reducers/url';
import PubSub from 'pubsub-js';
import { toast } from 'react-toastify';

function showLoader() {
    PubSub.publish('msg', true);
}

function hideLoader() {
    PubSub.publish('msg', false);
}


export const getFolderResultData = async (folderId) => {
    try {
        let apiUrl = 'do=gqfolder.get_folder_info&format=json&id=' + folderId;

        showLoader();
        return await get(apiUrl)
            .then((response) => {
                hideLoader();
                console.log(JSON.stringify(response), "getFolderResultData getFolderResultData getFolderResultData");
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
        hideLoader();
    }
}

export const updateFolderName = async (name, id, history) => {
    try {
        showLoader();
        const renameUrl = 'do=gqfolder.rename&id=' + id + '&text_label=' + name + '&format=json';

        return get(renameUrl, history)
            .then((response) => {
                hideLoader();
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
                hideLoader();
                return null
            });
    } catch (error) {
        hideLoader();
        console.error(error);
        return null
    }
}

export const getFolderSharableUserList = async (_id, history) => {
    console.log(_id)
    try {
        const apiUrl = 'do=gqAccessFt.shareable_list&id=' + _id + '&format=json';

        showLoader();
        return await get(apiUrl, history)
            .then((response) => {
                hideLoader();
                console.log(response)
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
        hideLoader();
    }
}
export const getFolderSharedList = async (_id, history) => {

    try {
        const data = JSON.stringify({
            id: _id
        })
        const apiUrl = 'do=gqAccessFt.get_shared_with&' + data + '&format=json';

        showLoader();
        return await get(apiUrl, history)
            .then((response) => {
                hideLoader();
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
        hideLoader();
    }
}

export const addFolderSharing = async (folderId, userIdToShare, accessLevel) => {
    console.log(userIdToShare)
    try {
        // const data = JSON.stringify({
        //     id: folderId,
        //     usr: userIdToShare,
        //     acl: accessLevel //read or write
        // })
        const apiUrl = 'do= gqAccessFt.add_shared_item&id=' + folderId + '&usr=' + userIdToShare + '&acl=' + accessLevel + '&format=json'

        showLoader();
        return await get(apiUrl)
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
        hideLoader();
    }
}