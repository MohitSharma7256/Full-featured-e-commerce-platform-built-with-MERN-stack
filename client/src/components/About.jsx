import React from "react";
import BrandsSlider from "./BrandsSlider";
import Features from "./Features";

function About() {
  return (
    <>
      {/* <!--start product details--> */}
      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-xl-6">
              <h3 className="fw-bold">Our Story</h3>
              <p>
                At E-Cart, we believe shopping should be simple, exciting, and reliable.
                What started as a small idea to make online shopping easier has now grown into a trusted destination for thousands of happy customers.
              </p>
              <p>
                Our journey began with a passion for quality products and exceptional service. Over the years, we’ve built a platform that brings together a wide range of categories — from fashion and electronics to daily essentials — all in one place. We’re committed to offering products that meet your needs and enhance your lifestyle.
              </p>
              <p>
                Unlike many others, our story isn’t just about selling — it’s about connecting people with the things they love. With secure payments, fast delivery, and customer-first support, E-Cart continues to redefine the online shopping experience.
              </p>
              <p>
                Join us on this journey as we keep growing, innovating, and making online shopping more enjoyable for everyone.
              </p>
            </div>
            <div className="col-12 col-xl-6">
              <img
                src="/public/assets/banners/banner1.jpg"
                className="img-fluid"
                alt=""
              />
            </div>
          </div>

          <Features />

          
          <BrandsSlider />
        </div>
      </section>
    </>
  );
}

export default About;
