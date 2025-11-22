import { CREATE_FAQ_RED, GET_FAQ_RED, UPDATE_FAQ_RED, DELETE_FAQ_RED } from "../Constants";

export default function FaqReducer(state = [], action) {
    switch (action.type) {
        case CREATE_FAQ_RED:
            return [...state, action.payload];

        case GET_FAQ_RED:
            return action.payload;

        case UPDATE_FAQ_RED:
            { let index = state.findIndex(x => x._id === action.payload._id);
            state[index].question = action.payload.question;
            state[index].answer = action.payload.answer;
            state[index].active = action.payload.active;
            return state; }

        case DELETE_FAQ_RED: 
            return state.filter(x => x._id !== action._id);

        default:
            return state;
    }
}


