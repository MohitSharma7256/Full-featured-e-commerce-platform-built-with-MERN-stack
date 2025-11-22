import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import BreadCrumb from '../components/BreadCrumb'

import { getSetting } from "../Redux/ActionCreators/SettingActionCreators"
import { createContactUs } from "../Redux/ActionCreators/ContactUsActionCreators"
export default function ContactUs() {
    let [inputData, setInputData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    let [message, setMessage] = useState("")

    let [data, setData] = useState({})
    let SettingStateData = useSelector(state => state.SettingStateData)
    let dispatch = useDispatch()

    function getInputData(e) {
        let { name, value } = e.target
        setInputData(old => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    function postData(e) {
        e.preventDefault()
        dispatch(createContactUs({ ...inputData, active: true, date: new Date() }))
        setMessage("Thanks to Share Your Query With Us. Our Team Will Contact You Soon")
        setInputData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        })
    }

    useEffect(() => {
        (() => {
            dispatch(getSetting())
            if (SettingStateData.length) {
                setData({
                    map1: SettingStateData[0].map1 ? SettingStateData[0].map1 : "",
                    map2: SettingStateData[0].map2 ? SettingStateData[0].map2 : "",
                    address: SettingStateData[0].address ? SettingStateData[0].address : "",
                    email: SettingStateData[0].email ? SettingStateData[0].email : "",
                    phone: SettingStateData[0].phone ? SettingStateData[0].phone : "",
                    whatsapp: SettingStateData[0].whatsapp ? SettingStateData[0].whatsapp : ""
                })
            }
            else {
                setData({
                    map1: import.meta.env.VITE_SITE_MAP1,
                    map2: import.meta.env.VITE_SITE_MAP2,
                    address: import.meta.env.VITE_SITE_ADDRESS,
                    email: import.meta.env.VITE_SITE_EMAIL,
                    phone: import.meta.env.VITE_SITE_PHONE,
                    whatsapp: import.meta.env.VITE_SITE_WHATSAPP,
                })
            }
        })()

    }, [SettingStateData.length])
    return (
        <>
            <div className="page-content">


                <BreadCrumb title="Contact Us" />

                <section className="section-padding">
                    <div className="container">

                        <div className="separator mb-3">
                            <div className="line"></div>
                            <h3 className="mb-0 h3 fw-bold">Find Us Map</h3>
                            <div className="line"></div>
                        </div>

                        <div className="border p-3">
                            <iframe className="w-100" height={300} src={data.map2}></iframe>
                        </div>

                        <div className="separator my-3">
                            <div className="line"></div>
                            <h3 className="mb-0 h3 fw-bold">Why Choose Us</h3>
                            <div className="line"></div>
                        </div>

                        <div className="row g-4">
                            <div className="col-xl-8">
                                <div className="p-4 border">
                                    <form onSubmit={postData}>
                                        <div className="form-body">
                                            <h4 className="mb-0 fw-bold text-center">Drop Us a Line</h4>
                                            {message ? <p className='text-center text-success'>{message}</p> : null}
                                            <div className="my-3 border-bottom"></div>
                                            <div className="row">
                                                <div className="mb-3">
                                                    <label className="form-label">Enter Your Name</label>
                                                    <input type="text" required name='name' onChange={getInputData} value={inputData.name} className="form-control rounded-0" />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Enter Email</label>
                                                    <input type="email" required name='email' onChange={getInputData} value={inputData.email} className="form-control rounded-0" />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Phone Number</label>
                                                    <input type="text" required name='phone' onChange={getInputData} value={inputData.phone} className="form-control rounded-0" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Subject</label>
                                                    <input type="text" required name='subject' onChange={getInputData} value={inputData.subject} className="form-control rounded-0" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Message</label>
                                                    <textarea className="form-control rounded-0" required name='message' onChange={getInputData} value={inputData.message} rows="4" cols="4"></textarea>
                                                </div>
                                                <div className="mb-0">
                                                    <button className="btn btn-dark btn-ecomm w-100" type='submit'>Send Message</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="p-3 border">
                                    <div className="address mb-3">
                                        <h5 className="mb-0 fw-bold">Address</h5>
                                        <Link to={data.map1} target='_blank' rel='noreferrer'>{data.address}</Link>
                                    </div>
                                    <hr />
                                    <div className="phone mb-3">
                                        <h5 className="mb-0 fw-bold">Phone</h5>
                                        <Link to={`tel:${data.phone}`} target='_blank' rel='noreferrer'>{data.phone}</Link>
                                    </div>
                                    <div className="phone mb-3">
                                        <h5 className="mb-0 fw-bold">WhatsApp</h5>
                                        <Link to={`tel:${data.whatsapp}`} target='_blank' rel='noreferrer'>{data.whatsapp}</Link>
                                    </div>
                                    <hr />
                                    <div className="phone mb-3">
                                        <h5 className="mb-0 fw-bold">Email</h5>
                                        <Link to={`mailto:${data.email}`} target='_blank' rel='noreferrer'>{data.email}</Link>
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
