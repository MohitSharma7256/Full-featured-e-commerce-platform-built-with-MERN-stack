import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { getBrand } from "../Redux/ActionCreators/BrandActionCreators";
import { useDispatch, useSelector } from "react-redux";

function getSliderPreView() {
  if (window.innerWidth < 480) return 2;
  else if (window.innerWidth < 768) return 3;
  else if (window.innerWidth < 992) return 4;
  else return 5;
}

function BrandsSlider() {
  const dispatch = useDispatch();
  const BrandStateData = useSelector((state) => state.BrandStateData);

  const [sliderPreView, setSlidesPreView] = useState(getSliderPreView());

  useEffect(() => {
    dispatch(getBrand());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setSlidesPreView(getSliderPreView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // normalize brand data
  const data = Array.isArray(BrandStateData)
    ? BrandStateData
    : Array.isArray(BrandStateData?.data)
      ? BrandStateData.data
      : [];

  const options = {
    slidesPerView: sliderPreView,
    spaceBetween: 30,
    freeMode: true,
    loop: data.length > sliderPreView,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    modules: [FreeMode, Pagination, Autoplay],
    className: "mySwiper",
  };

  const BASE_URL = import.meta.env.VITE_SITE_IMAGE_SERVER || "http://localhost:8000";

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center pb-3">
          <h3 className="mb-0 h3 fw-bold">Shop By Brands</h3>
          <p className="mb-0 text-capitalize">Select your favorite brands and purchase</p>
        </div>
        <div className="brands">
          <Swiper {...options}>
            {data.length > 0 ? (
              data.map((brand, index) => (
                <SwiperSlide key={brand._id || index}>
                  <div className="p-3 border rounded brand-box text-center">
                    <Link to={`/shop/${brand.name || "brand"}`} className="d-block">
                      <img
                        src={brand.pic ? `${BASE_URL}/${brand.pic}` : "/assets/images/brands/01.webp"}
                        alt={brand.name || "Brand"}
                        className="img-fluid"
                        style={{ height: "100px", objectFit: "contain" }}
                        onError={(e) => (e.target.src = "/assets/images/brands/01.webp")}
                      />
                      <h6 className="fw-semibold mt-2">{brand.name || "Brand"}</h6>
                    </Link>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              [...Array(10)].map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="p-3 border rounded brand-box text-center">
                    <img
                      src={`/assets/images/brands/${String(i + 1).padStart(2, "0")}.webp`}
                      alt={`Brand ${i + 1}`}
                      className="img-fluid"
                      style={{ height: "100px", objectFit: "contain" }}
                    />
                    <h6 className="fw-semibold mt-2">Brand {i + 1}</h6>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default BrandsSlider;
