import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import Features from '../components/Features'

function FeaturePage() {
  return (
    <>
        <div className="page-component">
        <br/><br/>
            <BreadCrumb title="Features"/>
            <Features />
        </div>
    </>
  )
}

export default FeaturePage