import { CREATE_CART_RED, DELETE_CART_RED, GET_CART_RED, UPDATE_CART_RED } from "../Constants"

export default function CartReducer(state = [], action) {
  switch (action.type) {

    case CREATE_CART_RED:
      return [...state, action.payload]

    case GET_CART_RED:
      return action.payload || []

    case UPDATE_CART_RED:
      return state.map(item =>
        item._id === action.payload._id ? action.payload : item
      )

    case DELETE_CART_RED:
      return state.filter(item => item._id !== action.payload._id)

    default:
      return state
  }
}
