// ============================================
// 1. ENHANCED CartPage.jsx
// ============================================
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';

import BreadCrumb from '../components/BreadCrumb'
import { getCart, updateCart, deleteCart } from "../Redux/ActionCreators/CartActionCreators"
import { createWishlist, getWishlist } from "../Redux/ActionCreators/WishlistActionCreators"
import OrderDetails from '../components/OrderDetails'
import { Link } from 'react-router-dom';

export default function CartPage() {
    let [cart, setCart] = useState([])
    let [subtotal, setSubtotal] = useState(0)
    let [deliveryCharge, setDeliveryCharge] = useState(0)
    let [total, setTotal] = useState(0)
    let [deliveryType, setDeliveryType] = useState(() => {
        return localStorage.getItem('selectedDeliveryType') || 'standard'
    })

    let CartStateData = useSelector(state => state.CartStateData)
    let WishlistStateData = useSelector(state => state.WishlistStateData)
    let dispatch = useDispatch()

    const DELIVERY_CONFIG = {
        FREE_SHIPPING_THRESHOLD: 1000,
        EXPRESS_FREE_THRESHOLD: 3000,
        STANDARD_CHARGE: 150,
        EXPRESS_CHARGE_BELOW_1000: 250,
        EXPRESS_CHARGE_ABOVE_1000: 150
    }

    function updateRecord(option, cartItemId) {
        let item = cart.find(x => x._id === cartItemId)
        if (!item) return

        let index = cart.findIndex(x => x._id === cartItemId)
        let newQuantity = item.quantity
        let newTotal = item.total

        if (option === "DEC") {
            if (item.quantity <= 1) {
                notify("Quantity cannot be less than 1")
                return
            }
            newQuantity = item.quantity - 1
            newTotal = newQuantity * item.product?.finalPrice
        }
        else if (option === "INC") {
            if (item.quantity >= item.product?.stockQuantity) {
                notify(`Only ${item.product?.stockQuantity} items available in stock`)
                return
            }
            newQuantity = item.quantity + 1
            newTotal = newQuantity * item.product?.finalPrice
        }

        const updatedItem = {
            ...item,
            quantity: newQuantity,
            total: newTotal
        }

        const updatedCart = [...cart]
        updatedCart[index] = updatedItem
        setCart(updatedCart)
        
        // Recalculate and auto-select delivery type if needed
        calculateTotalsWithAutoDelivery(updatedCart, deliveryType)

        dispatch(updateCart(updatedItem))
    }

    async function deleteRecord(cartItemId) {
        if (window.confirm("Are You Sure to Remove That Item From Cart?")) {
            const updatedCart = cart.filter(x => x._id !== cartItemId)
            setCart(updatedCart)
            calculateTotalsWithAutoDelivery(updatedCart, deliveryType)

            dispatch(deleteCart({ _id: cartItemId }))
            notify("Item removed from cart")
        }
    }

    function addToWishlist(productId) {
        let item = WishlistStateData.find(x =>
            x.user?._id === localStorage.getItem("userid") &&
            x.product?._id === productId
        )

        if (!item) {
            dispatch(createWishlist({
                user: localStorage.getItem("userid"),
                product: productId,
            }))
            notify("Item Added to Wishlist")
        }
        else {
            notify("Item Already Exist in Wishlist")
        }
    }

    const notify = (msg) => toast(msg);

    // Calculate totals with automatic delivery type selection
    function calculateTotalsWithAutoDelivery(cartItems, selectedDeliveryType) {
        let sum = cartItems.reduce((acc, x) => acc + x.total, 0)
        
        // Auto-select express delivery if subtotal >= 3000
        let autoDeliveryType = selectedDeliveryType
        if (sum >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD) {
            autoDeliveryType = 'express'
            if (selectedDeliveryType !== 'express') {
                setDeliveryType('express')
                localStorage.setItem('selectedDeliveryType', 'express')
                notify("Express delivery automatically selected for free!")
            }
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
        calculateTotalsWithAutoDelivery(cart, type)
        localStorage.setItem('selectedDeliveryType', type)
    }

    useEffect(() => {
        dispatch(getCart())
        dispatch(getWishlist())
    }, [dispatch])

    useEffect(() => {
        if (Array.isArray(CartStateData)) {
            // Remove duplicates by product ID
            const uniqueCart = CartStateData.reduce((acc, item) => {
                const existingIndex = acc.findIndex(
                    x => x.product?._id === item.product?._id
                )
                
                if (existingIndex === -1) {
                    acc.push(item)
                } else {
                    if (item.quantity > acc[existingIndex].quantity) {
                        acc[existingIndex] = item
                    }
                }
                return acc
            }, [])
            
            setCart(uniqueCart)
            calculateTotalsWithAutoDelivery(uniqueCart, deliveryType)
        }
    }, [CartStateData])

    return (
        <div className="page-content">
            <BreadCrumb title="Cart" />
            <section className="section-padding">
                <div className="container">
                    <div className="d-flex align-items-center px-3 py-2 border mb-4">
                        <div className="text-start">
                            <h4 className="mb-0 h4 fw-bold">My Bag ({cart.length} items)</h4>
                        </div>
                        <div className="ms-auto">
                            <Link to="/shop" className="btn btn-light btn-dark">Continue Shopping</Link>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-xl-8">
                            {cart.length === 0 ? (
                                <div className="text-center py-5">
                                    <h5>Your cart is empty</h5>
                                    <Link to="/shop" className="btn btn-dark mt-3">Start Shopping</Link>
                                </div>
                            ) : (
                                cart.map((item) => {
                                    return (
                                        <div className="card rounded-0 mb-3" key={item._id}>
                                            <div className="card-body">
                                                <div className="d-flex flex-column flex-lg-row gap-3">
                                                    <div className="product-img">
                                                        <img
                                                            src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.product?.pic[0]}`}
                                                            width="200px"
                                                            height="200px"
                                                            alt={item.product?.name}
                                                        />
                                                    </div>

                                                    <div className="product-info flex-grow-1">
                                                        <h5 className="fw-bold mb-0">{item.product?.name}</h5>
                                                        <h6 className="fw-bold mb-0">({item.product?.stockQuantity} Left In Stock)</h6>

                                                        <div className="product-price d-flex align-items-center gap-2 mt-3">
                                                            <div className="h6 fw-bold">
                                                                ₹{item.product?.finalPrice} x {item.quantity} = ₹{item.total}
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 hstack gap-2">
                                                            <button type="button" className="btn btn-sm btn-light border rounded-0">
                                                                Size: {item.size}
                                                            </button>
                                                            <button type="button" className="btn btn-sm btn-light border rounded-0">
                                                                Color: {item.color}
                                                            </button>
                                                        </div>

                                                        <div className='mt-3'>
                                                            <div className="btn-group">
                                                                <button className='btn btn-sm btn-dark'
                                                                    onClick={() => updateRecord('DEC', item._id)}>
                                                                    <i className='bi bi-dash fs-5'></i>
                                                                </button>

                                                                <h3 style={{ width: 50 }}
                                                                    className='text-center'>{item.quantity}</h3>

                                                                <button className='btn btn-sm btn-dark'
                                                                    onClick={() => updateRecord('INC', item._id)}>
                                                                    <i className='bi bi-plus fs-5'></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-none d-lg-block vr"></div>

                                                    <div className="d-grid gap-2 align-self-start align-self-lg-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-ecomm"
                                                            onClick={() => deleteRecord(item._id)}
                                                        >
                                                            <i className="bi bi-x-lg me-2"></i>Remove
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn dark btn-ecomm"
                                                            onClick={() => addToWishlist(item.product?._id)}
                                                        >
                                                            <i className="bi bi-suit-heart me-2"></i>Move to Wishlist
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        <div className="col-12 col-xl-4">
                            {cart.length > 0 && (
                                <div>
                                    {/* Delivery Options */}
                                    <div className="card rounded-0 mb-3">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-3">Delivery Options</h5>
                                            
                                            {/* Auto-selection message */}
                                            {subtotal >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD && (
                                                <div className="alert alert-success py-2 px-3 mb-3">
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    <small><strong>Express delivery is FREE for your order!</strong></small>
                                                </div>
                                            )}

                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="deliveryOption"
                                                    id="standardDelivery"
                                                    checked={deliveryType === 'standard'}
                                                    onChange={() => handleDeliveryTypeChange('standard')}
                                                />
                                                <label className="form-check-label" htmlFor="standardDelivery">
                                                    Standard Delivery
                                                    <br />
                                                    <small className="text-muted">
                                                        {subtotal >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ?
                                                            'FREE (5-7 business days)' :
                                                            `₹${DELIVERY_CONFIG.STANDARD_CHARGE} (5-7 business days)`
                                                        }
                                                    </small>
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="deliveryOption"
                                                    id="expressDelivery"
                                                    checked={deliveryType === 'express'}
                                                    onChange={() => handleDeliveryTypeChange('express')}
                                                />
                                                <label className="form-check-label" htmlFor="expressDelivery">
                                                    Express Delivery
                                                    <br />
                                                    <small className="text-muted">
                                                        {subtotal >= DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD ?
                                                            'FREE (2-3 business days)' :
                                                            subtotal >= DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD ?
                                                                `₹${DELIVERY_CONFIG.EXPRESS_CHARGE_ABOVE_1000} (2-3 business days)` :
                                                                `₹${DELIVERY_CONFIG.EXPRESS_CHARGE_BELOW_1000} (2-3 business days)`
                                                        }
                                                    </small>
                                                </label>
                                            </div>

                                            <div className="mt-3 p-2 bg-light rounded">
                                                <small className="text-muted">
                                                    <strong>Delivery Information:</strong><br />
                                                    • Free standard delivery on orders ≥ ₹{DELIVERY_CONFIG.FREE_SHIPPING_THRESHOLD}<br />
                                                    • Free express delivery on orders ≥ ₹{DELIVERY_CONFIG.EXPRESS_FREE_THRESHOLD}<br />
                                                    • Express: ₹{DELIVERY_CONFIG.EXPRESS_CHARGE_BELOW_1000} (&lt;₹1000), ₹{DELIVERY_CONFIG.EXPRESS_CHARGE_ABOVE_1000} (₹1000-2999)
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <OrderDetails
                                        subtotal={subtotal}
                                        shipping={deliveryCharge}
                                        total={total}
                                        deliveryType={deliveryType}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Toaster
                position='bottom-left'
                toastOptions={{
                    style: {
                        border: '1px solid #713200',
                        padding: '10px',
                        color: 'green',
                    },
                }}
            />
        </div>
    )
}