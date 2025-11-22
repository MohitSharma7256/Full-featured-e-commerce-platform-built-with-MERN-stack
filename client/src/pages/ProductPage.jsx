import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import BreadCrumb from '../components/BreadCrumb'

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


import ProductSlider from '../components/ProductSlider'

import { getProduct } from "../Redux/ActionCreators/ProductActionCreators"
import { getCart, createCart } from "../Redux/ActionCreators/CartActionCreators"
import { getWishlist, createWishlist } from "../Redux/ActionCreators/WishlistActionCreators"
import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators"
export default function ProductPage() {
    let [thumbsSwiper, setThumbsSwiper] = useState(null);

    let { _id } = useParams()
    let [input, setInput] = useState({
        qty: 1,
        color: "",
        size: ""
    })
    let [totalReviews, setTotalReviews] = useState(5)
    let [data, setData] = useState({})
    let [relatedProducts, setRelatedProducts] = useState([])
    let [reviews, setReviews] = useState([])
    let [reviewStats, setReviewStats] = useState({
        stats: [],
        total: 0,
        average: 0
    })


    let ProductStateData = useSelector(state => state.ProductStateData)
    let CartStateData = useSelector(state => state.CartStateData)
    let WishlistStateData = useSelector(state => state.WishlistStateData)
    let TestimonialStateData = useSelector(state => state.TestimonialStateData)

    let dispatch = useDispatch()
    let navigate = useNavigate()

    function quantity(value) {
        if (value === "min" && input.qty > 1)
            return input.qty - 1
        else if (value === "plus" && input.qty < data.stockQuantity)
            return input.qty + 1
        else
            return input.qty
    }
    function getInputData(option, value) {
        setInput((old) => {
            return {
                ...old,
                [option]: option === "qty" ? quantity(value) : value
            }
        })
    }

    function addToCart() {
        let item = CartStateData.find(x => x.user?._id === localStorage.getItem("userid") && x.product?._id === _id)
        if (!item) {
            item = {
                user: localStorage.getItem("userid"),
                product: _id,
                color: input.color,
                size: input.size,
                quantity: input.qty,
                total: input.qty * data.finalPrice
            }
            dispatch(createCart(item))
        }
        navigate("/cart")
    }

    function addToWishlist() {
        let item = WishlistStateData.find(x => x.user?.name === localStorage.getItem("userid") && x.product?.name === _id)
        if (!item) {
            item = {
                user: localStorage.getItem("userid"),
                product: _id
            }
            dispatch(createWishlist(item))
        }
        navigate("/wishlist")
    }

    useEffect(() => {
        dispatch(getProduct())
        if (ProductStateData.length) {
            let item = ProductStateData.find(x => x._id === _id)
            setData(item)
            setInput({
                qty: 1,
                color: item.color[0],
                size: item.size[0],
            })
            setRelatedProducts(ProductStateData.filter(x => x.active && x.maincategory?.name === item.maincategory?.name))
        }
    }, [ProductStateData.length, _id])

    useEffect(() => {
        (() => {
            dispatch(getCart())
        })()
    }, [CartStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getWishlist())
        })()
    }, [WishlistStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getTestimonial())
            if (TestimonialStateData.length) {
                let data = TestimonialStateData.filter(x => x.product === _id)
                setReviews(data)
                let sum = 0
                let stats = []
                data.forEach(r => {
                    stats[r.star] = stats[r.star] ? stats[r.star] + 1 : 1
                    sum = sum + r.star
                });
                setReviewStats({
                    total: data.length,
                    stats: stats,
                    average: (sum / data.length).toFixed(1)
                })
            }
        })()
    }, [TestimonialStateData.length])
    return (
        <div className="page-content">
            <BreadCrumb title="Product" />
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 col-xl-7">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                }}
                                loop={data.pic?.length > 1}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                            >
                                {
                                    data.pic?.map((item, index) => {
                                        return <SwiperSlide key={index}>
                                            <img src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item}`} style={{ height: 500, width: "100%" }} />
                                        </SwiperSlide>
                                    })
                                }
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={data.pic?.length > 4}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {
                                    data.pic?.map((item, index) => {
                                        return <SwiperSlide key={index}>
                                            <img src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item}`} style={{ height: 100, width: "100%" }} />
                                        </SwiperSlide>
                                    })
                                }
                            </Swiper>
                        </div>
                        <div className="col-12 col-xl-5">
                            <div className="product-info">
                                <h4 className="product-title fw-bold mb-1">{data.name}<span className='float-end'>({data.stock ? `${data.stockQuantity} Left In Stock` : "Out of Stock"})</span></h4>
                                <p className="mb-0">{data.maincategory?.name} - {data.subcategory?.name} - {data.brand?.name}</p>
                                <div className="product-rating">
                                    <div className="hstack gap-2 border p-1 mt-3 width-content">
                                        <div><span className="rating-number">{reviewStats?.average}</span><i className="bi bi-star-fill ms-1 text-warning"></i></div>
                                        <div className="vr"></div>
                                        <div>{reviewStats.total} Ratings</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="product-price d-flex align-items-center gap-3">
                                    <div className="h4 fw-bold">&#8377;{data.finalPrice}</div>
                                    <div className="h5 fw-light text-muted text-decoration-line-through">&#8377;{data.basePrice}</div>
                                    <div className="h4 fw-bold text-danger">({data.discount}% off)</div>
                                </div>
                                <p className="fw-bold mb-0 mt-1 text-success">inclusive of all taxes</p>

                                <div className="size-chart mt-4">
                                    <h6 className="fw-bold mb-3">Select Color</h6>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        {
                                            data.color?.map((item, index) => {
                                                return <div className="" key={index}>
                                                    <button type="button" onClick={() => getInputData("color", item)} className={`${item === input.color ? 'border-dark text-dark' : ''}`}>{item}</button>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="size-chart mt-4">
                                    <h6 className="fw-bold mb-3">Select Size</h6>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        {
                                            data.size?.map((item, index) => {
                                                return <div className="" key={index}>
                                                    <button type="button" onClick={() => getInputData("size", item)} className={`${item === input.size ? 'border-dark text-dark' : ''}`}>{item}</button>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="btn-group mt-3" style={{ width: 150 }}>
                                    <button className='btn btn-dark' onClick={() => getInputData("qty", "min")}><i className='bi bi-dash'></i></button>
                                    <h3 className='w-50 text-center'>{input.qty}</h3>
                                    <button className='btn btn-dark' onClick={() => getInputData("qty", "plus")}><i className='bi bi-plus'></i></button>
                                </div>
                                <div className="cart-buttons mt-3">
                                    <div className="buttons d-flex flex-column flex-lg-row gap-3 mt-4">
                                        {data.stock ?
                                            <>
                                                <button className="btn btn-lg btn-dark btn-ecomm px-5 py-3 col-lg-6" onClick={addToCart}><i className="bi bi-basket2 me-2"></i>Add to Cart</button>
                                            </> : null}
                                        <button className="btn btn-lg btn-outline-dark btn-ecomm px-5 py-3" onClick={addToWishlist}><i className="bi bi-suit-heart me-2"></i>Wishlist</button>
                                    </div>
                                </div>
                                <hr className="my-3" />
                                <div className="product-info">
                                    <h6 className="fw-bold mb-3">Product Details</h6>
                                    <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                </div>
                                <hr className="my-3" />
                                <div className="customer-ratings">
                                    <h6 className="fw-bold mb-3">Customer Ratings</h6>
                                    <div className="d-flex align-items-center gap-4 gap-lg-5 flex-wrap flex-lg-nowrap">
                                        <div className="" style={{ width: 350 }}>
                                            <h1 className="mb-2 fw-bold">{reviewStats?.average}<span className="fs-5 ms-2 text-warning"><i className="bi bi-star-fill"></i></span></h1>
                                            <p className="mb-0">{reviewStats?.total} Verified Buyers</p>
                                        </div>
                                        <div className="vr d-none d-lg-block"></div>
                                        <div className="w-100">
                                            <div className="rating-wrrap hstack gap-2 align-items-center">
                                                <p className="mb-0">5</p>
                                                <div className=""><i className="bi bi-star"></i></div>
                                                <div className="progress flex-grow-1 mb-0 rounded-0" style={{ height: "4px" }}>
                                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: (reviewStats.total / reviewStats.stats[5] * 100) + "%" }}></div>
                                                </div>
                                                <p className="mb-0">{reviewStats.stats[5]}</p>
                                            </div>
                                            <div className="rating-wrrap hstack gap-2 align-items-center">
                                                <p className="mb-0">4</p>
                                                <div className=""><i className="bi bi-star"></i></div>
                                                <div className="progress flex-grow-1 mb-0 rounded-0" style={{ height: "4px" }}>
                                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: (reviewStats.total / reviewStats.stats[4] * 100) + "%" }}></div>
                                                </div>
                                                <p className="mb-0">{reviewStats.stats[4]}</p>
                                            </div>
                                            <div className="rating-wrrap hstack gap-2 align-items-center">
                                                <p className="mb-0">3</p>
                                                <div className=""><i className="bi bi-star"></i></div>
                                                <div className="progress flex-grow-1 mb-0 rounded-0" style={{ height: "4px" }}>
                                                    <div className="progress-bar bg-info" role="progressbar" style={{ width: (reviewStats.total / reviewStats.stats[3] * 100) + "%" }}></div>
                                                </div>
                                                <p className="mb-0">{reviewStats.stats[3]}</p>
                                            </div>
                                            <div className="rating-wrrap hstack gap-2 align-items-center">
                                                <p className="mb-0">2</p>
                                                <div className=""><i className="bi bi-star"></i></div>
                                                <div className="progress flex-grow-1 mb-0 rounded-0" style={{ height: "4px" }}>
                                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: (reviewStats.total / reviewStats.stats[2] * 100) + "%" }}></div>
                                                </div>
                                                <p className="mb-0">{reviewStats.stats[2]}</p>
                                            </div>
                                            <div className="rating-wrrap hstack gap-2 align-items-center">
                                                <p className="mb-0">1</p>
                                                <div className=""><i className="bi bi-star"></i></div>
                                                <div className="progress flex-grow-1 mb-0 rounded-0" style={{ height: "4px" }}>
                                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: (reviewStats.total / reviewStats.stats[1] * 100) + "%" }}></div>
                                                </div>
                                                <p className="mb-0">{reviewStats.stats[1]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-3" />
                                <div className="customer-reviews">
                                    <h6 className="fw-bold mb-3">Customer Reviews ({reviewStats.total})</h6>
                                    <div className="reviews-wrapper">
                                        {
                                            reviews.slice(0, totalReviews).map(item => {
                                                return <div key={item._id}>
                                                    <div className="d-flex flex-column flex-lg-row gap-3">
                                                        <div className=""><span className="badge bg-green rounded-0">{item.star}<i className="bi bi-star-fill ms-1"></i></span></div>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-2">{item.message}</p>
                                                            <div className="d-flex flex-column flex-sm-row gap-3 mt-3">
                                                                <div className="hstack flex-grow-1 gap-3">
                                                                    <p className="mb-0">{item.name}</p>
                                                                    <div className="vr"></div>
                                                                    <div className="date-posted">{new Date(item.date).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            })
                                        }
                                        {
                                            reviewStats.total > 5 ?
                                                <div className="text-center">
                                                    <button onClick={() => setTotalReviews(reviewStats.total)} className="btn btn-ecomm btn-outline-dark">View All Reviws<i className="bi bi-arrow-right ms-2"></i></button>
                                                </div> : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-3">
                {relatedProducts.length ? <ProductSlider title="Related Products" data={relatedProducts} /> : null}
            </div>
        </div>
    )
}
