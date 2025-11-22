import { 
    CREATE_SUBCATEGORY_RED, 
    GET_SUBCATEGORY_RED, 
    UPDATE_SUBCATEGORY_RED, 
    DELETE_SUBCATEGORY_RED 
} from "../Constants";

export default function SubcategoryReducer(state = [], action) {
    switch (action.type) {
        case CREATE_SUBCATEGORY_RED: {
            const payload = action.payload?.data || action.payload;
            if (payload && typeof payload === 'object' && !Array.isArray(payload))
                return [...state, payload];
            return state;
        }
        case GET_SUBCATEGORY_RED: {
            const data = Array.isArray(action.payload?.data) ? action.payload.data : (Array.isArray(action.payload) ? action.payload : null);
            return data ?? state;
        }
        case UPDATE_SUBCATEGORY_RED: {
            const payload = action.payload?.data || action.payload;
            const id = payload?._id || payload?.id;
            if (!id) return state;
            return state.map(item => (item._id === id ? { ...item, ...payload } : item));
        }
        case DELETE_SUBCATEGORY_RED: {
            const id = action.payload?._id || action.payload?.id || action.id;
            if (!id) return state;
            return state.filter(x => (x._id || x.id) !== id);
        }
        default:
            return state;
    }
}