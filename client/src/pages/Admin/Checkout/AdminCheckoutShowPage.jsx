import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../../../components/Sidebar'

import { getCheckout, updateCheckout } from "../../../Redux/ActionCreators/CheckoutActionCreators"
import { useParams } from 'react-router-dom';
export default function AdminCheckoutShowPage() {
    let { _id } = useParams()
    let [data, setData] = useState({})
    let [flag, setFlag] = useState(false)

    let [orderStatus, setOrderStatus] = useState("")
    let [paymentStatus, setPaymentStatus] = useState("")

    let CheckoutStateData = useSelector(state => state.CheckoutStateData)
    let dispatch = useDispatch()

    function updateRecord() {
        if (!data || !data._id) {
            alert("Order data not loaded. Please refresh the page.")
            return
        }

        if (confirm("Are You Sure to Update Status of That Item: ")) {
            const updatedData = {
                ...data,
                orderStatus: orderStatus,
                paymentStatus: paymentStatus
            }

            dispatch(updateCheckout({
                formData: updatedData,
                _id: data._id
            }))
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getCheckout())
        if (CheckoutStateData.length) {
            let item = CheckoutStateData.find(x => x._id === _id)
            setData(item)
            setOrderStatus(item.orderStatus)
            setPaymentStatus(item.paymentStatus)
        }
    }
    useEffect(() => {
        getAPIData()
    }, [CheckoutStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Checkout Query</h5>
                            <div className="table-responsive">
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <th>Id</th>
                                            <td>{data.id}</td>
                                        </tr>
                                        <tr>
                                            <th>User</th>
                                            <td>
                                                <strong>Name:</strong> {data.deliveryAddress?.name || data.user?.name || 'N/A'}<br />
                                                <strong>Email:</strong> {data.deliveryAddress?.email || data.user?.email || 'N/A'}<br />
                                                <strong>Phone:</strong> {data.deliveryAddress?.phone || data.user?.phone || 'N/A'}<br />
                                                <strong>Address:</strong> {data.deliveryAddress?.address || 'N/A'}<br />
                                                <strong>City:</strong> {data.deliveryAddress?.city || 'N/A'}, <strong>State:</strong> {data.deliveryAddress?.state || 'N/A'}, <strong>PIN:</strong> {data.deliveryAddress?.pin || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Order Status</th>
                                            <td>{data.orderStatus}
                                                {
                                                    data.orderStatus !== "Delivered" ?
                                                        <select onChange={(e) => setOrderStatus(e.target.value)} className='form-select border-dark mt-3'>
                                                            <option>Order is Placed</option>
                                                            <option>Order is Packed</option>
                                                            <option>Order is Ready to Ship</option>
                                                            <option>Order is Shipped</option>
                                                            <option>Order is in Transit</option>
                                                            <option>Order is Reached to the Final Delivery Station</option>
                                                            <option>Order is Out for Delivery</option>
                                                            <option>Delivered</option>
                                                        </select> : null
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Payment Mode</th>
                                            <td>{data.paymentMode}</td>
                                        </tr>
                                        <tr>
                                            <th>Payment Status</th>
                                            <td>{data.paymentStatus}
                                                {
                                                    data.paymentStatus !== "Paid" && data.paymentStatus !== "Done" ?
                                                        <select onChange={(e) => setPaymentStatus(e.target.value)} className='form-select border-dark mt-3' value={paymentStatus}>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Paid">Paid</option>
                                                        </select> : null
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Subtotal</th>
                                            <td>&#8377;{data.subtotal}</td>
                                        </tr>
                                        <tr>
                                            <th>Shipping</th>
                                            <td>&#8377;{data.shipping}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>&#8377;{data.total}</td>
                                        </tr>
                                        <tr>
                                            <th>RPPID</th>
                                            <td>{data.razorpayPaymentId || data.rppid || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Date</th>
                                            <td>{data.createdAt ? new Date(data.createdAt).toLocaleString() : (data.date ? new Date(data.date).toLocaleString() : 'N/A')}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                {
                                                    data.orderStatus !== "Delivered" && (data.paymentStatus === "Pending" || data.paymentStatus === "pending") ?
                                                        <button onClick={updateRecord} className='btn btn-dark w-100'>Update</button> : null
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h5 className='text-center'>Checkout Products</h5>
                            <div className="card-body">
                                {
                                    data?.products?.map((p, index) => {
                                        // Safely access product data
                                        const product = p.product || {}
                                        const productName = product.name || "Product"
                                        const productBrand = product.brand?.name || product.brand || "Brand"
                                        const productImage = product.pic?.[0] || product.pic || ""

                                        return <div className="d-flex flex-xl-row gap-3 mb-3" key={index}>
                                            <div className="product-img">
                                                <img
                                                    src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${productImage}`}
                                                    width="120"
                                                    height={100}
                                                    alt={productName}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg'
                                                    }}
                                                />
                                            </div>
                                            <div className="product-info flex-grow-1">
                                                <h5 className="fw-bold mb-1">{productName}</h5>
                                                <p className="mb-0">{productBrand} - {p.color}</p>
                                                <div className="mt-3 hstack gap-2">
                                                    <button type="button" className="btn btn-sm border rounded-0">Size : {p.size}</button>
                                                    <button type="button" className="btn btn-sm border rounded-0">Qty : {p.quantity}</button>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
