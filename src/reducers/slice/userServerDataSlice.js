import { createSlice } from '@reduxjs/toolkit';
import { get } from '../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../url';


const initialState = { current_user: {} };


export const getUserServerInfo = () => async (dispatch) => {
    return get(url.getServerInfo, null)
        .then(async (response) => {
            if (response && response.response_status == 0) {
                dispatch(setUserInfo(response.response_content));
            } else {
                if (response && typeof response.response_content === 'object' && response.response_content !== null) {
                    // console.log(response.response_content.message);
                }
            }
        })
        .catch((error) => {
            console.log("error::", error);
        });
};

const userServerDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserInfo: (state, action) => action.payload
    },
})

export const { setUserInfo } = userServerDataSlice.actions;
export default userServerDataSlice.reducer;