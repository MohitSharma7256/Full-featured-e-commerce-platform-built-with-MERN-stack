import { put, takeEvery } from 'redux-saga/effects';
import { CREATE_BRAND_RED, GET_BRAND_RED, UPDATE_BRAND_RED, CREATE_BRAND, UPDATE_BRAND, GET_BRAND, DELETE_BRAND_RED, DELETE_BRAND } from "../Constants";
import { getRecord, deleteRecord } from "./Services/index";
import { updateMultipartRecord } from "./Services/index";
import { createMultipartRecord } from './Services/index';

function* createSagas(action) {                               // worker saga
    // let response = yield createRecord('brand', action.payload);
    let response = yield createMultipartRecord("brand", action.payload);
    yield put({ type: CREATE_BRAND_RED, payload: response });
}


function* getSagas() {                               // worker saga
    let response = yield getRecord('brand');
    yield put({ type: GET_BRAND_RED, payload: response });

}


function* updateSagas(action) {                             // watcher saga
    // yield updateRecord('brand', action.payload);
    // yield put({ type: UPDATE_BRAND_RED, payload: action.payload });

    let response = yield updateMultipartRecord("brand", action.payload);
    yield put({ type: UPDATE_BRAND_RED, payload: response });
}

function* deleteSagas(action) {                             // watcher saga
    let response = yield deleteRecord('brand', action.payload);
    yield put({ type: DELETE_BRAND_RED, payload: response });
}


export default function* BrandSagas() {  // watcher saga
    yield takeEvery(CREATE_BRAND, createSagas);
    yield takeEvery(GET_BRAND, getSagas);
    yield takeEvery(UPDATE_BRAND, updateSagas);
    yield takeEvery(DELETE_BRAND, deleteSagas);
}