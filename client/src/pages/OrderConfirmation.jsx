import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import { Link } from 'react-router-dom'

export default function OrderConfirmationPage() {
    return (
        <div className="page-content">
            <BreadCrumb title="Order Has Been Placed" />
            <section className="section-padding">
                <div className="container">

                    <div className="separator mb-3">
                        <div className="line"></div>
                        <h3 className="mb-0 h3 fw-bold">Thank You!</h3>
                        <div className="line"></div>
                    </div>

                    <div className="border p-4 text-center w-100">
                        <h5 className="fw-bold mb-2">Thank You for Shopping With us.</h5>
                        <p className="mb-0">Now You Can Track Your Order in <Link to="/orders">Orders Page</Link></p>
                        <p><Link to="/shop">Shop More</Link> With Us</p>
                        <p><Link to="/orders">See Your Orders</Link></p>

                    </div>

                </div>
            </section>
        </div>
    )
}
