import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import BreadCrumb from '../components/BreadCrumb';
import { getWishlist, deleteWishlist } from "../Redux/ActionCreators/WishlistActionCreators";

export default function WishlistPage() {
    const wishlist = useSelector(state => state.WishlistStateData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const deleteRecord = (_id) => {
        if (window.confirm("Are You Sure to Remove This Item From Wishlist?")) {
            dispatch(deleteWishlist({ _id }));
        }
    };

    // Empty Wishlist
    if (!wishlist?.length) {
        return (
            <div className="page-content text-center py-5">
                <BreadCrumb title="Wishlist" />
                <h4>Your Wishlist is Empty</h4>
                <Link to="/shop" className="btn btn-dark btn-ecomm">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="page-content">
            <BreadCrumb title="Wishlist Section" />
            <section className="section-padding">
                <div className="container">
                    <div className="d-flex align-items-center px-3 py-2 border mb-4">
                        <div className="text-start">
                            <h4 className="mb-0 h4 fw-bold">Wishlist ({wishlist.length} Items)</h4>
                        </div>
                        <div className="ms-auto">
                            <Link to="/shop" className="btn btn-dark btn-ecomm">Continue Shopping</Link>
                        </div>
                    </div>

                    <div className="similar-products">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-4">
                            {wishlist.map(item => {
                                const product = item.product;
                                if (!product) return null;

                                return (
                                    <div className="col" key={item._id}>
                                        <div 
                                            className="card rounded-0 position-relative"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            {/* Close Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteRecord(item._id);
                                                }}
                                                className="btn-close position-absolute end-0 top-0"
                                                style={{ zIndex: 10, margin: '10px' }}
                                            />

                                            {/* Image */}
                                            <img
                                                src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${product.pic?.[0]}`}
                                                className="card-img-top rounded-0"
                                                alt={product.name}
                                                style={{ height: '350px', width: '100%', objectFit: 'cover' }}
                                            />

                                            {/* Body */}
                                            <div className="card-body border-top text-center">
                                                <p className="mb-0 product-short-name">{product.name}</p>
                                                <div className="product-price d-flex align-items-center gap-2 mt-2 justify-content-center">
                                                    <div className="h6 fw-bold">₹{product.finalPrice}</div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="card-footer bg-transparent text-center">
                                                <Link
                                                    to={`/product/${product._id}`}
                                                    className="btn btn-dark w-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Move to Bag
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}