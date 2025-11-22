import { CREATE_BRAND_RED, GET_BRAND_RED, UPDATE_BRAND_RED, DELETE_BRAND_RED } from "../Constants";

export default function BrandReducer(state = [], action) {
    switch (action.type) {
        case CREATE_BRAND_RED:
            return [...state, action.payload];

        case GET_BRAND_RED:
            return Array.isArray(action.payload) ? action.payload : state;

        case UPDATE_BRAND_RED: {
            const payload = action.payload || {}
            return state.map(item => item._id === payload._id ? { ...item, ...payload } : item)
        }

        case DELETE_BRAND_RED:
            return state.filter(x => x._id !== (action.payload?._id || action._id));
            
        default:
            return state;
    }
}


