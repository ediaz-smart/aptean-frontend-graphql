import { SET_USER } from '../constants';

const initialState = {
    list: [],
    deleteStatus: "",
    saveStatus: ""
}

export default function todo(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case SET_USER: {
            return { 
                ...state,
                email: action.payload
            }
        }
      // Do something here based on the different types of actions
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }