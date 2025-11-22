import React from "react";

function ViewProduct() {
  return (
    <>
      <div className="modal fade" id="QuickViewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-0">
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12 col-xl-6">
                  <div className="wrap-modal-slider">
                    <div className="slider-for">
                      <div>
                        <img
                          src="/assets/images/product-images/01.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/02.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/03.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/05.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>

                    <div className="slider-nav mt-3">
                      <div>
                        <img
                          src="/assets/images/product-images/01.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/02.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/03.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <img
                          src="/assets/images/product-images/04.jpg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-6">
                  <div className="product-info">
                    <h4 className="product-title fw-bold mb-1">
                      Check Pink Kurta
                    </h4>
                    <p className="mb-0">
                      Women Pink & Off-White Printed Kurta with Palazzos
                    </p>
                    <div className="product-rating">
                      <div className="hstack gap-2 border p-1 mt-3 width-content">
                        <div>
                          <span className="rating-number">4.8</span>
                          <i className="bi bi-star-fill ms-1 text-success"></i>
                        </div>
                        <div className="vr"></div>
                        <div>162 Ratings</div>
                      </div>
                    </div>
                    <hr />
                    <div className="product-price d-flex align-items-center gap-3">
                      <div className="h4 fw-bold">$458</div>
                      <div className="h5 fw-light text-muted text-decoration-line-through">
                        $2089
                      </div>
                      <div className="h4 fw-bold text-danger">(70% off)</div>
                    </div>
                    <p className="fw-bold mb-0 mt-1 text-success">
                      inclusive of all taxes
                    </p>

                    <div className="more-colors mt-3">
                      <h6 className="fw-bold mb-3">More Colors</h6>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="color-box bg-red"></div>
                        <div className="color-box bg-primary"></div>
                        <div className="color-box bg-yellow"></div>
                        <div className="color-box bg-purple"></div>
                        <div className="color-box bg-green"></div>
                      </div>
                    </div>

                    <div className="size-chart mt-3">
                      <h6 className="fw-bold mb-3">Select Size</h6>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="">
                          <button type="button" className="rounded-0">
                            XS
                          </button>
                        </div>
                        <div className="">
                          <button type="button" className="rounded-0">
                            S
                          </button>
                        </div>
                        <div className="">
                          <button type="button" className="rounded-0">
                            M
                          </button>
                        </div>
                        <div className="">
                          <button type="button" className="rounded-0">
                            L
                          </button>
                        </div>
                        <div className="">
                          <button type="button" className="rounded-0">
                            XL
                          </button>
                        </div>
                        <div className="">
                          <button type="button" className="rounded-0">
                            XXL
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="cart-buttons mt-3">
                      <div className="buttons d-flex flex-column gap-3 mt-4">
                        <a
                          href="javascript:;"
                          className="btn btn-lg btn-dark btn-ecomm px-5 py-3 flex-grow-1"
                        >
                          <i className="bi bi-basket2 me-2"></i>Add to Bag
                        </a>
                        <a
                          href="javascript:;"
                          className="btn btn-lg btn-outline-dark btn-ecomm px-5 py-3"
                        >
                          <i className="bi bi-suit-heart me-2"></i>Wishlist
                        </a>
                      </div>
                    </div>
                    <hr className="my-3" />
                    <div className="product-share">
                      <h6 className="fw-bold mb-3">Share This Product</h6>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="">
                          <button
                            type="button"
                            className="btn-social bg-twitter"
                          >
                            <i className="bi bi-twitter"></i>
                          </button>
                        </div>
                        <div className="">
                          <button
                            type="button"
                            className="btn-social bg-facebook"
                          >
                            <i className="bi bi-facebook"></i>
                          </button>
                        </div>
                        <div className="">
                          <button
                            type="button"
                            className="btn-social bg-linkden"
                          >
                            <i className="bi bi-linkedin"></i>
                          </button>
                        </div>
                        <div className="">
                          <button
                            type="button"
                            className="btn-social bg-youtube"
                          >
                            <i className="bi bi-youtube"></i>
                          </button>
                        </div>
                        <div className="">
                          <button
                            type="button"
                            className="btn-social bg-pinterest"
                          >
                            <i className="bi bi-pinterest"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="javascript:;" className="back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
}

export default ViewProduct;