import { get } from '../helpers/fetchServicesMethods';

export default function usersAction(data){
    console.log('data', data)
// return (dispatch, getState) => {
   
    let url = "users/list"
    // const getData = get(url, data);
    // console.log('getData',getData)
    // if(getData && getData.Promise) {
    //     console.log('qweqweqweq', getData.Promise)
    //     return getData.data;
    // }
    return get(url, data).then(resp=>{
        return resp
    })

// }
}