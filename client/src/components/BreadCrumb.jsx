import React from "react";

function BreadCrumb({ title }) {
  return (
    //  <!--start breadcrumb-->
    <div className="py-4 border-bottom">
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="javascript:;">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="javascript:;">{title}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shop With Grid
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}

export default BreadCrumb;
