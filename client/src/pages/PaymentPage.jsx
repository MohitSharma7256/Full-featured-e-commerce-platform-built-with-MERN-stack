import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import BreadCrumb from '../components/BreadCrumb'
import { getCart, deleteCart } from "../Redux/ActionCreators/CartActionCreators"
import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"

export default function PaymentPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    // Get data passed from CheckoutPage
    const { selectedAddress, deliveryType } = location.state || {}

    // Redirect if no address selected AND no existing order
    useEffect(() => {
        if (!selectedAddress && !location.state?.order) {
            navigate('/checkout')
        }
    }, [selectedAddress, navigate, location.state])

    // State
    const [mode, setMode] = useState("COD")
    const [rzpLoaded, setRzpLoaded] = useState(false)
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [cart, setCart] = useState([])
    const [subtotal, setSubtotal] = useState(0)
    const [deliveryCharge, setDeliveryCharge] = useState(0)
    const [total, setTotal] = useState(0)

    // Redux state
    let CartStateData = useSelector(state => state.CartStateData)
    let ProductStateData = useSelector(state => state.ProductStateData)

    const notify = (msg) => toast(msg)

    // Delivery Config (Same as CheckoutPage)
    const DELIVERY_CONFIG = {
        FREE_SHIPPING_THRESHOLD: 1000,
        EXPRESS_FREE_THRESHOLD: 3000,
        STANDARD_CHARGE: 150,
        EXPRESS_CHARGE_BELOW_1000: 250,
        EXPRESS_CHARGE_ABOVE_1000: 150
    }

    // Calculate totals
    function calculateTotals(cartItems, type) {
        let sum = cartItems.reduce((acc, x) => acc + (x.total || 0), 0)
        let delivery = 0

        if (sum > 0) {
            if (type === 'standard') {
                delivery = sum < DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ? DELIVERY_CONFIG.STANDARD_CHARGE : 0
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

    // Initial Data Load
    useEffect(() => {
        // If paying for existing order, set data from location state
        if (location.state?.order) {
            const order = location.state.order
            setSubtotal(order.subtotal)
            setDeliveryCharge(order.shipping)
            setTotal(order.total)
            setMode("Razorpay") // Force Razorpay for pending payments
            setLoading(false)
        } else {
            // Normal checkout flow
            dispatch(getCart())
            dispatch(getProduct())
        }
    }, [dispatch, location.state])

    // Update Cart State (only if NOT paying for existing order)
    useEffect(() => {
        if (!location.state?.order && Array.isArray(CartStateData)) {
            const userId = localStorage.getItem("userid")
            const userCart = CartStateData.filter(x => x.user === userId || x.user?._id === userId)
            setCart(userCart)
            calculateTotals(userCart, deliveryType)
            setLoading(false)
        }
    }, [CartStateData, deliveryType, location.state])

    // Load Razorpay Script
    useEffect(() => {
        if (rzpLoaded) return
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => setRzpLoaded(true)
        script.onerror = () => notify("Failed to load payment gateway")
        document.body.appendChild(script)
        return () => {
            if (document.body.contains(script)) document.body.removeChild(script)
        }
    }, [])

    // Razorpay Payment
    async function payWithRazorpay() {
        if (!rzpLoaded) {
            notify("Payment gateway not loaded. Please refresh.")
            return
        }

        // Handle existing order payment
        if (location.state?.order) {
            const order = location.state.order
            setPlacingOrder(true)
            try {
                // 1. Create Order
                const amountPaise = Math.round(order.total * 100)
                const orderResponse = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/payment/create-order`, {
                    method: 'POST',
                    headers: {
                        'authorization': localStorage.getItem('token'),
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amountPaise,
                        currency: 'INR',
                        receipt: `rcpt_${order._id}`
                    })
                })
                const orderData = await orderResponse.json()
                if (orderData.result !== 'Done') throw new Error(orderData.reason || 'Failed to create order')

                // 2. Open Razorpay
                const options = {
                    key: orderData.data.keyId,
                    amount: orderData.data.amount,
                    currency: orderData.data.currency,
                    name: 'E-Cart',
                    description: `Payment for Order #${order._id}`,
                    order_id: orderData.data.id,
                    prefill: {
                        name: localStorage.getItem('name') || order.deliveryAddress?.name,
                        email: order.deliveryAddress?.email || 'customer@example.com',
                        contact: order.deliveryAddress?.phone || '9999999999',
                    },
                    theme: { color: '#000000' },
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment for Existing Order
                            const verifyResponse = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/payment/verify-order`, {
                                method: 'POST',
                                headers: {
                                    'authorization': localStorage.getItem('token'),
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: order._id
                                })
                            })
                            const verifyData = await verifyResponse.json()

                            if (verifyData.result === 'Done') {
                                notify("✅ Payment successful!")
                                setTimeout(() => navigate('/orders'), 1500)
                            } else {
                                throw new Error(verifyData.reason || 'Verification failed')
                            }
                        } catch (error) {
                            console.error(error)
                            notify(`❌ Payment verification failed: ${error.message}`)
                        } finally {
                            setPlacingOrder(false)
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setPlacingOrder(false)
                            notify("Payment cancelled")
                        }
                    }
                }
                const rzp = new window.Razorpay(options)
                rzp.on('payment.failed', function (response) {
                    notify(`❌ Payment failed: ${response.error.description}`)
                    setPlacingOrder(false)
                })
                rzp.open()
            } catch (error) {
                console.error(error)
                notify(`❌ Payment error: ${error.message}`)
                setPlacingOrder(false)
            }
            return
        }

        // Handle new cart order
        if (!cart.length) {
            notify("Your cart is empty")
            return
        }

        setPlacingOrder(true)
        try {
            // 1. Create Order
            const amountPaise = Math.round(total * 100)
            const orderResponse = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'authorization': localStorage.getItem('token'),
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ amount: amountPaise, currency: 'INR' })
            })
            const orderData = await orderResponse.json()
            if (orderData.result !== 'Done') throw new Error(orderData.reason || 'Failed to create order')

            // 2. Open Razorpay
            const options = {
                key: orderData.data.keyId,
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: 'E-Cart',
                description: 'Order Payment',
                order_id: orderData.data.id,
                prefill: {
                    name: localStorage.getItem('name') || selectedAddress.name,
                    email: selectedAddress.email || 'customer@example.com',
                    contact: selectedAddress.phone || '9999999999',
                },
                theme: { color: '#000000' },
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const checkoutData = {
                            user: localStorage.getItem("userid"),
                            deliveryAddress: selectedAddress._id,
                            orderStatus: "Order is Placed",
                            paymentMode: "Razorpay",
                            paymentStatus: "Paid",
                            subtotal, shipping: deliveryCharge, total, deliveryType,
                            products: cart.map(item => ({
                                product: item.product?._id || item.product,
                                color: item.color, size: item.size, quantity: item.quantity, total: item.total
                            }))
                        }

                        const verifyResponse = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'authorization': localStorage.getItem('token'),
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: checkoutData
                            })
                        })
                        const verifyData = await verifyResponse.json()

                        if (verifyData.result === 'Done') {
                            // Clear Cart & Redirect
                            await Promise.all(cart.map(item => dispatch(deleteCart({ _id: item._id }))))
                            dispatch(getProduct()) // Refresh product stock
                            setCart([])
                            notify("✅ Payment successful! Order placed.")
                            setTimeout(() => navigate('/orders'), 1500)
                        } else {
                            throw new Error(verifyData.reason || 'Verification failed')
                        }
                    } catch (error) {
                        console.error(error)
                        notify(`❌ Payment verification failed: ${error.message}`)
                    } finally {
                        setPlacingOrder(false)
                    }
                },
                modal: {
                    ondismiss: function () {
                        setPlacingOrder(false)
                        notify("Payment cancelled")
                    }
                }
            }
            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', function (response) {
                notify(`❌ Payment failed: ${response.error.description}`)
                setPlacingOrder(false)
            })
            rzp.open()
        } catch (error) {
            console.error(error)
            notify(`❌ Payment error: ${error.message}`)
            setPlacingOrder(false)
        }
    }

    // COD Payment
    async function placeOrder() {
        if (placingOrder) return
        if (!cart.length) {
            notify("Your cart is empty")
            return
        }

        // Stock Check
        let stockCheck = true
        let outOfStockItems = []
        cart.forEach(item => {
            let product = ProductStateData.find(x => x._id === (item.product?._id || item.product))
            if (!product || product.stockQuantity < item.quantity) {
                stockCheck = false
                outOfStockItems.push(item.product?.name || 'Unknown product')
            }
        })

        if (!stockCheck) {
            notify(`❌ Out of stock: ${outOfStockItems.join(', ')}`)
            return
        }

        setPlacingOrder(true)
        const orderData = {
            user: localStorage.getItem("userid"),
            deliveryAddress: selectedAddress._id,
            orderStatus: "Order is Placed",
            paymentMode: "COD",
            paymentStatus: "Pending",
            subtotal, shipping: deliveryCharge, total, deliveryType,
            products: cart.map(item => ({
                product: item.product?._id || item.product,
                color: item.color, size: item.size, quantity: item.quantity, total: item.total
            }))
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/checkout`, {
                method: "POST",
                headers: {
                    "authorization": localStorage.getItem("token"),
                    "content-type": "application/json"
                },
                body: JSON.stringify(orderData)
            })
            const responseData = await response.json()

            if (responseData.result === "Done") {
                await Promise.all(cart.map(item => dispatch(deleteCart({ _id: item._id }))))
                dispatch(getProduct()) // Refresh product stock
                setCart([])
                notify("✅ Order placed successfully!")
                setTimeout(() => navigate("/orders"), 1500)
            } else {
                throw new Error(responseData.reason || "Order creation failed")
            }
        } catch (error) {
            console.error(error)
            notify(`❌ Error: ${error.message}`)
        } finally {
            setPlacingOrder(false)
        }
    }

    if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>

    return (
        <div className="page-content">
            <BreadCrumb title="Payment" />
            <section className="section-padding">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="card rounded-0 mb-4">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0 fw-bold">Select Payment Method</h5>
                                </div>
                                <div className="card-body">
                                    {!location.state?.order && (
                                        <div className="form-check mb-3 p-3 border rounded" style={{ backgroundColor: mode === 'COD' ? '#f8f9fa' : 'transparent' }}>
                                            <input className="form-check-input" type="radio" id="codPayment" checked={mode === 'COD'} onChange={() => setMode('COD')} />
                                            <label className="form-check-label w-100" htmlFor="codPayment">
                                                <strong><i className="bi bi-cash-stack me-2"></i>Cash on Delivery</strong>
                                                <div className="text-muted small">Pay when you receive the order</div>
                                            </label>
                                        </div>
                                    )}
                                    <div className="form-check p-3 border rounded" style={{ backgroundColor: mode === 'Razorpay' ? '#f8f9fa' : 'transparent' }}>
                                        <input className="form-check-input" type="radio" id="onlinePayment" checked={mode === 'Razorpay'} onChange={() => setMode('Razorpay')} />
                                        <label className="form-check-label w-100" htmlFor="onlinePayment">
                                            <strong><i className="bi bi-credit-card-2-front me-2"></i>Pay Online (Razorpay)</strong>
                                            <div className="text-muted small">Credit/Debit Card, UPI, Net Banking</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="card rounded-0">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0 fw-bold">Order Summary</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal</span>
                                        <span>&#8377;{subtotal}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping</span>
                                        <span className={deliveryCharge === 0 ? "text-success" : ""}>
                                            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <strong>Total</strong>
                                        <strong>&#8377;{total}</strong>
                                    </div>
                                    <button
                                        className="btn btn-dark w-100 py-2"
                                        onClick={mode === 'COD' ? placeOrder : payWithRazorpay}
                                        disabled={placingOrder}
                                    >
                                        {placingOrder ? "Processing..." : location.state?.order ? "Pay Now" : "Place Order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
