// import todoReducer from '../reducers/todo';
import { SET_USER } from '../constants';
import { post } from '../helpers/fetchServicesMethods';
// export const  loginAction = {
//     login
// }
//  function login(data) {
//      console.log("data",data);
//     return {
//         type: "wewqewqe"
//       };
    export default function loginAction(data){
        console.log('Login Data From Action', data)
        
    return (dispatch, getState) => {
        // const { posts } = getState()
        // if (posts[userId]) {
        //   // There is cached data! Don't do anything.
        //   return
        // }

        dispatch({
            type: SET_USER,
            payload: data.username
        });
        let url = "users/login"
        const getData = post(url, data);
        if(getData) {
            return getData;
        }

    }
}