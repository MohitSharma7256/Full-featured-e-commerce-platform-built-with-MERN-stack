import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getNewsletter, createNewsletter } from "../Redux/ActionCreators/NewsletterActionCreators"
export default function Newsletter() {
    let [email, setEmail] = useState("")
    let [message, setMessage] = useState("")


    function postData(e) {
        e.preventDefault()
        if (email === "")
            setMessage("Please Enter a valid Email Address")
        else if (NewsletterStateData.find(x => x.email === email))
            setMessage("Your Email Address is Already Registered With Us")
        else {
            dispatch(createNewsletter({ email: email, active: true }))
            setMessage("Thank You. Your Email Address is Registered With Us")
        }
        setEmail("")
    }
    let NewsletterStateData = useSelector(state => state.NewsletterStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        (() => dispatch(getNewsletter()))()
    }, [NewsletterStateData.length])
    return (
        <>
            <section className="product-thumb-slider subscribe-banner p-5">
                <div className="row">
                    <div className="col-12 col-lg-6 mx-auto">
                        <div className="text-center">
                            <h3 className="mb-0 fw-bold text-white">Get Latest Update by <br /> Subscribe Our Newslater</h3>
                            {message ? <p className='text-light text-center'>{message}</p> : null}
                            <form onSubmit={postData}>
                                <div className="mt-3">
                                    <input type="email" name='email' onChange={(e) => setEmail(e.target.value)} value={email} className="form-control form-control-lg bubscribe-control rounded-0 px-5 py-3"
                                        placeholder="Enter your email" />
                                </div>
                                <div className="mt-3 d-grid">
                                    <button type="submit" className="btn btn-lg btn-ecomm bubscribe-button px-5 py-3">Subscribe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
