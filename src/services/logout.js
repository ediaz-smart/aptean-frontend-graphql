import { post, get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';
import { id } from 'date-fns/locale';


async function logout(userId) {
    try {
        let urlParam = url.logout;
        return await get(urlParam)
            .then((response) => {
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
const LogoutService = {
    logout
};

export default LogoutService;