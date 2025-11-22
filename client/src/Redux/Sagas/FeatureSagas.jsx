import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_FEATURE_RED, GET_FEATURE_RED, UPDATE_FEATURE_RED, CREATE_FEATURE, UPDATE_FEATURE, GET_FEATURE, DELETE_FEATURE_RED, DELETE_FEATURE } from "../Constants";
import { createRecord, getRecord, updateRecord, deleteRecord } from "./Services/index";
// import { updateMultipartRecord } from "./Services";
// import { updateMultipartRecord } from "./Services";
// import { createMultipartRecord } from "./Services";


function* createSagas(action) {                               // worker saga
    let response = yield createRecord('feature', action.payload);
    // let response = yield createMultipartRecord("feature", action.payload);
    yield put({ type: CREATE_FEATURE_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('feature');
    yield put({ type: GET_FEATURE_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    yield updateRecord('feature', action.payload);
    yield put({ type: UPDATE_FEATURE_RED, payload: action.payload });

    // let response = yield updateMultipartRecord("feature", action.payload);
    // yield put({ type: UPDATE_FEATURE_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    let response = yield deleteRecord('feature', action.payload);
    yield put({ type: DELETE_FEATURE_RED, payload: response });
}


export default function* FeatureSagas() {  // watcher saga
    yield takeEvery(CREATE_FEATURE, createSagas);
    yield takeEvery(GET_FEATURE, getSagas);
    yield takeEvery(UPDATE_FEATURE, updateSagas);
    yield takeEvery(DELETE_FEATURE, deleteSagas);
}