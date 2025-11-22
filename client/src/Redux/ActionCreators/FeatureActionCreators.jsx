import React from 'react'
import { CREATE_FEATURE, GET_FEATURE, UPDATE_FEATURE, DELETE_FEATURE } from '../Constants';

export function createFeature(data) {
    return {
        type: CREATE_FEATURE,
        payload: data
    }
}
export function getFeature() {
    return {
        type: GET_FEATURE
    }
}

export function updateFeature(data) {
    return {
        type: UPDATE_FEATURE,
        payload: data
    }
}
export function deleteFeature(data) {
    return {
        type: DELETE_FEATURE,
        // payload: data.id
        payload:{ _id: data._id || data.id }

    }
}