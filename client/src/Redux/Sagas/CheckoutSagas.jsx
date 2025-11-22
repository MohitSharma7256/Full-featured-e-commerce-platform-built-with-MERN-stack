import { put, takeEvery } from "redux-saga/effects"
import {
    CREATE_CHECKOUT, CREATE_CHECKOUT_RED,
    DELETE_CHECKOUT, DELETE_CHECKOUT_RED,
    GET_CHECKOUT, GET_CHECKOUT_RED,
    UPDATE_CHECKOUT, UPDATE_CHECKOUT_RED
} from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/index"

// CREATE CHECKOUT
function* createSaga(action) {
    try {
        console.log("Saga: Creating checkout with data:", action.payload)
        const data = yield createRecord("checkout", action.payload)
        console.log("Saga: Backend response (data):", data)

        if (data && data._id) {
            console.log("Saga: Checkout created successfully")
            yield put({ type: CREATE_CHECKOUT_RED, payload: data })
            return data
        } else {
            const errorMessage = "Checkout creation failed"
            console.error("Saga: Backend error:", errorMessage, data)
            throw new Error(errorMessage)
        }
    } catch (error) {
        console.error("Create Checkout Saga Failed:", error)
        throw error
    }
}

// GET ALL CHECKOUTS
function* getSaga() {
    try {
        const response = yield getRecord("checkout")
        yield put({ type: GET_CHECKOUT_RED, payload: response })
    } catch (error) {
        console.error("Get Checkouts Failed:", error)
    }
}

// UPDATE CHECKOUT
function* updateSaga(action) {
    try {
        const { formData, _id, onSuccess } = action.payload

        if (!_id) {
            console.error("Update Failed: _id missing")
            return
        }

        console.log("Updating checkout with ID:", _id)

        const response = yield updateRecord("checkout", formData)

        if (response && response._id) {
            yield put({ type: UPDATE_CHECKOUT_RED, payload: response })

            // CALL onSuccess CALLBACK
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess()
            }
        } else {
            console.error("Invalid response:", response)
        }
    } catch (error) {
        console.error("Update Checkout Saga Error:", error)
    }
}

// DELETE CHECKOUT
function* deleteSaga(action) {
    try {
        const { _id } = action.payload
        if (!_id) {
            console.error("Delete Failed: No _id")
            return
        }

        yield deleteRecord("checkout", { _id })
        yield put({ type: DELETE_CHECKOUT_RED, payload: { _id } })
    } catch (error) {
        console.error("Delete Checkout Failed:", error)
    }
}

// MAIN SAGA
export default function* CheckoutSagas() {
    yield takeEvery(CREATE_CHECKOUT, createSaga)
    yield takeEvery(GET_CHECKOUT, getSaga)
    yield takeEvery(UPDATE_CHECKOUT, updateSaga)
    yield takeEvery(DELETE_CHECKOUT, deleteSaga)
}