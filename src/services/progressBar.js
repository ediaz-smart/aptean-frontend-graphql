import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';

async function getProgress(workflow) {
    try {

        let location = url.progress

        locaiton = location.replace('**', workflow);
        console.log(locaiton);

        return await get(location)
        .then((response) => {
            
            console.log(JSON.stringify(response));
            return response;
        })
        .catch((error) => {
            toast.error('Failed to retrieve progress');
            console.log("error::", error);

        });
    } catch (error) {
        console.error(error);
    }
   
}

const progressService = {
    getProgress
};

export default progress;