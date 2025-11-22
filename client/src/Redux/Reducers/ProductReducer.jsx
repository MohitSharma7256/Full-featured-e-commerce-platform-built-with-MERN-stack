import { CREATE_PRODUCT_RED, GET_PRODUCT_RED, UPDATE_PRODUCT_RED, DELETE_PRODUCT_RED } from "../Constants";


export default function ProductReducer(state = [], action) {
    switch (action.type) {
        case CREATE_PRODUCT_RED:
            return [...state, action.payload];

        case GET_PRODUCT_RED:
            return action.payload;

        case UPDATE_PRODUCT_RED:
            {
                let index = state.findIndex(x => x._id === action.payload._id);
                if (index !== -1) {
                    const newState = [...state]
                    newState[index] = action.payload
                    return newState
                }
                return state
            }

        case DELETE_PRODUCT_RED:
            return state.filter(x => x._id !== action._id);

        default:
            return state;
    }
}


