import React from 'react'
import { Link } from 'react-router-dom'

export default function BuyerSidebar() {
    return (
        <>
            <div className="offcanvas-body account-menu">
                <div className="list-group w-100 rounded-0">
                    <Link to="/dashboard" className="list-group-item active"><i className="bi bi-house-door me-2"></i>Dashboard</Link>
                    <Link to="/profile" className="list-group-item"><i className="bi bi-person me-2"></i>Profile</Link>
                    <Link to="/update-profile" className="list-group-item"><i className="bi bi-pencil me-2"></i>Edit Profile</Link>
                    <Link to="/buyer-address" className="list-group-item"><i className="bi bi-pin-map me-2"></i>Saved Address</Link>
                    <Link to="/orders" className="list-group-item"><i className="bi bi-basket3 me-2"></i>Orders</Link>
                    <Link to="/wishlist" className="list-group-item"><i className="bi bi-suit-heart me-2"></i>Wishlist</Link>
                </div>
            </div>
        </>
    )
}
