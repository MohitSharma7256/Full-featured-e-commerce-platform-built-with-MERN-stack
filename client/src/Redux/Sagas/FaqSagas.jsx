import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_FAQ_RED, GET_FAQ_RED, UPDATE_FAQ_RED, CREATE_FAQ, UPDATE_FAQ, GET_FAQ, DELETE_FAQ_RED, DELETE_FAQ } from "../Constants";
import { createRecord, getRecord, updateRecord, deleteRecord } from "./Services/index";
// import { updateMultipartRecord } from "./Services";
// import { updateMultipartRecord } from "./Services";
// import { createMultipartRecord } from "./Services";


function* createSagas(action) {                               // worker saga
    let response = yield createRecord('faq', action.payload);
    // let response = yield createMultipartRecord("faq", action.payload);
    yield put({ type: CREATE_FAQ_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('faq');
    yield put({ type: GET_FAQ_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    yield updateRecord('faq', action.payload);
    yield put({ type: UPDATE_FAQ_RED, payload: action.payload });

    // let response = yield updateMultipartRecord("faq", action.payload);
    // yield put({ type: UPDATE_FAQ_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    let response = yield deleteRecord('faq', action.payload);
    yield put({ type: DELETE_FAQ_RED, payload: response });
}


export default function* FaqSagas() {  // watcher saga
    yield takeEvery(CREATE_FAQ, createSagas);
    yield takeEvery(GET_FAQ, getSagas);
    yield takeEvery(UPDATE_FAQ, updateSagas);
    yield takeEvery(DELETE_FAQ, deleteSagas);
}