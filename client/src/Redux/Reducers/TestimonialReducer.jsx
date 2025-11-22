import { CREATE_TESTIMONIAL_RED, DELETE_TESTIMONIAL_RED, GET_TESTIMONIAL_RED, UPDATE_TESTIMONIAL_RED } from "../Constants"
export default function TestimonialReducer(state = [], action) {
    switch (action.type) {
        case CREATE_TESTIMONIAL_RED:
            return [...state, action.payload]

        case GET_TESTIMONIAL_RED:
            return action.payload

        case UPDATE_TESTIMONIAL_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].star = action.payload.star
            state[index].message = action.payload.message
            return state

        case DELETE_TESTIMONIAL_RED:
            return state.filter(x => x._id !== action._id)

        default:
            return state
    }
}
