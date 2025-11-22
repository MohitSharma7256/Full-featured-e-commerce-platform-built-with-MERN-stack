import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

function getSliderPreView() {
  if (window.innerWidth < 480) return 1;
  else if (window.innerWidth < 768) return 2;
  else return 3;
}

function CategorySlider({ title = "Category", data = [] }) {
  const [sliderPreView, setSlidesPreView] = useState(getSliderPreView());
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setSlidesPreView(getSliderPreView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const BASE_URL =
    import.meta.env.VITE_SITE_IMAGE_SERVER || "http://localhost:8000";

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

  // ✅ Handle click — navigate by type (maincategory/subcategory)
  const handleClick = (itemName) => {
    if (!itemName) return;
    const paramKey =
      title?.toLowerCase() === "maincategory"
        ? "mc"
        : title?.toLowerCase() === "subcategory"
        ? "sc"
        : "cat";

    navigate(`/shop?${paramKey}=${encodeURIComponent(itemName)}`);
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center pb-3">
          <h3 className="mb-0 h3 fw-bold">Shop By {title}</h3>
          <p className="mb-0 text-capitalize">
            Select your favorite {title} and purchase
          </p>
        </div>

        <div className="brands">
          <Swiper {...options}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <SwiperSlide key={item._id || item.id || index}>
                  <div
                    className="p-3 border rounded brand-box text-center"
                    onClick={() => handleClick(item.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        item.pic
                          ? `${BASE_URL}/${item.pic}`
                          : "/assets/images/brands/01.webp"
                      }
                      alt={item.name || "Category"}
                      className="img-fluid"
                      style={{
                        height: 300,
                        width: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) =>
                        (e.target.src = "/assets/images/brands/01.webp")
                      }
                    />
                    <h6 className="fw-semibold mt-2">
                      {item.name || "Category"}
                    </h6>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              [...Array(6)].map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="p-3 border rounded brand-box text-center">
                    <img
                      src={`/assets/images/brands/${String(i + 1).padStart(
                        2,
                        "0"
                      )}.webp`}
                      alt={`Category ${i + 1}`}
                      className="img-fluid"
                      style={{
                        height: 300,
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <h6 className="fw-semibold mt-2">
                      Category {i + 1}
                    </h6>
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

export default CategorySlider;
