import BreadCrumb from "../components/BreadCrumb";

import React, { useEffect, useState } from 'react'
import BuyerSidebar from "../components/BuyerSidebar";
import { useNavigate } from "react-router-dom";
import FormValidator from "../Validators/FormValidator";

export default function UpdateProfile() {
    let [user, setUser] = useState({})
    let [show, setShow] = useState(false)
    let [errorMessage, setErrorMessage] = useState({
        name: "",
        email: "",
        phone: "",
    })
    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value } = e.target
        setErrorMessage(old => {
            return {
                ...old,
                [name]: FormValidator(e)
            }
        })
        setUser(old => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    async function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find(x => x !== "")
        if (error)
            setShow(true)
        
            else {
                let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "authorization": localStorage.getItem("token"),
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ ...user })
                })
                response = await response.json()
                navigate("/profile")
            }
    }

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
            if (response.result==="Done")
                setUser({ ...response.data })
            else
                alert("Something Went Wrong")
        })()
    }, [])
    return (
        <>
            <div className="page-content">
                <BreadCrumb title="Update Profile" />
                <section className="section-padding">
                    <div className="container">
                        <div className="d-flex align-items-center px-3 py-2 border mb-4">
                            <div className="text-start">
                                <h4 className="mb-0 h4 fw-bold">Account - Edit Profile</h4>
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
                            <div className="col-12 col-xl-7">
                                <div className="card rounded-0">
                                    <div className="card-body p-lg-5">
                                        <h5 className="mb-0 fw-bold">Edit Details</h5>
                                        <hr />
                                        <form onSubmit={postData}>
                                            <div className="row row-cols-1 g-3">
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <input type="text" onChange={getInputData} name='name' value={user.name} className={`form-control rounded-0 ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} placeholder='Full Name' />
                                                        {show && errorMessage.name ? <p className='text-danger'>{errorMessage.name}</p> : null}
                                                        <label>Name</label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <input type="email" onChange={getInputData} name='email' value={user.email} className={`form-control rounded-0 ${show && errorMessage.email ? 'border-danger' : 'border-dark'}`} placeholder='Email Address' />
                                                        {show && errorMessage.email ? <p className='text-danger'>{errorMessage.email}</p> : null}
                                                        <label>Email</label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <input type="text" onChange={getInputData} name='phone' value={user.phone} className={`form-control rounded-0 ${show && errorMessage.phone ? 'border-danger' : 'border-dark'}`} placeholder='Phone Number' />
                                                        {show && errorMessage.phone ? <p className='text-danger'>{errorMessage.phone}</p> : null}
                                                        <label>Phone Number</label>
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <button type="submit" className="btn btn-dark py-3 btn-ecomm w-100">Save Details</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="modal" id="ChangePasswordModal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content rounded-0">
                            <div className="modal-body">
                                <h5 className="fw-bold mb-3">Change Password</h5>
                                <hr />
                                <form>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control rounded-0" id="floatingInputOldPass" placeholder="Old Password" />
                                        <label for="floatingInputOldPass">Old Password</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control rounded-0" id="floatingInputNewPass" placeholder="New Password" />
                                        <label for="floatingInputNewPass">New Password</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control rounded-0" id="floatingInputConPass" placeholder="Confirm Password" />
                                        <label for="floatingInputConPass">Confirm Password</label>
                                    </div>
                                    <div className="d-grid gap-3 w-100">
                                        <button type="button" className="btn btn-dark py-3 btn-ecomm">Change</button>
                                        <button type="button" className="btn btn-outline-dark py-3 btn-ecomm" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
