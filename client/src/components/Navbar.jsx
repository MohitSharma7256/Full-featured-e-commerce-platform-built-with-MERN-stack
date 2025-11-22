import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { getMaincategory } from "../Redux/ActionCreators/MaincategoryActionCreators"
import { getSubcategory } from "../Redux/ActionCreators/SubcategoryActionCreators"
import { getBrand } from "../Redux/ActionCreators/BrandActionCreators"
import { deleteCart, getCart } from "../Redux/ActionCreators/CartActionCreators"
export default function Navbar() {
  let [cart, setCart] = useState([])
  let MaincategoryStateDataRaw = useSelector(state => state.MaincategoryStateData)
  let SubcategoryStateDataRaw = useSelector(state => state.SubcategoryStateData)
  let BrandStateDataRaw = useSelector(state => state.BrandStateData)
  let CartStateDataRaw = useSelector(state => state.CartStateData)
  const MaincategoryStateData = Array.isArray(MaincategoryStateDataRaw) ? MaincategoryStateDataRaw : []
  const SubcategoryStateData = Array.isArray(SubcategoryStateDataRaw) ? SubcategoryStateDataRaw : []
  const BrandStateData = Array.isArray(BrandStateDataRaw) ? BrandStateDataRaw : []
  const CartStateData = Array.isArray(CartStateDataRaw) ? CartStateDataRaw : []

  let dispatch = useDispatch()
  let navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/login")
  }

  function deleteRecord(_id) {
    if (confirm("Are You Sure to Remove That Item From Cart  : ")) {
      dispatch(deleteCart({ _id: _id }))
      getAPIData()
    }
  }

  function getAPIData() {
    dispatch(getCart())
    if (Array.isArray(CartStateData) && CartStateData.length)
      setCart(CartStateData.filter(x => x.user === localStorage.getItem("userid")))
    else
      setCart([])
  }

  useEffect(() => {
    dispatch(getMaincategory())
  }, [MaincategoryStateData.length])

  useEffect(() => {
    dispatch(getSubcategory())
  }, [SubcategoryStateData.length])

  useEffect(() => {
    dispatch(getBrand())
  }, [BrandStateData.length])

  useEffect(() => {
    getAPIData()
  }, [CartStateData.length])
  return (
    <>
      <header className="top-header">
        <nav className="navbar navbar-expand-xl w-100 navbar-dark container gap-3">
          <Link className="navbar-brand d-none d-xl-inline" to="/"><img src="/assets/images/E-Cart1.png" className="logo-img" alt="Logo" /></Link>
          <a className="mobile-menu-btn d-inline d-xl-none" href="javascript:;" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar">
            <i className="bi bi-list"></i>
          </a>
          <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar">
            <div className="offcanvas-header">
              <div className="offcanvas-logo"><Link to="/"><img src="/assets/images/E-Cart1.png" className="logo-img" alt="Logo" /></Link>
              </div>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body primary-menu">
              <ul className="navbar-nav justify-content-start flex-grow-1 gap-1">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="tv-shows.html"
                    data-bs-toggle="dropdown">
                    Categories
                  </a>
                  <div className="dropdown-menu dropdown-large-menu">
                    <div className="row">
                      <div className="col-12 col-xl-3">
                        <h6 className="large-menu-title">Maincategories</h6>
                        <ul className="list-unstyled">
                          {
                            MaincategoryStateData.filter(x => x.active).map((item) => {
                              const key = item._id || item.id || item.name
                              return <li key={key}>
                                <Link to={`/shop?mc=${item.name}`}>{item.name}</Link>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                      <div className="col-12 col-xl-3">
                        <h6 className="large-menu-title">Subcategories</h6>
                        <ul className="list-unstyled">
                          {
                            SubcategoryStateData.filter(x => x.active).map((item) => {
                              const key = item._id || item.id || item.name
                              return <li key={key}>
                                <Link to={`/shop?sc=${item.name}`}>{item.name}</Link>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                      <div className="col-12 col-xl-3">
                        <h6 className="large-menu-title">Brands</h6>
                        <ul className="list-unstyled">
                          {
                            BrandStateData.filter(x => x.active).map((item) => {
                              const key = item._id || item.id || item.name
                              return <li key={key}>
                                <Link to={`/shop?br=${item.name}`}>{item.name}</Link>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                      <div className="col-12 col-xl-3 d-none d-xl-block">
                        <div className="pramotion-banner1">
                          <img src="/assets/images/menu-img.webp" className="img-fluid" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                {/* <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;" data-bs-toggle="dropdown">
                                        Shop
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="cart.html">Shop Cart</a></li>
                                        <li><a className="dropdown-item" href="wishlist.html">Wishlist</a></li>
                                        <li><a className="dropdown-item" href="product-details.html">Product Details</a></li>
                                        <li><a className="dropdown-item" href="payment-method.html">Payment Method</a></li>
                                        <li><a className="dropdown-item" href="billing-details.html">Billing Details</a></li>
                                        <li><a className="dropdown-item" href="address.html">Addresses</a></li>
                                        <li><a className="dropdown-item" href="shop-grid.html">Shop Grid</a></li>
                                        <li><a className="dropdown-item" href="shop-grid-type-4.html">Shop Grid 4</a></li>
                                        <li><a className="dropdown-item" href="shop-grid-type-5.html">Shop Grid 5</a></li>
                                        <li><a className="dropdown-item" href="search.html">Search</a></li>
                                    </ul>
                                </li> */}

                <li className="nav-item">
                  <Link className="nav-link" to="/shop">Shop</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/feature">Features</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/testimonialpage">Testimonial</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contactus">Contact</Link>
                </li>
                {
                  localStorage.getItem("login") ?
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;" data-bs-toggle="dropdown">
                        {localStorage.getItem("name")}
                      </a>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                        {
                          localStorage.getItem("role") !== "Buyer" ?
                            <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li> : null
                        }
                        <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                        <li><Link className="dropdown-item" to="/update-profile">Edit Profile</Link></li>
                        <li><Link className="dropdown-item" to="/cart">Cart</Link></li>
                        <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                        <li><Link className="dropdown-item" to="/wishlist">Wishlist</Link></li>
                        <li><Link className="dropdown-item" to="/buyer-address">Addresses</Link></li>
                        <hr />
                        <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                      </ul>
                    </li> :
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                }
              </ul>
            </div>
          </div>
          <ul className="navbar-nav secondary-menu flex-row">
            <li className="nav-item">
              <a className="nav-link dark-mode-icon" href="javascript:;">
                <div className="mode-icon">
                  <i className="bi bi-moon"></i>
                </div>
              </a>
            </li>
            {/* <li className="nav-item">
                            <a className="nav-link" href="search.html"><i className="bi bi-search"></i></a>
                        </li> */}
            {
              localStorage.getItem("login") ?
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/wishlist"><i className="bi bi-suit-heart"></i></Link>
                  </li>
                  <li className="nav-item" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
                    <a className="nav-link position-relative" href="javascript:;">
                      <div className="cart-badge">8</div>
                      <i className="bi bi-basket2"></i>
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard"><i className="bi bi-person-circle"></i></Link>
                  </li>
                </> : null
            }
          </ul>
        </nav>
      </header>

      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header bg-section-2">
          <h5 className="mb-0 fw-bold" id="offcanvasRightLabel">{cart.length} items in the cart</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="cart-list">
            {
              cart.map(item => {
                return <div key={item._id}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bottom-product-img">
                      <a href="product-details.html">
                        <img src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.pic}`} width={80} height={80} alt="" />
                      </a>
                    </div>
                    <div className="">
                      <h6 className="mb-0 fw-light mb-1">{item.name}</h6>
                      <p className="mb-0"><strong>{item.qty} X &#8377;{item.price}</strong>
                      </p>
                    </div>
                    <div className="ms-auto fs-5">
                      <button className="btn btn-danger" onClick={() => deleteRecord(item.id)}><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                  <hr />
                </div>
              })
            }
          </div>
        </div>
        {
          cart.length ?
            <div className="offcanvas-footer p-3 border-top">
              <div className="d-grid">
                <Link to="/checkout" className="btn btn-lg btn-dark btn-ecomm px-5 py-3">Checkout</Link>
              </div>
            </div> : null
        }

      </div>

    </>
  )
}
