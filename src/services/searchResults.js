import { get } from '../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../reducers/url';


//this function gets results for myData (possibly other folders) only id is required.
//this function also does the paging start and stop are the result numbers. it can be set to any amount of results (prolly keep start lower than stop).
async function getSearchResults(id, start, stop, sort, nocache) {

    location = url.searchResPaging;

    try {

        if (id === null || id === "") {
            return 1;
        }

        if (start === null || start === "") {
            start = 1;
        }

        if (stop === null || stop === "") {
            stop = 50;
        }

        if (sort === null || sort === "") {
            sort = "-create_time"
        }

        if (nocache === null || nocache === "") {
            nocache = Math.floor(Math.random() * 9999);
        }

        location = location.replace("::", id);
        location = location.replace(":ST:", sort);
        location = location.replace(":S1:", start);
        location = location.replace(":S2:", stop);
        location = location.replace(":NC:", nocache);

    } catch (error) {
        console.error(error);
    }

    try {

        return await get(location)
            .then((response) => {
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