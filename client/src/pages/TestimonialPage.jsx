import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

function getSliderPerView() {
    if (window.innerWidth < 480)
        return 1
    else if (window.innerWidth < 768)
        return 2
    else if (window.innerWidth < 992)
        return 3
    else
        return 4
}
import BreadCrumb from '../components/BreadCrumb'

import { getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators"
export default function TestimonialPage() {
    let [testimonial, setTestimonial] = useState([])
    let TestimonialStateData = useSelector(state => state.TestimonialStateData)
    let [sliderPerView, setSlidesPerView] = useState(getSliderPerView())
    let options = {
        slidesPerView: sliderPerView,
        spaceBetween: 30,
        freeMode: true,
        loop: testimonial.length > sliderPerView,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        modules: [FreeMode, Pagination, Autoplay],
        className: "mySwiper",

    }

    window.addEventListener("resize", () => {
        setSlidesPerView(getSliderPerView())
    });

    let dispatch = useDispatch()

    function getStar(id) {
        let review = testimonial.find(x => x._id === _id)
        if (review.star === 5)
            return "<i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i>"
        else
            return "<i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star-fill text-warning'></i><i class='bi bi-star text-warning'></i>"
    }

    useEffect(() => {
        (() => {
            dispatch(getTestimonial())
            if (TestimonialStateData.length) {
                setTestimonial(TestimonialStateData.filter(x => x.star >= 4))
            }
        })()
    }, [TestimonialStateData.length])
    return (
        <>
            <div className="page-content">
                <BreadCrumb title="Clients Reviews" />

                <section className="section-padding">
                    <div className="container">
                        <div className="text-center pb-3">
                            <h3 className="mb-0 h3 fw-bold">Our Customers Review</h3>
                            <p className="mb-0 text-capitalize">At Shopingo, our customers are at the heart of everything we do. Read genuine experiences shared by happy shoppers who love our quality, fast delivery, and reliable service. Their words inspire us to keep improving and delivering the best shopping experience every time you choose Shopingo.</p>
                        </div>
                        <div className="product-thumbs">
                            <Swiper {...options}>
                                {
                                    testimonial.map(item => {
                                        return <SwiperSlide key={item._id}>
                                            <div className='card p-3 border-3' style={{ backgroundColor: "#d7dae0" }}>
                                                <h6 className='text-center'>{item.name}</h6>
                                                <p className='text-center' dangerouslySetInnerHTML={{ __html: getStar(item.id) }} />
                                                <div className='testimonial-message'>{item.message}</div>
                                            </div>
                                        </SwiperSlide>
                                    })
                                }
                            </Swiper>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
