import { createSlice } from '@reduxjs/toolkit';
import { post } from '../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../url';


const initialState = { isLoggedIn: false }


export const submitLogin = (data,history) => async (dispatch) => {
    // dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
   // const history = useHistory();
    return post(url.login, data)
        .then((response) => {
            if(response && response.response_status == 0)
            {
                toast.success('loginSuccess');
                dispatch(setUser({GQUSERID: data.GQUSERID,isLoggedIn: true }));
                history.push('/home');
            }else {
                let errorMsg = 'Unable to Login';
                if(response && typeof response.response_content === 'object' && response.response_content !== null){
                    errorMsg = response.response_content.message;
                }
                toast.error(errorMsg);
                dispatch(setUser({isLoggedIn: false }));
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