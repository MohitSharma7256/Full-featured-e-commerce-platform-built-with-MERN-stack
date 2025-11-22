import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ item }) {
    return (
        <div className="card">
            <div className="position-relative overflow-hidden">
                <div
                    className="product-options d-flex align-items-center justify-content-center gap-2 mx-auto position-absolute bottom-0 start-0 end-0">
                    <Link to={`/product/${item._id}`} className='w-100'>{item.brand.name}</Link>
                </div>

                <Link to={`/product/${item._id}`}>
                    <img
                        src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.pic[0]}`}
                        className="card-img-top"
                        style={{ height: 250, width: "100%", objectFit: "cover" }}
                        alt={item.name || "Product Image"}
                    />
                </Link>
            </div>

            <div className="card-body">
                <div className="product-info text-center">
                    <h6 className="mb-1 fw-bold product-name text-truncate" style={{ height: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', whiteSpace: 'normal', overflow: 'hidden' }}>{item.name}</h6>

                    {/* Rating stars */}
                    <div className="ratings mb-1 h6">
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                    </div>

                    {/* Price section (same as first code) */}
                    <div className="mb-0 h6 fw-bold product-price text-center text-success">
                        {item?.basePrice && (
                            <del className="text-danger me-1">&#8377;{item.basePrice}</del>
                        )}
                        &#8377;{item.finalPrice}
                        {item?.discount ? (
                            <sup className="text-danger">{item.discount}% Off</sup>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
