import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ForgetPassword3() {
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [matchError, setMatchError] = useState("");

    const navigate = useNavigate();

    async function postdata(e) {
        e.preventDefault();
        setErrorMessage("");
        setMatchError("");

        // Step 1: Password match check
        if (password !== cpassword) {
            setMatchError("Passwords do not match!");
            return;
        }

        // Step 2: API call
        try {
            const username = localStorage.getItem("reset-password-username");
            if (!username) {
                setErrorMessage("Session expired. Please start again.");
                navigate("/forget-password1");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/forget-password3`, {
                method: "POST",
                headers: {
                    "authorization": import.meta.env.VITE_SITE_PUBLIC_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.result === "Done") {
                localStorage.removeItem("reset-password-username");
                alert("Password reset successful! Please login.");
                navigate("/login");
            } else {
                setErrorMessage(data.message || "Failed to reset password.");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            console.error("Reset Password Error:", error);
        }
    }

    return (
        <div className="page-content">
            <BreadCrumb title="Reset Password - Set New Password" />
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-8 col-xl-7 col-xxl-5 mx-auto">
                            <div className="card rounded-0">
                                <div className="card-body p-4">
                                    <h4 className="mb-4 fw-bold text-center">Set New Password</h4>

                                    <form onSubmit={postdata}>
                                        <div className="row g-4">
                                            <div className="col-12">
                                                <label htmlFor="password" className="form-label">New Password</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className={`form-control rounded-0 ${errorMessage || matchError ? 'border-danger' : ''}`}
                                                    id="password"
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="cPassword" className="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    value={cpassword}
                                                    onChange={(e) => setCpassword(e.target.value)}
                                                    className={`form-control rounded-0 ${errorMessage || matchError ? 'border-danger' : ''}`}
                                                    id="cPassword"
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                                {matchError && <p className="text-danger mt-1">{matchError}</p>}
                                            </div>

                                            {errorMessage && (
                                                <div className="col-12">
                                                    <p className="text-danger text-center">{errorMessage}</p>
                                                </div>
                                            )}

                                            <div className="col-12">
                                                <button type="submit" className="btn btn-dark rounded-0 btn-ecomm w-100">
                                                    Reset Password
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