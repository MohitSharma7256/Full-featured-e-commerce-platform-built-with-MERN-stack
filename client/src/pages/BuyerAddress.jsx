import React, { useEffect, useState } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import BuyerSidebar from '../components/BuyerSidebar'

export default function BuyerAddress() {
    let [showModal, setShowModal] = useState(false)
    let [option, setOption] = useState("Create")
    let [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        pin: "",
        city: "",
        state: ""
    })
    let [address, setAddress] = useState([])

    function getInputData(e) {
        let { name, value } = e.target
        setData((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    async function postData(e) {
        e.preventDefault()
        try {
            let url = option === "Create" 
                ? `${import.meta.env.VITE_SITE_BACKEND_SERVER}/address` 
                : `${import.meta.env.VITE_SITE_BACKEND_SERVER}/address/${data._id}`
            
            let response = await fetch(url, {
                method: option === "Create" ? "POST" : "PUT",
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ ...data, user: localStorage.getItem("userid") })
            })
            
            response = await response.json()
            
            if (response.result === "Done" || response.success) {
                alert(option === "Create" ? "Address added successfully!" : "Address updated successfully!")
                setData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    pin: "",
                    city: "",
                    state: ""
                })
                setShowModal(false)
                getAPIData()
            } else {
                alert(response.message || "Failed to save address")
            }
        } catch (error) {
            console.error("Error saving address:", error)
            alert("An error occurred while saving the address")
        }
    }

    async function getAPIData() {
        try {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/address/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                    "content-type": "application/json"
                }
            })
            response = await response.json()
            console.log("response", response)
            
            if (response.result === "Done" || response.success) {
                setAddress(response.data || [])
            } else {
                console.error("Failed to fetch addresses:", response.message)
                setAddress([])
            }
        } catch (error) {
            console.error("Error fetching addresses:", error)
            setAddress([])
        }
    }

    async function deleteRecord(id) {
        if(window.confirm("Are You Sure to Delete that Address")){
            try {
                let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/address/${id}`, {
                    method: "DELETE",
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`,
                        "content-type": "application/json"
                    }
                })
                response = await response.json()
                
                if (response.result === "Done" || response.success) {
                    alert("Address deleted successfully!")
                    getAPIData()
                } else {
                    alert(response.message || "Failed to delete address")
                }
            } catch (error) {
                console.error("Error deleting address:", error)
                alert("An error occurred while deleting the address")
            }
        }
    }

    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <>
            <div className="page-content">


                <BreadCrumb title="Saved Address" />


                <section className="section-padding">
                    <div className="container">
                        <div className="d-flex align-items-center px-3 py-2 border mb-4">
                            <div className="text-start">
                                <h4 className="mb-0 h4 fw-bold">Account - Addresses</h4>
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
                                    <div className="card-header bg-light">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="fw-bold mb-0">Saved Address</h5>
                                            </div>
                                            <div className="">
                                                <button type="button" className="btn btn-ecomm" onClick={() => {
                                                    setShowModal(true)
                                                    setOption("Create")
                                                }}><i className="bi bi-plus-lg me-2"></i>Add New Address</button>
                                            </div>
                                            <div className={`modal fade ${showModal ? "show" : ""}`} id="exampleModal" tabIndex="-1" style={{ display: showModal ? "block" : "none" }}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Address</h1>
                                                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                                        </div>
                                                        <form onSubmit={postData}>
                                                            <div className="modal-body">
                                                                <div className="row">
                                                                    <div className="col-12 mb-3">
                                                                        <label>Name</label>
                                                                        <input type="text" name="name" onChange={getInputData} value={data.name} placeholder='Full Name' className='form-control border-dark' />
                                                                    </div>
                                                                    <div className="col-md-6 mb-3">
                                                                        <label>Email Address</label>
                                                                        <input type="email" name="email" onChange={getInputData} value={data.email} placeholder='Email Address' className='form-control border-dark' />
                                                                    </div>
                                                                    <div className="col-md-6 mb-3">
                                                                        <label>Phone Number</label>
                                                                        <input type="text" name="phone" onChange={getInputData} value={data.phone} placeholder='Phone Number' className='form-control border-dark' />
                                                                    </div>
                                                                    <div className="col-12 mb-3">
                                                                        <label>Address</label>
                                                                        <textarea name="address" onChange={getInputData} value={data.address} placeholder='Address...' className='form-control border-dark' required></textarea>
                                                                    </div>
                                                                    <div className="col-md-4 mb-3">
                                                                        <label>Pin Code</label>
                                                                        <input type="text" name="pin" onChange={getInputData} value={data.pin} placeholder='Pin Code' className='form-control border-dark' />
                                                                    </div>
                                                                    <div className="col-md-4 mb-3">
                                                                        <label>City Name</label>
                                                                        <input type="text" name="city" onChange={getInputData} value={data.city} placeholder='City Name' className='form-control border-dark' />
                                                                    </div>
                                                                    <div className="col-md-4 mb-3">
                                                                        <label>State Name</label>
                                                                        <input type="text" name="state" onChange={getInputData} value={data.state} placeholder='State Name' className='form-control border-dark' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="submit" className="btn btn-dark">{option}</button>
                                                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {
                                            address && address.length > 0 ? (
                                                address.map(item => {
                                                    return <div className="card rounded-0 mb-3" key={item._id}>
                                                        <div className="card-body">
                                                            <div className="d-flex flex-column flex-xl-row gap-3">
                                                                <div className="address-info form-check flex-grow-1">                                                                
                                                                    <label className="form-check-label" htmlFor="flexRadioDefaultAddress1">
                                                                        <span className="fw-bold mb-0 h5">{item.name}</span><br />
                                                                        {item.address} <br />
                                                                        {item.city}, {item.state}, {item.pin}<br />
                                                                        Mobile: <span className="text-dark fw-bold">{item.phone}</span><br />
                                                                        Email: <span className="text-dark fw-bold">{item.email}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="d-none d-xl-block vr"></div>
                                                                <div className="d-grid gap-2 align-self-start align-self-xl-center">
                                                                    <button type="button" className="btn btn-outline-dark px-5 btn-ecomm" onClick={()=>deleteRecord(item._id)}>Remove</button>
                                                                    <button type="button" className="btn btn-outline-dark px-5 btn-ecomm" onClick={() => {
                                                                        setShowModal(true)
                                                                        setOption("Update")
                                                                        setData({ ...item })
                                                                    }}>Edit</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })
                                            ) : (
                                                <div className="text-center py-5">
                                                    <p className="text-muted">No saved addresses found. Add a new address to get started.</p>
                                                </div>
                                            )
                                        }
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
