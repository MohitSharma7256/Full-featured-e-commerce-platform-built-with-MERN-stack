import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import { Link } from 'react-router-dom'
import BuyerSidebar from '../components/BuyerSidebar'

export default function Dashboard() {
  return (
    <>
      <div className="page-content">


        <BreadCrumb title="Deshboard" />

        <section className="section-padding">
          <div className="container">
            <div className="d-flex align-items-center px-3 py-2 border mb-4">
              <div className="text-start">
                <h4 className="mb-0 h4 fw-bold">Account - Dashboard</h4>
              </div>
            </div>
            <div className="btn btn-dark btn-ecomm d-xl-none position-fixed top-50 start-0 translate-middle-y" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarFilter"><span><i className="bi bi-person me-2"></i>Account</span></div>
            <div className="row">
              <div className="col-12 col-xl-3 filter-column">
                <nav className="navbar navbar-expand-xl flex-wrap p-0">
                  <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbarFilter" aria-labelledby="offcanvasNavbarFilterLabel">
                    <div className="offcanvas-header">
                      <h5 className="offcanvas-title mb-0 fw-bold text-uppercase" id="offcanvasNavbarFilterLabel">Account</h5>
                      <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <BuyerSidebar />
                  </div>
                </nav>
              </div>
              <div className="col-12 col-xl-9">
                <div className="card rounded-0 bg-light">
                  <div className="card-body">
                    <div className="d-flex flex-wrap flex-row align-items-center gap-3">
                      <div className="profile-pic">
                        <img src="assets/images/avatars/01.jpg" width="140" alt="" />
                      </div>
                      <div className="profile-email flex-grow-1">
                        <p className="mb-0 fw-bold text-content">{localStorage.getItem("name")}</p>
                      </div>
                      <div className="edit-button align-self-start">
                        <Link to="/update-profile" className="btn btn-outline-dark btn-ecomm"><i className="bi bi-pencil-fill me-2"></i>Edit Profile</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-lg-3 g-4 pt-4">
                  <div className="col">
                    <Link to="/profile">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-person"></i></div>
                            <h6 className="mb-0">Profile Details</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col">
                    <Link to="/update-profile">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-pencil"></i></div>
                            <h6 className="mb-0">Update Profile</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col">
                    <Link to="/orders">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-box-seam"></i></div>
                            <h6 className="mb-0">Orders</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col">
                    <Link to="/buyer-address">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-geo-alt"></i></div>
                            <h6 className="mb-0">Addresses</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col">
                    <Link to="/cart">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-cart"></i></div>
                            <h6 className="mb-0">Cart</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col">
                    <Link to="/wishlist">
                      <div className="card rounded-0">
                        <div className="card-body p-5">
                          <div className="text-center">
                            <div className="fs-2 mb-3 text-content"><i className="bi bi-bookmarks"></i></div>
                            <h6 className="mb-0">Wishlist</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>


                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
