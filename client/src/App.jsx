import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SaveAddress from "./pages/SaveAddress";
import WishlistPage from "./pages/WishlistPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ErrorPage from "./pages/ErrorPage.js";
import FeaturePage from "./pages/FeaturePage.jsx";
import TestimonialPage from "./pages/TestimonialPage.jsx";
import AdminHomePage from "./pages/Admin/AdminHomePage.jsx";
import AdminMaincategoryPage from "./pages/Admin/MainCategory/AdminMaincategoryPage.jsx";
import AdminMaincategoryCreatePage from "./pages/Admin/MainCategory/AdminMaincategoryCreatePage.jsx";
import AdminMaincategoryUpdatePage from "./pages/Admin/MainCategory/AdminMaincategoryUpdatePage.jsx";
import AdminSubcategoryPage from "./pages/Admin/SubCategory/AdminSubcategoryPage.jsx";
import AdminSubcategoryCreatePage from "./pages/Admin/SubCategory/AdminSubcategoryCreatePage.jsx";
import AdminSubcategoryUpdatePage from "./pages/Admin/SubCategory/AdminSubcategoryUpdatePage.jsx";
import AdminBrandPage from "./pages/Admin/Brand/AdminBrandPage.jsx";
import AdminBrandCreatePage from "./pages/Admin/Brand/AdminBrandCreatePage.jsx";
import AdminBrandUpdatePage from "./pages/Admin/Brand/AdminBrandUpdatePage.jsx";
import AdminFeaturePage from "./pages/Admin/Feature/AdminFeaturePage.jsx";
import AdminFeatureCreatePage from "./pages/Admin/Feature/AdminFeatureCreatePage.jsx";
import AdminFeatureUpdatePage from "./pages/Admin/Feature/AdminFeatureUpdatePage.jsx";
import AdminFaqPage from "./pages/Admin/Faq/AdminFaqPage.jsx";
import AdminFaqCreatePage from "./pages/Admin/Faq/AdminFaqCreatePage.jsx";
import AdminFaqUpdatePage from "./pages/Admin/Faq/AdminFaqUpdatePage.jsx";
import AdminProductPage from "./pages/Admin/Product/AdminProductPage.jsx";
import AdminProductCreatePage from "./pages/Admin/Product/AdminProductCreatePage.jsx";
import AdminProductUpdatePage from "./pages/Admin/Product/AdminProductUpdatePage.jsx";
import AdminSettingPage from "./pages/Admin/SettingPage/AdminSettingPage.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import BuyerAddress from "./pages/BuyerAddress.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import AdminNewsletterPage from "./pages/Admin/Newsletter/AdminNewsletterPage.jsx";
import AdminContactUsPage from "./pages/Admin/ContactUs/AdminContactUsPage.jsx";
import AdminContactUsShowPage from "./pages/Admin/ContactUs/AdminContactUsShowPage.jsx";
import AdminCheckoutShowPage from "./pages/Admin/Checkout/AdminCheckoutShowPage.jsx";
import AdminCheckoutPage from "./pages/Admin/Checkout/AdminCheckoutPage.jsx";
import ForgetPassword1 from "./pages/ForgatePassword1.jsx";
import ForgetPassword2 from "./pages/ForgatePassword2.jsx";
import ForgetPassword3 from "./pages/ForgatePassword3.jsx";
import AdminUserPage from "./pages/Admin/User/AdminUserPage.jsx";
import AdminUserCreatePage from "./pages/Admin/User/AdminUserCreatePage.jsx";
import AdminUserUpdatePage from "./pages/Admin/User/AdminUserUpdatePage.jsx";

// app.jsx

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Pages */}
        <Route path="" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/featurespage" element={<FeaturePage />} />
        <Route path="/testimonialpage" element={<TestimonialPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:_id" element={<ProductPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password1" element={<ForgetPassword1 />} />
        <Route path="/forget-password2" element={<ForgetPassword2 />} />
        <Route path="/forget-password3" element={<ForgetPassword3 />} />




        {/* Buyer Routes */}

        {
          localStorage.getItem("login") ?
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path='/update-profile' element={<UpdateProfile />} />
              <Route path='/buyer-address' element={<BuyerAddress />} />
              <Route path="/editprofile" element={<EditProfilePage />} />
              <Route path="/saveaddress" element={<SaveAddress />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </> : null
        }

        {/* Admin Page */}
        {
          localStorage.getItem("login") && localStorage.getItem("role") !== "Buyer" ?  // isme condition ye hai ki buyer ko chorke Admin or Super Admin access kar sakenge 
            <>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminHomePage />} />

              {/* Main Category Routes */}
              <Route path="/admin/maincategory" element={<AdminMaincategoryPage />} />
              <Route path="/admin/maincategory/create" element={<AdminMaincategoryCreatePage />} />
              <Route path="/admin/maincategory/edit/:_id" element={<AdminMaincategoryUpdatePage />} />

              {/* Sub Category Routes */}
              <Route path="/admin/subcategory" element={<AdminSubcategoryPage />} />
              <Route path="/admin/subcategory/create" element={<AdminSubcategoryCreatePage />} />
              <Route path="/admin/subcategory/edit/:_id" element={<AdminSubcategoryUpdatePage />} />

              {/* Brand Routes */}
              <Route path="/admin/brand" element={<AdminBrandPage />} />
              <Route path="/admin/brand/create" element={<AdminBrandCreatePage />} />
              <Route path="/admin/brand/edit/:_id" element={<AdminBrandUpdatePage />} />

              {/* Feature Routes */}
              <Route path="/admin/feature" element={<AdminFeaturePage />} />
              <Route path="/admin/feature/create" element={<AdminFeatureCreatePage />} />
              <Route path="/admin/feature/edit/:_id" element={<AdminFeatureUpdatePage />} />

              {/* Feature Routes */}
              <Route path="/admin/faq" element={<AdminFaqPage />} />
              <Route path="/admin/faq/create" element={<AdminFaqCreatePage />} />
              <Route path="/admin/faq/edit/:_id" element={<AdminFaqUpdatePage />} />

              {/* Product Routes */}
              <Route path="/admin/product" element={<AdminProductPage />} />
              <Route path="/admin/product/create" element={<AdminProductCreatePage />} />
              <Route path="/admin/product/edit/:_id" element={<AdminProductUpdatePage />} />


              {/* setting Routes */}
              <Route path="/admin/setting" element={<AdminSettingPage />} />

              {/* News letter routes */}
              <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />

              {/*  Admin ContactUs Routes */}
              <Route path="/admin/contactus" element={<AdminContactUsPage />} />
              <Route path="/admin/contactus/show/:_id" element={<AdminContactUsShowPage />} />

              {/* Admin Checkouts routes */}
              <Route path="/admin/checkout" element={<AdminCheckoutPage />} />
              <Route path="/admin/checkout/show/:_id" element={<AdminCheckoutShowPage />} />

              {/* isme condition Super Admin Check karegi jo hoga wahi access karega  */}
              {
                localStorage.getItem("role") === "Super Admin" ?
                  <>
                    <Route path="/admin/user" element={<AdminUserPage />} />
                    <Route path="/admin/user/create" element={<AdminUserCreatePage />} />
                    <Route path="/admin/user/edit/:_id" element={<AdminUserUpdatePage />} />

                  </> : null
              }

            </> : null
        }

        {/* Error Message */}
        <Route path="/*" element={<ErrorPage />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
