import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_SETTING_RED, GET_SETTING_RED, UPDATE_SETTING_RED, CREATE_SETTING, UPDATE_SETTING, GET_SETTING, DELETE_SETTING_RED, DELETE_SETTING } from "../Constants";
import { createRecord, getRecord, updateRecord, deleteRecord } from "./Services/index";
// import { updateMultipartRecord } from "./Services";
// import { updateMultipartRecord } from "./Services";
// import { createMultipartRecord } from "./Services";


function* createSagas(action) {                               // worker saga
    let response = yield createRecord('setting', action.payload);
    // let response = yield createMultipartRecord("setting", action.payload);
    yield put({ type: CREATE_SETTING_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('setting');
    yield put({ type: GET_SETTING_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    yield updateRecord('setting', action.payload);
    yield put({ type: UPDATE_SETTING_RED, payload: action.payload });

    // let response = yield updateMultipartRecord("setting", action.payload);
    // yield put({ type: UPDATE_SETTING_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    let response = yield deleteRecord('setting', action.payload);
    yield put({ type: DELETE_SETTING_RED, payload: response });
}


export default function* SettingSagas() {  // watcher saga
    yield takeEvery(CREATE_SETTING, createSagas);
    yield takeEvery(GET_SETTING, getSagas);
    yield takeEvery(UPDATE_SETTING, updateSagas);
    yield takeEvery(DELETE_SETTING, deleteSagas);
}