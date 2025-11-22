import React, { useEffect, useState } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import BuyerSidebar from '../components/BuyerSidebar'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
    let [user, setUser] = useState({})

    useEffect(() => {
        (async () => {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "authorization": localStorage.getItem("token"),
                    "content-type": "application/json"
                }
            })
            response = await response.json()
            if (response.result === "Done")
                setUser({ ...response.data })
            else
                alert("Something Went Wrong")
        })()
    }, [])
    return (
        <div className="page-content">


            <BreadCrumb title="Profile" />

            <section className="section-padding">
                <div className="container">
                    <div className="d-flex align-items-center px-3 py-2 border mb-4">
                        <div className="text-start">
                            <h4 className="mb-0 h4 fw-bold">Account - Profile</h4>
                        </div>
                    </div>
                    <div className="btn btn-dark btn-ecomm d-xl-none position-fixed top-50 start-0 translate-middle-y" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarFilter"><span><i className="bi bi-person me-2"></i>Account</span></div>
                    <div className="row">
                        <div className="col-12 col-xl-3 filter-column">
                            <nav className="navbar navbar-expand-xl flex-wrap p-0">
                                <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbarFilter" aria-labelledby="offcanvasNavbarFilterLabel">
                                    <div className="offcanvas-header">
                                        <h5 className="offcanvas-title mb-0 fw-bold text-uppercase" id="offcanvasNavbarFilterLabel">Account</h5>
                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <BuyerSidebar />
                                </div>
                            </nav>
                        </div>
                        <div className="col-12 col-xl-9">
                            <div className="card rounded-0">
                                <div className="card-body p-lg-5">
                                    <h5 className="mb-0 fw-bold">Profile Details</h5>
                                    <hr />
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <tbody>
                                                <tr>
                                                    <td>Full Name</td>
                                                    <td>{user.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Username</td>
                                                    <td>{user.username}</td>
                                                </tr>
                                                <tr>
                                                    <td>Mobile Number</td>
                                                    <td>{user.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td>Email ID</td>
                                                    <td>{user.email}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Add this after the phone number field */}
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                value={user.role || ''}
                                                className="form-control rounded-0 bg-light"
                                                disabled
                                                readOnly
                                            />
                                            <label>Account Type</label>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Link to="/update-profile" className="btn btn-outline-dark btn-ecomm px-5"><i className="bi bi-pencil me-2"></i>Edit</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
