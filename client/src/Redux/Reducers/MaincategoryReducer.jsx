import { CREATE_MAINCATEGORY_RED, GET_MAINCATEGORY_RED, UPDATE_MAINCATEGORY_RED, DELETE_MAINCATEGORY_RED } from "../Constants";
export default function MaincategoryReducer(state = [], action) {
    switch (action.type) {
        case CREATE_MAINCATEGORY_RED: {
            const payload = action.payload?.data || action.payload
            return payload ? [...state, payload] : state
        }
        case GET_MAINCATEGORY_RED: {
            const payload = action.payload?.data || action.payload
            return Array.isArray(payload) ? payload : state
        }
        case UPDATE_MAINCATEGORY_RED: {
            const payload = action.payload?.data || action.payload
            const id = payload?._id || payload?.id
            if (!id) return state
            return state.map(item => (item._id === id ? { ...item, ...payload } : item))
        }
        case DELETE_MAINCATEGORY_RED: {
            const id = action.payload?._id || action.payload?.id || action.id
            if (!id) return state
            return state.filter(x => (x._id || x.id) !== id)
        }
        default:
            return state
    }
}


