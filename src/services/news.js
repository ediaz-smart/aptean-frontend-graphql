import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getNewsBullet() {
    try {
        var d = new Date();
        var n = d.getMilliseconds();
        let apiurl = url.news + '&request.preventCache=' + n;
        return await get(apiurl)
            .then((response) => {
                if (response && response.response_content) {
                    return response.response_content;
                } else {
                    return response;
                }

            })
            .catch((error) => {
                toast.error('Failed to retrieve news');
                console.log("error::", error);

            });
    } catch (error) {
        console.error(error);
    }

}

const NewsService = {
    getNewsBullet
};

export default NewsService;