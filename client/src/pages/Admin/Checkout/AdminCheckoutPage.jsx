import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import $ from 'jquery';  // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables styles
import 'datatables.net';

import Sidebar from '../../../components/Sidebar'

import { getCheckout } from "../../../Redux/ActionCreators/CheckoutActionCreators"
import { Link } from 'react-router-dom';
export default function AdminCheckoutPage() {
    let [data, setData] = useState([])
    let CheckoutStateData = useSelector(state => state.CheckoutStateData)
    let dispatch = useDispatch()

    function getAPIData() {
        dispatch(getCheckout())
        if (CheckoutStateData.length)
            setData(CheckoutStateData)
        else
            setData([])
        let time = setTimeout(() => {
            $('#DataTable').DataTable()
        }, 500)
        return time
    }
    useEffect(() => {
        let time = getAPIData()
        return () => clearTimeout(time)
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
                            <h5 className='bg-dark text-light p-2 text-center'>Checkout</h5>
                            <div className="table-responsive">
                                <table id='DataTable' className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>User Id</th>
                                            <th>Order Status</th>
                                            <th>Payment Mode</th>
                                            <th>Payment Status</th>
                                            <th>Subtotal</th>
                                            <th>Shipping</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map(item => {
                                                return <tr key={item._id}>
                                                    <td>{item._id}</td>
                                                    <td>{item.user.name},</td>
                                                    <td>{item.orderStatus}</td>
                                                    <td>{item.paymentMode}</td>
                                                    <td>{item.paymentStatus}</td>
                                                    <td>&#8377;{item.subtotal}</td>
                                                    <td>&#8377;{item.shipping}</td>
                                                    <td>&#8377;{item.total}</td>
                                                    <td>{new Date(item.date).toLocaleString()}</td>
                                                    <td><Link to={`/admin/Checkout/show/${item._id}`} className='btn btn-dark'><i className='bi bi-eye'></i></Link></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
