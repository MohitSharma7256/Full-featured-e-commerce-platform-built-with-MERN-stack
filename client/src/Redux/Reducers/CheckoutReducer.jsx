// src/Redux/Reducers/CheckoutReducer.js
import { CREATE_CHECKOUT_RED, GET_CHECKOUT_RED, UPDATE_CHECKOUT_RED, DELETE_CHECKOUT_RED } from "../Constants"

export default function CheckoutReducer(state = [], action) {
    switch (action.type) {
        case CREATE_CHECKOUT_RED:
            return action.payload && action.payload._id
                ? [...state, action.payload]
                : state

        case GET_CHECKOUT_RED:
            return Array.isArray(action.payload) ? action.payload : []

        case UPDATE_CHECKOUT_RED:
            return state.map(item => 
                item._id === action.payload._id ? action.payload : item
            )

        case DELETE_CHECKOUT_RED:
            return state.filter(x => x._id !== (action.payload?._id || action.payload))

        default:
            return state
    }
}