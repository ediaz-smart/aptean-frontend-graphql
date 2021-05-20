import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getAccountInfo() {
    try {
        return await get(url.accountInfo)
        .then((response) => {
            
            console.log(JSON.stringify(response));
            return response;
        })
        .catch((error) => {
            toast.error('Failed to retrieve Account Info');
            console.log("error::", error);

        });
    } catch (error) {
        console.error(error);
    }
   
}

const AccountInfo = {
    getAccountInfo
};

export default AccountInfo;