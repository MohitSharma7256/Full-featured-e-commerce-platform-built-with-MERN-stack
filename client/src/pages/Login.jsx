import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import BreadCrumb from '../components/BreadCrumb'
export default function LoginPage() {
    let [data, setData] = useState({
        username: "",
        password: ""
    })
    let [errorMessage, setErrorMessage] = useState("")
    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value } = e.target
        setErrorMessage("")
        setData(old => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    async function postData(e) {
        e.preventDefault()
        try {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.result === "Done") {
                if (result.data.active === false) {
                    setErrorMessage("Your account is blocked. Please contact support.");
                    return;
                }

                // Store user data
                localStorage.setItem("login", "true");
                localStorage.setItem("userid", result.data._id);
                localStorage.setItem("name", result.data.name);
                localStorage.setItem("role", result.data.role);
                localStorage.setItem("token", result.token);

                // Redirect based on role
                navigate(result.data.role === "Buyer" ? "/" : "/admin");
            } else {
                setErrorMessage(result.reason || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred during login. Please try again.");
        }
    }
    return (
        <>
            <div className="page-content">
                <BreadCrumb title="Login To Your Account" />
                <section className="section-padding">
                    <div className="container">

                        <div className="row">
                            <div className="col-12 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
                                <div className="card rounded-0">
                                    <div className="card-body p-4">
                                        <h4 className="mb-0 fw-bold text-center">User Login</h4>
                                        <hr />
                                        <p className="mb-2">Join / Sign In using</p>
                                        <div className="social-login mb-4">
                                            <div className="row g-4">
                                                <div className="col-xl-6">
                                                    <button type="button" className="btn bg-facebook btn-ecomm w-100 text-white"><i className="bi bi-facebook me-2"></i>Facebook</button>
                                                </div>
                                                <div className="col-xl-6">
                                                    <button type="button" className="btn bg-pinterest btn-ecomm w-100 text-white"><i className="bi bi-google me-2"></i>Google</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="separator mb-4">
                                            <div className="line"></div>
                                            <p className="mb-0 fw-bold">Or</p>
                                            <div className="line"></div>
                                        </div>
                                        <form onSubmit={postData}>
                                            <div className="row g-4">
                                                <div className="col-12">
                                                    <label className="form-label">Username</label>
                                                    <input type="text" name='username' onChange={getInputData} className={`form-control rounded-0 ${errorMessage ? 'border-danger' : 'border-dark'}`} placeholder='Username or Email Address' />
                                                    {errorMessage ? <p className='text-danger'>{errorMessage}</p> : null}
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">Password</label>
                                                    <input type="password" name='password' onChange={getInputData} className={`form-control rounded-0 ${errorMessage ? 'border-danger' : 'border-dark'}`} placeholder='Password' />
                                                </div>
                                                <div className="col-12">
                                                    <Link to="/forget-password1" className="text-content btn bg-light rounded-0 w-100"><i className="bi bi-lock me-2"></i>Forgot Password</Link>
                                                </div>
                                                <div className="col-12">
                                                    <hr className="my-0" />
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-dark rounded-0 btn-ecomm w-100">Login</button>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <p className="mb-0 rounded-0 w-100">Don't have an account? <Link to="/signup" className="text-danger">Sign Up</Link></p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
