import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderDetails({ subtotal, shipping, total }) {
    return (
        <div className="card rounded-0 mb-3">
            <div className="card-body">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="hstack align-items-center justify-content-between">
                    <p className="mb-0">Bag Total</p>
                    <p className="mb-0">&#8377;{subtotal}</p>
                </div>
                <hr />
                <hr />
                <div className="hstack align-items-center justify-content-between">
                    <p className="mb-0">Delivery</p>
                    <p className="mb-0">&#8377;{shipping}</p>
                </div>
                <hr />
                <div className="hstack align-items-center justify-content-between fw-bold text-content">
                    <p className="mb-0">Total Amount</p>
                    <p className="mb-0">&#8377;{total}</p>
                </div>
                <div className="d-grid mt-4">
                    <Link to="/checkout" className="btn btn-dark btn-ecomm py-3 px-5">Place Order</Link>
                </div>
            </div>
        </div>
    )
}
