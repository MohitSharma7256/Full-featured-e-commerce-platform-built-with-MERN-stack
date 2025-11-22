import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_MAINCATEGORY_RED, GET_MAINCATEGORY_RED, UPDATE_MAINCATEGORY_RED, CREATE_MAINCATEGORY, UPDATE_MAINCATEGORY, GET_MAINCATEGORY, DELETE_MAINCATEGORY_RED, DELETE_MAINCATEGORY } from "../Constants";

import { getRecord,  deleteRecord, createMultipartRecord, updateMultipartRecord } from "../Sagas/Services/index";




function* createSagas(action) {                               // worker saga
    // action.payload can be FormData (with image)
    let response = yield createMultipartRecord('maincategory', action.payload);
    yield put({ type: CREATE_MAINCATEGORY_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('maincategory');
    yield put({ type: GET_MAINCATEGORY_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    const response = yield updateMultipartRecord('maincategory', action.payload);
    yield put({ type: UPDATE_MAINCATEGORY_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    yield deleteRecord('maincategory', action.payload);
    yield put({ type: DELETE_MAINCATEGORY_RED, payload: action.payload });
}


export default function* MaincategorySagas() {  // watcher saga
    yield takeEvery(CREATE_MAINCATEGORY, createSagas);
    yield takeEvery(GET_MAINCATEGORY, getSagas);
    yield takeEvery(UPDATE_MAINCATEGORY, updateSagas);
    yield takeEvery(DELETE_MAINCATEGORY, deleteSagas);
}