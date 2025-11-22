import React from 'react'
import { CREATE_FAQ, GET_FAQ, UPDATE_FAQ, DELETE_FAQ } from '../Constants';

export function createFaq(data) {
    return {
        type: CREATE_FAQ,
        payload: data
    }
}
export function getFaq() {
    return {
        type: GET_FAQ
    }
}

export function updateFaq(data) {
    return {
        type: UPDATE_FAQ,
        payload: data
    }
}
export function deleteFaq(data) {
    return {
        type: DELETE_FAQ,
        // payload: data.id
        payload:{ _id: data._id || data.id }

    }
}