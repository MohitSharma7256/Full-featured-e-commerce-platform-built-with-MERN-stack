import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import ProductCard from './ProductCard';
function getSliderPerView() {
    if (window.innerWidth < 480)
        return 2
    else if (window.innerWidth < 768)
        return 3
    else if (window.innerWidth < 992)
        return 4
    else
        return 5
}
export default function ProductSlider({ title, data }) {
    let [sliderPerView, setSlidesPerView] = useState(getSliderPerView())
    let options = {
        slidesPerView: sliderPerView,
        spaceBetween: 30,
        freeMode: true,
        loop: data.length > sliderPerView,
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


    return (
        <>
            <section className="section-padding">
                <div className="container">
                    <div className="text-center pb-3">
                        <h3 className="mb-0 h3 fw-bold">{title} Products</h3>
                        <p className="mb-0 text-capitalize">Checkout Our Latest Products</p>
                    </div>
                    <div className="product-thumbs">
                        <Swiper {...options}>
                            {
                                data.map(item => {
                                    return <SwiperSlide key={item._id}>
                                        <ProductCard item={item} />
                                    </SwiperSlide>
                                })
                            }
                        </Swiper>
                    </div>
                </div>
            </section>
        </>
    )
}
