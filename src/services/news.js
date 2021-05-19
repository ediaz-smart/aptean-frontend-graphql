import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getNewsBullet() {
    try {
        return await get(url.news)
        .then((response) => {
            
            console.log(response,'newsresponse');
            return response;
        })
        .catch((error) => {
            toast.error('Failed to retrieve news');
            // console.log(JSON.stringify(response));
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