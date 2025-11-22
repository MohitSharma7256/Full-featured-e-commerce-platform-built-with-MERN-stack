// ============================================
// 1. FIXED ProductSagas.jsx
// ============================================
import { put, takeEvery } from "redux-saga/effects"
import {
    CREATE_PRODUCT, CREATE_PRODUCT_RED,
    DELETE_PRODUCT, DELETE_PRODUCT_RED,
    GET_PRODUCT, GET_PRODUCT_RED,
    UPDATE_PRODUCT, UPDATE_PRODUCT_RED
} from "../Constants"

import {
    createMultipartRecord,
    getRecord,
    updateMultipartRecord,
    updateRecord,  // Add this import
    deleteRecord
} from "./Services/index"

function* createSaga(action) {
    let response = yield createMultipartRecord("product", action.payload)
    yield put({ type: CREATE_PRODUCT_RED, payload: response })
}

function* getSaga() {
    let response = yield getRecord("product")
    yield put({ type: GET_PRODUCT_RED, payload: response })
}

function* updateSaga(action) {
    try {
        let response
        
        // Check if payload is FormData (for image updates)
        if (action.payload instanceof FormData) {
            console.log("Updating product with images (FormData)")
            response = yield updateMultipartRecord(`product/${action.payload.get('_id')}`, action.payload)
        } else {
            // For stock updates or simple field updates, use regular JSON
            console.log("Updating product stock (JSON)", action.payload)
            response = yield updateRecord("product", action.payload)
        }
        
        if (response) {
            console.log("Product update response:", response)
            yield put({ type: UPDATE_PRODUCT_RED, payload: response })
        } else {
            console.error("Invalid response:", response)
        }
    } catch (error) {
        console.error("Error updating product:", error)
    }
}

function* deleteSaga(action) {
    yield deleteRecord("product", action.payload)
    yield put({ type: DELETE_PRODUCT_RED, payload: action.payload })
}

export default function* ProductSagas() {
    yield takeEvery(CREATE_PRODUCT, createSaga)
    yield takeEvery(GET_PRODUCT, getSaga)
    yield takeEvery(UPDATE_PRODUCT, updateSaga)
    yield takeEvery(DELETE_PRODUCT, deleteSaga)
}