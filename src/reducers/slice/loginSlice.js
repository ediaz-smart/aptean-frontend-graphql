import { createSlice } from '@reduxjs/toolkit';
import { post } from '../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../url';
import { getUserServerInfo } from './userServerDataSlice';


const initialState = { isLoggedIn: false }


export const submitLogin = (data,history, t) => async (dispatch) => {
    // dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
   // const history = useHistory();
   const postdata = new FormData();
    postdata.append("GQUSERID", data.GQUSERID);
    postdata.append("GQPASSWORD", data.GQPASSWORD);
    return post(url.login, postdata,history)
        .then(async (response) => {
            console.log(response,"response response response response response response response");
            if(response && response.response_status == 0)
            {
                console.log(response,"response response response response response response response");
                await dispatch(getUserServerInfo());
                toast.success(t('loginSuccess'));
                localStorage.setItem('User_'+data.GQUSERID, response);

                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userName', data.GQUSERID);
                dispatch(setUser({GQUSERID: data.GQUSERID,isLoggedIn: true }));
                history.push('/home');
            }else {
                let errorMsg = 'Unable to Login';
                dispatch(setUser({isLoggedIn: false }));
                if(response && typeof response.response_content === 'object' && response.response_content !== null){
                    errorMsg = response;
                }
                return errorMsg;
                // toast.error(errorMsg);
                
            }
        })
        .catch((error) => { 
            toast.error('loginFailed');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
};

const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => action.payload
    },
})

export const { setUser } = loginSlice.actions;
export default loginSlice.reducer;