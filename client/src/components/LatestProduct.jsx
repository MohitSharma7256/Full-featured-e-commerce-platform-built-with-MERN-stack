import React from 'react'
import { Link } from 'react-router-dom'

function LatestProduct({ data }) {
  return (
    <>
      {/* start special product */}
      <section className="section-padding bg-section-2">
        <div className="container">
          <div className="card border-0 rounded-0 p-3 depth">
            <div className="row align-items-center justify-content-center" style={{ minHeight: "350px" }}>
              <div className="col-lg-6 text-center d-flex justify-content-center align-items-center" style={{ height: "350px" }}>
                {
                  data?.pic?.[0]
                    ? <img
                      src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${data.pic[0]}`}
                      className="rounded-0 img-fluid h-100 object-contain"
                      alt={data?.name || "product"}
                    />
                    : null
                }
              </div>
              <div className="col-lg-6 d-flex align-items-center" style={{ height: "350px" }}>
                <div className="card-body overflow-auto">
                  <h3 className="fw-bold text-center">{data?.name}</h3>
                  <div className="d-flex justify-content-between flex-wrap">
                    <h4 className="text-center">
                      {data?.maincategory.name}/{data?.subcategory.name}/{data?.brand.name}
                    </h4>
                    <h4 className="text-center text-success">
                      {data?.basePrice && (
                        <del className="text-danger">&#8377;{data?.basePrice}</del>
                      )}
                      &nbsp;
                      &#8377;{data?.finalPrice} &nbsp;
                      {data?.discount ? (
                        <sup className="text-danger">{data?.discount}% Off</sup>
                      ) : null}
                    </h4>
                  </div>
                  {data?.description && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.description.slice(0, 1050) + (data.description.length > 1050 ? " ..." : "")
                      }}
                    />
                  )}

                  <div className="buttons mt-4 d-flex flex-column flex-lg-row gap-3">
                    <a href="#" className="btn btn-lg btn-dark btn-ecomm px-5 py-3">Buy Now</a>
                    <Link
                      to={`/product/${data?._id}`}
                      className="btn btn-lg btn-outline-dark btn-ecomm px-5 py-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LatestProduct
