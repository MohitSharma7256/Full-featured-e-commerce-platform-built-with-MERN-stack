import React from "react";
import { useEffect } from "react";
import { getFeature } from "../Redux/ActionCreators/FeatureActionCreators";
import { useDispatch, useSelector } from "react-redux";

function Features() {
  let FeatureStateDataRaw = useSelector(state => state.FeatureStateData)
  const FeatureStateData = Array.isArray(FeatureStateDataRaw) ? FeatureStateDataRaw : []
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(getFeature())
  }, [FeatureStateData.length])
  return (
    <>
      <div className="page-content">
        {/* start features */}
        <section className="product-thumb-slider section-padding">
          <div className="container">
            <div className="text-center pb-3">
              <h3 className="mb-0 h3 fw-bold">What We Offer!</h3>
              <p className="mb-0 text-capitalize">Checkout Our Features</p>
            </div>
            <div className="row row-cols-1 row-cols-lg-4 justify-content-center g-4">
              {
                FeatureStateData.map(item => {
                  return <div className="col d-flex" key={item._id}>
                    <div className="card depth border-0 rounded-0 border-bottom border-primary border-3 w-100">
                      <div className="card-body text-center">
                        <div className="h1 fw-bold my-2 text-primary">
                          <span dangerouslySetInnerHTML={{__html:item.icon}} />
                        </div>
                        <h5 className="fw-bold">{item.name}</h5>
                        <p className="mb-0">
                         {item.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                })
              }

            </div>
            {/* end row */}
          </div>
        </section>
        {/* end features */}
      </div>
    </>
  );
}

export default Features;
