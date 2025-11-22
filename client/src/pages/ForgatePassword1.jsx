import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ForgetPassword1() {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    async function postdata(e) {
        e.preventDefault();
        setErrorMessage(""); // ← clear previous error

        try {
            const response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/forget-password1`, {
                method: "POST",
                headers: {
                    "authorization": import.meta.env.VITE_SITE_PUBLIC_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (response.ok && data.result === "Done") {
                localStorage.setItem("reset-password-username", username);
                navigate("/forget-password2");
            } else {
                setErrorMessage(data.message || "Something went wrong!");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            console.error("Forget Password Error:", error);
        }
    }

    return (
        <div className="page-content">
            <BreadCrumb title="Reset Password" />
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-8 col-xl-7 col-xxl-5 mx-auto">
                            <div className="card rounded-0">
                                <div className="card-body p-4">
                                    <h4 className="mb-4 fw-bold text-center">Reset Password</h4>

                                    <form onSubmit={postdata}>
                                        <div className="row g-4">
                                            <div className="col-12">
                                                <label htmlFor="username" className="form-label">Username</label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className={`form-control rounded-0 ${errorMessage ? 'border-danger' : ''}`}
                                                    id="username"
                                                    placeholder="Enter Your Username or Email"
                                                    required
                                                />
                                                {errorMessage && <p className="text-danger mt-1">{errorMessage}</p>}
                                            </div>

                                            <div className="col-12">
                                                <button type="submit" className="btn btn-dark rounded-0 btn-ecomm w-100">
                                                    Submit
                                                </button>
                                            </div>

                                            <div className="col-12 text-center">
                                                <Link to="/login" className="btn btn-outline-dark rounded-0 w-100">
                                                    <i className="bi bi-arrow-left me-2"></i> Return to Login
                                                </Link>
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
    );
}