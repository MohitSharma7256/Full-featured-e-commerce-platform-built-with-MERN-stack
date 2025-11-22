import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import BreadCrumb from '../components/BreadCrumb'
import BuyerSidebar from '../components/BuyerSidebar'

import { getCheckout } from "../Redux/ActionCreators/CheckoutActionCreators"
import { getTestimonial, createTestimonial, updateTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators"

export default function OrdersPage() {
    let [pid, setPid] = useState("")
    let [reviews, setReviews] = useState([])
    let [message, setMessage] = useState("")
    let [data, setData] = useState({
        message: "",
        star: 5,
    })
    let [orders, setOrders] = useState([])

    let CheckoutStateData = useSelector(state => state.CheckoutStateData)
    let TestimonialStateData = useSelector(state => state.TestimonialStateData)

    let dispatch = useDispatch()

    function getInputData(e) {
        let { name, value } = e.target
        setMessage("")
        setData(old => {
            return {
                ...old,
                [name]: name === "star" ? parseInt(value) : value
            }
        })
    }

    function postData(e) {
        e.preventDefault()
        if (data._id) {
            dispatch(updateTestimonial({ ...data }))
            setMessage("Thank You. Your Review Has Been Updated")
        }
        else {
            dispatch(createTestimonial({
                ...data,
                name: localStorage.getItem("name"),
                user: localStorage.getItem("userid"),
                product: pid,
                date: new Date()
            }))
            setMessage("Thank You. Your Review Has Been Submitted")
        }
    }

    function check(pid) {
        if (!reviews.length) return false
        let result = reviews.find(x => x.user === localStorage.getItem("userid") && x.product === pid)
        return result
    }

    // Fetch orders and testimonials
    useEffect(() => {
        dispatch(getCheckout())
        dispatch(getTestimonial())
    }, [dispatch])

    // Update orders when CheckoutStateData changes
    useEffect(() => {
        if (CheckoutStateData && CheckoutStateData.length) {
            const userId = localStorage.getItem("userid")
            const userOrders = CheckoutStateData.filter(item => {
                // Handle both cases: user as object or string
                if (item.user && typeof item.user === 'object') {
                    return item.user._id === userId || item.user.user === userId
                } else {
                    return item.user === userId
                }
            })
            setOrders(userOrders)
        }
    }, [CheckoutStateData])

    // Update reviews when TestimonialStateData changes
    useEffect(() => {
        if (TestimonialStateData && TestimonialStateData.length) {
            const userId = localStorage.getItem("userid")
            const userReviews = TestimonialStateData.filter(item => item.user === userId)
            setReviews(userReviews)
        }
    }, [TestimonialStateData])

    return (
        <div className="page-content">
            <BreadCrumb title="Orders" />
            <section className="section-padding">
                <div className="container">
                    <div className="d-flex align-items-center px-3 py-2 border mb-4">
                        <div className="text-start">
                            <h4 className="mb-0 h4 fw-bold">Account - Orders</h4>
                        </div>
                    </div>
                    <div className="btn btn-dark btn-ecomm d-xl-none position-fixed top-50 start-0 translate-middle-y" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarFilter">
                        <span><i className="bi bi-person me-2"></i>Account</span>
                    </div>
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
                            {orders.length === 0 ? (
                                <div className="text-center py-5">
                                    <h5>No orders found</h5>
                                    <p className="text-muted">You haven't placed any orders yet.</p>
                                    <Link to="/products" className="btn btn-dark">Start Shopping</Link>
                                </div>
                            ) : (
                                orders.map(item => {
                                    return (
                                        <div className="card rounded-0 mb-3" key={item._id}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="table-responsive">
                                                        <table className='table table-bordered'>
                                                            <tbody>
                                                                <tr>
                                                                    <th>Order Id</th>
                                                                    <td>{item._id}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Order Status</th>
                                                                    <td>{item.orderStatus}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Payment Mode</th>
                                                                    <td>{item.paymentMode}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Payment Status</th>
                                                                    <td>
                                                                        {item.paymentStatus}
                                                                        {item.paymentMode === 'COD' && item.paymentStatus === 'Pending' && (
                                                                            <Link
                                                                                to="/payment"
                                                                                state={{ order: item }}
                                                                                className="btn btn-sm btn-dark ms-2"
                                                                            >
                                                                                Pay Now
                                                                            </Link>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Subtotal</th>
                                                                    <td>&#8377;{item.subtotal}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Shipping</th>
                                                                    <td>&#8377;{item.shipping}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Total</th>
                                                                    <td>&#8377;{item.total}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <td>{new Date(item.createdAt || item.date).toLocaleString()}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-body">
                                                        {item?.products?.map((p, index) => {
                                                            // Safely access product data
                                                            const product = p.product || p
                                                            const productName = product.name || "Product"
                                                            const productBrand = product.brand?.name || product.brand || "Brand"
                                                            const productImage = product.pic || ""

                                                            return (
                                                                <div className="d-flex flex-xl-row gap-3 mb-3" key={index}>
                                                                    <div className="product-img">
                                                                        <img
                                                                            src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${productImage}`}
                                                                            width="120"
                                                                            height={100}
                                                                            alt={productName}
                                                                            onError={(e) => {
                                                                                e.target.src = '/placeholder-image.jpg' // Add a placeholder image
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="product-info flex-grow-1">
                                                                        <h5 className="fw-bold mb-1">{productName}</h5>
                                                                        <p className="mb-0">{productBrand} - {p.color}</p>
                                                                        <div className="mt-3 hstack gap-2">
                                                                            <button type="button" className="btn btn-sm border rounded-0">Size: {p.size}</button>
                                                                            <button type="button" className="btn btn-sm border rounded-0">Qty: {p.quantity}</button>
                                                                            <Link
                                                                                to={`/product/${product._id || p.product}`}
                                                                                className="btn btn-sm btn-light border rounded-0"
                                                                            >
                                                                                Buy Again
                                                                            </Link>
                                                                            {check(product._id || p.product) ? (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-light border rounded-0"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#exampleModal"
                                                                                    onClick={() => {
                                                                                        setMessage("")
                                                                                        setPid(product._id || p.product)
                                                                                        let reviewItem = reviews.find(x => x.product === (product._id || p.product))
                                                                                        setData({ ...reviewItem })
                                                                                    }}
                                                                                >
                                                                                    Edit Your Review
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-light border rounded-0"
                                                                                    onClick={() => {
                                                                                        setMessage("")
                                                                                        setPid(product._id || p.product)
                                                                                        setData({
                                                                                            message: "",
                                                                                            star: 5
                                                                                        })
                                                                                    }}
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#exampleModal"
                                                                                >
                                                                                    Write a Review
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Review Modal */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">What You Think About It</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                {message && <p className='text-center my-3 text-success'>{message}</p>}
                                <form onSubmit={postData}>
                                    <div className="modal-body">
                                        <textarea
                                            name="message"
                                            value={data.message}
                                            onChange={getInputData}
                                            placeholder='Write Here...'
                                            className='form-control border-dark'
                                            rows={5}
                                            required
                                        ></textarea>
                                        <div className="row my-3">
                                            <div className="col-md-6">
                                                <label>Rating</label>
                                            </div>
                                            <div className="col-md-6">
                                                <select name="star" value={data.star} className='form-select' onChange={getInputData}>
                                                    <option value={5}>5 Stars</option>
                                                    <option value={4}>4 Stars</option>
                                                    <option value={3}>3 Stars</option>
                                                    <option value={2}>2 Stars</option>
                                                    <option value={1}>1 Star</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}