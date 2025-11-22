import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ForgetPassword2() {
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    async function postdata(e) {
        e.preventDefault();
        setErrorMessage(""); // ← पुराना error हटाओ

        try {
            const username = localStorage.getItem("reset-password-username");
            if (!username) {
                setErrorMessage("Session expired. Please try again.");
                navigate("/forget-password1");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/forget-password2`, {
                method: "POST",
                headers: {
                    "authorization": import.meta.env.VITE_SITE_PUBLIC_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, otp })
            });

            const data = await response.json();

            if (response.ok && data.result === "Done") {
                navigate("/forget-password3");
            } else {
                setErrorMessage(data.message || "Invalid OTP!");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            console.error("OTP Verification Error:", error);
        }
    }

    return (
        <div className="page-content">
            <BreadCrumb title="Reset Password - Verify OTP" />
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-8 col-xl-7 col-xxl-5 mx-auto">
                            <div className="card rounded-0">
                                <div className="card-body p-4">
                                    <h4 className="mb-4 fw-bold text-center">Verify OTP</h4>

                                    <form onSubmit={postdata}>
                                        <div className="row g-4">
                                            <div className="col-12">
                                                <label htmlFor="otp" className="form-label">Enter OTP</label>
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className={`form-control rounded-0 ${errorMessage ? 'border-danger' : ''}`}
                                                    id="otp"
                                                    placeholder="6-digit OTP"
                                                    maxLength="6"
                                                    required
                                                />
                                                {errorMessage && <p className="text-danger mt-1">{errorMessage}</p>}
                                            </div>

                                            <div className="col-12">
                                                <button type="submit" className="btn btn-dark rounded-0 btn-ecomm w-100">
                                                    Verify OTP
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