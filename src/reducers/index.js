import { combineReducers } from 'redux'

import loginSlice from './slice/loginSlice';
import userServerDataSlice from './slice/userServerDataSlice';
import setCommonSlice from './slice/comonSlice';

const rootReducer = combineReducers({
  user: loginSlice,
  setUserInfo: userServerDataSlice,
  setCommon: setCommonSlice
})

export default rootReducer