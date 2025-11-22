import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <div className="page-content">
        <BreadCrumb title="404! Page not Found" />

        {/* <!--start product details--> */}
        <section className="section-padding">
          <div className="container">
            <div className="separator mb-3">
              <div className="line"></div>
              <h3 className="mb-0 h3 fw-bold">OOPS!</h3>
              <div className="line"></div>
            </div>

            <div className="border p-4 text-center w-100">
              <h5 className="fw-bold mb-2">404! Page Not Found</h5>
              <br/>
              <div className="btn-group w-25 mt-2">
                <Link to="/" className="w-50 btn btn-secondary">Home</Link>
                <Link to="/shop" className="w-50 btn btn-primary">Shop Now</Link>
              </div>
              <p className="mb-0">
                We have recived your message. We will reply you as soon as
                possible.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ErrorPage;
