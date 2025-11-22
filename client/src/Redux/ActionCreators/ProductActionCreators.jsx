import React from 'react'
import { CREATE_PRODUCT, GET_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../Constants';

export function createProduct(data) {
    return {
        type: CREATE_PRODUCT,
        payload: data
    }
}
export function getProduct() {
    return {
        type: GET_PRODUCT
    }
}

export function updateProduct({ formData, _id, onSuccess }) {
    return {
        type: UPDATE_PRODUCT,
        payload: { formData, _id, onSuccess }
    }
}

export function deleteProduct(data) {
    return {
        type: DELETE_PRODUCT,
        // payload: data.id
        payload: { _id: data._id || data.id }

    }
}