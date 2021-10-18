import { get, post } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import PubSub from 'pubsub-js';

function showLoader() {
    PubSub.publish('msg', true);
}

function hideLoader() {
    PubSub.publish('msg', false);
}

async function getAccountInfo() {
    if (localStorage.getItem('isLoggedIn')) {
        try {
            showLoader();
            return await get(url.accountInfo)
                .then((response) => {
                    hideLoader();
                    return response;
                })
                .catch((error) => {
                    hideLoader();
                    toast.error('Failed to retrieve Account Info');
                });
        } catch (error) {
            console.error(error);
        }

    } else {
        return "arun";
    }

}

async function updateUser(id, firstName, lastName, currentPassword) {

    if (id == "" || firstName == "" || lastName == "" || currentPassword == "") {
        console.error("needs all Parameters");
        toast.error("Failed to update info");
        return 1;
    } else {

        let stringBuild = "do=gquser.update&id=" + id + "&first_name=" + firstName + "&last_name=" + lastName + "&curr_password=" + currentPassword + "&format=json";

        let url = stringBuild;
        const responseData = await update(url);
        return responseData;

    }
}

async function updatePass(id, newPassword1, newPassword2, currentPassword) {
    if (id == "" || newPassword1 == "" || newPassword2 == "" || currentPassword == "") {
        console.error("needs all Parameters");
        toast.error("Failed to update password");
        return 1;
    } else {

        let stringBuild = "do=gquser.update&id=" + id + "&password1=" + newPassword1 + "&user_password_again=" + newPassword2 + "&curr_password=" + currentPassword + "&format=json";

        let url = stringBuild;
        const responseData = await update(url);
        return responseData;
    }

}
async function updateResetPass(userId, key, newPassword1) {
    try {
        const pass = {
            password1: newPassword1
        }
        const urlParam = 'do=gquser.reset_password&userid' + userId + '&key=' + key + '&format=json';
        showLoader();
        return await post(urlParam, pass)
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
async function authCheckInfo(userId, key) {
    try {
        let apiUrl = 'do=gquser.reset_password&userid' + userId + '&key=' + key + '&format=json';
        showLoader();
        return await get(apiUrl)
            .then((response) => {
                hideLoader();
                return response;
            })
            .catch((error) => {
                hideLoader();
                toast.error('Something Wrong! Try Again.');
                console.log("error::", error);

            });
    } catch (error) {
        console.error(error);
    }

}
async function update(url) {

    if (localStorage.getItem('isLoggedIn') && url != "") {

        try {
            showLoader();
            return await get(url)
                .then((response) => {
                    hideLoader();
                    return response;
                })
                .catch((error) => {
                    hideLoader();
                    toast.error('Failed to change password');
                    console.log("error::", error);

                });
        } catch (error) {
            toast.error(error.response_content.message);
            console.error(error, "errors");
        }

    } else {
        return 1;
    }

}

const AccountInfo = {
    getAccountInfo,
    updateUser,
    updatePass,
    authCheckInfo,
    updateResetPass
};

export default AccountInfo;