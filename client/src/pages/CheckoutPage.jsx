// Complete CheckoutPage.jsx - Full Code
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import BreadCrumb from '../components/BreadCrumb'
import { getCart, deleteCart } from "../Redux/ActionCreators/CartActionCreators"
import { createCheckout } from "../Redux/ActionCreators/CheckoutActionCreators"
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"

export default function CheckoutPage() {
    // State management
    let [outOfStock, setOutOfStock] = useState(false)
    let [address, setAddress] = useState([])
    let [selectedAddress, setSelectedAddress] = useState({})
    let [showAddressForm, setShowAddressForm] = useState(false)

    // Sync delivery type from Cart page via localStorage
    const [deliveryType, setDeliveryType] = useState(() => {
        return localStorage.getItem('selectedDeliveryType') || 'standard'
    })

    let [mode, setMode] = useState("COD")
    // const [rzpLoaded, setRzpLoaded] = useState(false) // Removed
    let [loading, setLoading] = useState(true)
    // let [placingOrder, setPlacingOrder] = useState(false) // Removed

    let [cart, setCart] = useState([])
    let [subtotal, setSubtotal] = useState(0)
    let [deliveryCharge, setDeliveryCharge] = useState(0)
    let [total, setTotal] = useState(0)

    // Redux state
    let CartStateData = useSelector(state => state.CartStateData)
    let ProductStateData = useSelector(state => state.ProductStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    // Delivery configuration
    const DELIVERY_CONFIG = {
        FREE_SHIPPING_THRESHOLD: 1000,
        EXPRESS_FREE_THRESHOLD: 3000,
        STANDARD_CHARGE: 150,
        EXPRESS_CHARGE_BELOW_1000: 250,
        EXPRESS_CHARGE_ABOVE_1000: 150
    }

    const notify = (msg) => toast(msg)

    // Calculate totals with automatic express delivery selection
    function calculateTotals(cartItems, selectedDeliveryType) {
        let sum = cartItems.reduce((acc, x) => acc + (x.total || 0), 0)

        // Auto-select express delivery if total >= 3000
        let autoDeliveryType = selectedDeliveryType
        if (sum >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD && selectedDeliveryType !== 'express') {
            autoDeliveryType = 'express'
            setDeliveryType('express')
            localStorage.setItem('selectedDeliveryType', 'express')
            notify("🎉 Express delivery automatically selected - It's FREE!")
        }

        let delivery = 0
        if (sum > 0) {
            if (autoDeliveryType === 'standard') {
                delivery = sum < DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD
                    ? DELIVERY_CONFIG.STANDARD_CHARGE
                    : 0
            } else {
                if (sum >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD) delivery = 0
                else if (sum >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD) delivery = DELIVERY_CONFIG.EXPRESS_CHARGE_ABOVE_1000
                else delivery = DELIVERY_CONFIG.EXPRESS_CHARGE_BELOW_1000
            }
        }

        setSubtotal(sum)
        setDeliveryCharge(delivery)
        setTotal(sum + delivery)
    }

    function handleDeliveryTypeChange(type) {
        setDeliveryType(type)
        calculateTotals(cart, type)
        localStorage.setItem('selectedDeliveryType', type)
    }

    // Proceed to Payment Page
    function proceedToPayment() {
        if (!selectedAddress || !selectedAddress._id) {
            notify("Please select a delivery address")
            return
        }

        if (!cart || cart.length === 0) {
            notify("Your cart is empty")
            return
        }

        // Validate stock availability before proceeding
        let stockCheck = true
        let outOfStockItems = []

        cart.forEach(item => {
            let product = ProductStateData.find(x =>
                x._id === (item.product?._id || item.product)
            )
            if (!product || product.stockQuantity < item.quantity) {
                stockCheck = false
                outOfStockItems.push(item.product?.name || 'Unknown product')
            }
        })

        if (!stockCheck) {
            notify(`❌ Out of stock: ${outOfStockItems.join(', ')}`)
            return
        }

        // Navigate to Payment Page with state
        navigate('/payment', {
            state: {
                selectedAddress,
                deliveryType
            }
        })
    }

    // Fetch user addresses
    async function fetchAddresses() {
        try {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/address/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "authorization": localStorage.getItem("token"),
                    "content-type": "application/json"
                }
            })
            response = await response.json()
            if (response.data && response.data.length > 0) {
                setAddress(response.data)
                setSelectedAddress(response.data[0])
            } else {
                setAddress([])
            }
        } catch (error) {
            console.error("Error fetching addresses:", error)
        }
    }

    // Add new address
    async function addNewAddress(newAddress) {
        try {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/address`, {
                method: "POST",
                headers: {
                    "authorization": localStorage.getItem("token"),
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    ...newAddress,
                    user: localStorage.getItem("userid")
                })
            })
            response = await response.json()
            if (response.data) {
                await fetchAddresses()
                setSelectedAddress(response.data)
                notify("✅ Address added successfully")
            }
        } catch (error) {
            console.error("Error adding address:", error)
            notify("❌ Failed to add address")
        }
    }

    // Address Form Component
    const AddressForm = ({ onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            pin: ''
        })

        const handleSubmit = (e) => {
            e.preventDefault()
            onSave(formData)
        }

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }

        return (
            <div className="card rounded-0 mb-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Add New Address</h6>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <textarea
                                    name="address"
                                    placeholder="Full Address"
                                    className="form-control"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="col-md-4 mb-3">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    className="form-control"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <input
                                    type="text"
                                    name="pin"
                                    placeholder="PIN Code"
                                    className="form-control"
                                    value={formData.pin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-dark me-2">Save Address</button>
                                <button type="button" onClick={onCancel} className="btn btn-outline-dark">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // Initial data load
    useEffect(() => {
        fetchAddresses()
        dispatch(getCart())
        dispatch(getProduct())
    }, [dispatch])

    // Update cart when Redux state changes
    useEffect(() => {
        if (Array.isArray(CartStateData)) {
            const userId = localStorage.getItem("userid")
            const userCart = CartStateData.filter(x =>
                x.user === userId || x.user?._id === userId
            )

            setCart(userCart)
            calculateTotals(userCart, deliveryType)

            // Check stock availability
            if (userCart.length > 0 && ProductStateData?.length > 0) {
                let hasOutOfStock = userCart.some(item => {
                    let product = ProductStateData.find(x =>
                        x._id === (item.product?._id || item.product)
                    )
                    return !product || !product.stock || product.stockQuantity < item.quantity
                })
                setOutOfStock(hasOutOfStock)
            }

            setLoading(false)
        }
    }, [CartStateData, ProductStateData, deliveryType])

    // Loading state
    if (loading) {
        return (
            <div className="page-content">
                <BreadCrumb title="Checkout" />
                <section className="section-padding">
                    <div className="container text-center py-5">
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading your cart...</p>
                    </div>
                </section>
            </div>
        )
    }

    // Main render
    return (
        <div className="page-content">
            <BreadCrumb title="Checkout" />
            <section className="section-padding">
                <div className="container">
                    {/* Header */}
                    <div className="d-flex align-items-center px-3 py-2 border mb-4">
                        <h4 className="mb-0 fw-bold">Checkout</h4>
                        <button
                            className="btn btn-outline-dark ms-auto"
                            onClick={() => navigate('/cart')}
                        >
                            <i className="bi bi-arrow-left me-2"></i>Back to Cart
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* Left Column - Address, Delivery, Payment */}
                        <div className="col-12 col-lg-6">

                            {/* Delivery Address Section */}
                            <h6 className="fw-bold mb-3 py-2 px-3 bg-light">
                                <i className="bi bi-geo-alt me-2"></i>Delivery Address
                            </h6>

                            {showAddressForm ? (
                                <AddressForm
                                    onSave={(addressData) => {
                                        addNewAddress(addressData)
                                        setShowAddressForm(false)
                                    }}
                                    onCancel={() => setShowAddressForm(false)}
                                />
                            ) : (
                                <>
                                    {address.length > 0 ? (
                                        <>
                                            {address.map(item => (
                                                <div
                                                    key={item._id}
                                                    className="card rounded-0 mb-3"
                                                    onClick={() => setSelectedAddress(item)}
                                                    style={{
                                                        border: selectedAddress?._id === item._id ? '2px solid #000' : '1px solid #dee2e6',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div className="flex-grow-1">
                                                                <h6 className="fw-bold mb-1">
                                                                    {item.name}
                                                                    {selectedAddress?._id === item._id && (
                                                                        <span className="badge bg-dark ms-2">Selected</span>
                                                                    )}
                                                                </h6>
                                                                <p className="mb-1 text-muted small">{item.address}</p>
                                                                <p className="mb-1 text-muted small">
                                                                    {item.city}, {item.state} - {item.pin}
                                                                </p>
                                                                <p className="mb-0 text-muted small">
                                                                    📞 {item.phone} | ✉️ {item.email}
                                                                </p>
                                                            </div>
                                                            {selectedAddress?._id === item._id && (
                                                                <i className='bi bi-check-circle-fill fs-4 text-success'></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                className="btn btn-outline-dark w-100 mb-4"
                                                onClick={() => setShowAddressForm(true)}
                                            >
                                                <i className="bi bi-plus-circle me-2"></i>Add New Address
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 mb-4">
                                            <i className="bi bi-geo-alt fs-1 text-muted"></i>
                                            <p className="text-muted mt-2">No addresses found</p>
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => setShowAddressForm(true)}
                                            >
                                                <i className="bi bi-plus-circle me-2"></i>Add Address
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Delivery Options Section */}
                            <h6 className="fw-bold mb-3 py-2 px-3 bg-light">
                                <i className="bi bi-truck me-2"></i>Delivery Options
                            </h6>
                            <div className="card rounded-0 mb-3">
                                <div className="card-body">
                                    {subtotal >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD && (
                                        <div className="alert alert-success py-2 mb-3">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <small><strong>Free Express Delivery Applied!</strong></small>
                                        </div>
                                    )}

                                    <div className="form-check mb-3 p-3 border rounded" style={{
                                        backgroundColor: deliveryType === 'standard' ? '#f8f9fa' : 'transparent'
                                    }}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="checkoutStandard"
                                            checked={deliveryType === 'standard'}
                                            onChange={() => handleDeliveryTypeChange('standard')}
                                        />
                                        <label className="form-check-label w-100" htmlFor="checkoutStandard">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>Standard Delivery</strong><br />
                                                    <small className="text-muted">5-7 business days</small>
                                                </div>
                                                <div className="text-end">
                                                    <strong className={subtotal >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ? 'text-success' : ''}>
                                                        {subtotal >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ?
                                                            'FREE' : `₹${DELIVERY_CONFIG.STANDARD_CHARGE}`}
                                                    </strong>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-check p-3 border rounded" style={{
                                        backgroundColor: deliveryType === 'express' ? '#f8f9fa' : 'transparent'
                                    }}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="checkoutExpress"
                                            checked={deliveryType === 'express'}
                                            onChange={() => handleDeliveryTypeChange('express')}
                                        />
                                        <label className="form-check-label w-100" htmlFor="checkoutExpress">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>Express Delivery</strong><br />
                                                    <small className="text-muted">2-3 business days</small>
                                                </div>
                                                <div className="text-end">
                                                    <strong className={subtotal >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD ? 'text-success' : ''}>
                                                        {subtotal >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD ? 'FREE' :
                                                            subtotal >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ?
                                                                `₹${DELIVERY_CONFIG.EXPRESS_CHARGE_ABOVE_1000}` :
                                                                `₹${DELIVERY_CONFIG.EXPRESS_CHARGE_BELOW_1000}`}
                                                    </strong>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="col-12 col-lg-6">
                            <div className="card rounded-0 sticky-top" style={{ top: '20px' }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4 text-center">Order Summary</h5>

                                    {cart && cart.length > 0 ? (
                                        <>
                                            {/* Cart Items */}
                                            <div className="order-items mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                {cart.map(item => (
                                                    <div key={item._id} className="d-flex mb-3 pb-3 border-bottom">
                                                        <img
                                                            src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.product?.pic?.[0]}`}
                                                            width="80"
                                                            height="80"
                                                            className="rounded me-3"
                                                            alt={item.product?.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/80'
                                                            }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">{item.product?.name}</h6>
                                                            <small className="text-muted">
                                                                {item.color} | {item.size}
                                                            </small>
                                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                                <span className="text-muted small">Qty: {item.quantity}</span>
                                                                <span className="fw-bold">₹{item.total}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Price Breakdown */}
                                            <div className="border-top pt-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">Subtotal ({cart.length} items)</span>
                                                    <span className="fw-semibold">₹{subtotal}</span>
                                                </div>

                                                <div className="d-flex justify-content-between mb-2">
                                                    <div>
                                                        <span className="text-muted">Delivery</span>
                                                        <br />
                                                        <small className="text-muted">
                                                            {deliveryType === 'standard' ? 'Standard' : 'Express'}
                                                            {' '}({deliveryType === 'standard' ? '5-7' : '2-3'} days)
                                                        </small>
                                                    </div>
                                                    <span className={`fw-semibold ${deliveryCharge === 0 ? 'text-success' : ''}`}>
                                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                                    </span>
                                                </div>

                                                {deliveryCharge === 0 && subtotal > 0 && (
                                                    <div className="alert alert-success py-2 mb-2">
                                                        <small>
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            You saved ₹{deliveryType === 'standard' ?
                                                                DELIVERY_CONFIG.STANDARD_CHARGE :
                                                                DELIVERY_CONFIG.EXPRESS_CHARGE_BELOW_1000} on delivery!
                                                        </small>
                                                    </div>
                                                )}

                                                <hr className="my-3" />

                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <h5 className="mb-0 fw-bold">Total Amount</h5>
                                                    <h5 className="mb-0 fw-bold text-dark">₹{total}</h5>
                                                </div>

                                                {/* Out of Stock Warning */}
                                                {outOfStock && (
                                                    <div className="alert alert-danger text-center mb-3">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        <strong>Some items are out of stock</strong>
                                                    </div>
                                                )}

                                                {/* Proceed to Payment Button */}
                                                <div className="d-grid">
                                                    <button
                                                        type="button"
                                                        onClick={proceedToPayment}
                                                        className="btn btn-dark btn-lg py-3"
                                                        disabled={!selectedAddress._id || cart.length === 0 || outOfStock}
                                                        style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {cart.length === 0 ? (
                                                            "Cart is Empty"
                                                        ) : !selectedAddress._id ? (
                                                            <>
                                                                <i className="bi bi-exclamation-circle me-2"></i>
                                                                Select Delivery Address
                                                            </>
                                                        ) : outOfStock ? (
                                                            <>
                                                                <i className="bi bi-x-circle me-2"></i>
                                                                Items Out of Stock
                                                            </>
                                                        ) : (
                                                            "Proceed to Payment"
                                                        )}
                                                    </button>
                                                </div>



                                                {/* Additional Info */}
                                                <div className="mt-3 p-3 bg-light rounded">
                                                    <small className="text-muted">
                                                        <strong>Note:</strong><br />
                                                        • Free delivery on orders above ₹{DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD}<br />
                                                        • Free express on orders above ₹{DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD}<br />
                                                        • 7 days return policy<br />
                                                        • 100% secure payments
                                                    </small>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="bi bi-cart-x fs-1 text-muted"></i>
                                            <p className="text-muted mt-3 mb-3">Your cart is empty</p>
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => navigate('/shop')}
                                            >
                                                <i className="bi bi-shop me-2"></i>
                                                Start Shopping
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toast Notifications */}
            <Toaster
                position='bottom-center'
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#333',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    )
}