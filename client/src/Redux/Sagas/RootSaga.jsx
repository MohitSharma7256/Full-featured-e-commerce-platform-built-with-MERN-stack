import { all } from "redux-saga/effects";
import MaincategorySagas from "./MaincategorySagas"
import SubcategorySagas from "./SubcategorySagas"
import BrandSagas from "./BrandSagas"
import ProductSagas from "./ProductSagas"
import FeatureSagas from "./FeatureSagas"
import SettingSagas from "./SettingSagas"
import FaqSagas from "./FaqSagas"
import CartSagas from "./CartSagas"
import WishlistSagas from "./WishlistSagas"
import CheckoutSagas from "./CheckoutSagas"
import NewsletterSagas from "./NewsletterSagas"
import ContactUsSagas from "./ContactUsSagas"
import UserSagas from "./UserSagas"
import TestimonialSagas from "./TestimonialSagas"

export default function* RootSaga() {
    yield all([
        MaincategorySagas(),
        SubcategorySagas(),
        BrandSagas(),
        ProductSagas(),
        FeatureSagas(),
        SettingSagas(),
        FaqSagas(),
        CartSagas(),
        WishlistSagas(),
        CheckoutSagas(),
        NewsletterSagas(),
        ContactUsSagas(),
        UserSagas(),
        TestimonialSagas(),
    ])
}