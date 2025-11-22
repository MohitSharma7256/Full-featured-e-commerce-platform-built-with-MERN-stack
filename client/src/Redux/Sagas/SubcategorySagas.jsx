import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_SUBCATEGORY_RED, GET_SUBCATEGORY_RED, UPDATE_SUBCATEGORY_RED, CREATE_SUBCATEGORY, UPDATE_SUBCATEGORY, GET_SUBCATEGORY, DELETE_SUBCATEGORY_RED, DELETE_SUBCATEGORY } from "../Constants";
import { getRecord, deleteRecord } from "./Services/index";
import { updateMultipartRecord } from "./Services/index";
import { createMultipartRecord } from "./Services/index";


function* createSagas(action) {                               // worker saga
    // let response = yield createRecord('subcategory', action.payload);
    let response = yield createMultipartRecord("subcategory", action.payload);
    yield put({ type: CREATE_SUBCATEGORY_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('subcategory');
    yield put({ type: GET_SUBCATEGORY_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    // yield updateRecord('subcategory', action.payload);
    // yield put({ type: UPDATE_SUBCATEGORY_RED, payload: action.payload });

    let response = yield updateMultipartRecord("subcategory", action.payload);
    yield put({ type: UPDATE_SUBCATEGORY_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    let response = yield deleteRecord('subcategory', action.payload);
    yield put({ type: DELETE_SUBCATEGORY_RED, payload: response });
}


export default function* SubcategorySagas() {  // watcher saga
    yield takeEvery(CREATE_SUBCATEGORY, createSagas);
    yield takeEvery(GET_SUBCATEGORY, getSagas);
    yield takeEvery(UPDATE_SUBCATEGORY, updateSagas);
    yield takeEvery(DELETE_SUBCATEGORY, deleteSagas);
}