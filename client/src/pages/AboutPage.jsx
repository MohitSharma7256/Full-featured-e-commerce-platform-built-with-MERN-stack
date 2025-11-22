import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import About from "../components/About";

function AboutPage() {
  return (
    <>
      <div className="page-content">
        <BreadCrumb title="About US" />
        <About />
      </div>
    </>
  );
}

export default AboutPage;
