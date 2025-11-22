import { CREATE_SETTING_RED, GET_SETTING_RED, UPDATE_SETTING_RED, DELETE_SETTING_RED } from "../Constants";

export default function SettingReducer(state = [], action) {
    switch (action.type) {
        case CREATE_SETTING_RED:
            return [...state, action.payload];

        case GET_SETTING_RED:
            return Array.isArray(action.payload) ? action.payload : state;

        case UPDATE_SETTING_RED:
            return state.map(item =>
                item._id === action.payload._id ? { ...item, ...action.payload } : item
            );

        case DELETE_SETTING_RED:
            return state.filter(x => x._id !== (action.payload?._id || action._id));

        default:
            return state;
    }
}
