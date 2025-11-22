import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import $ from 'jquery';  // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables styles
import 'datatables.net';

import Sidebar from '../../../components/Sidebar'

import { getContactUs, deleteContactUs, updateContactUs } from "../../../Redux/ActionCreators/ContactUsActionCreators"
import { Link } from 'react-router-dom';
export default function AdminContactUsPage() {
    let [data, setData] = useState([])
    let [flag, setFlag] = useState(false)
    let ContactUsStateData = useSelector(state => state.ContactUsStateData)
    let dispatch = useDispatch()

    function deleteRecord(_id) {
        if (confirm("Are You Sure to Delete That Item  : ")) {
            dispatch(deleteContactUs({ _id: _id }))
            getAPIData()
        }
    }

    function updateRecord(_id) {
        if (confirm("Are You Sure to Update Status of That Item  : ")) {
            let item = data.find(x => x._id === _id)
            let index = data.findIndex(x => x._id === _id)
            item.active = !item.active
            data[index].active = item.active
            dispatch(updateContactUs({ ...item }))
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getContactUs())
        if (ContactUsStateData.length)
            setData(ContactUsStateData)
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
    }, [ContactUsStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>ContactUs</h5>
                            <div className="table-responsive">
                                <table id='DataTable' className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Active</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map(item => {
                                                return <tr key={item._id}>
                                                    <td>{item._id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.subject}</td>
                                                    <td>{new Date(item.date).toLocaleString()}</td>
                                                    <td style={{ cursor: "pointer" }} onClick={() => updateRecord(item._id)}>{item.active ? "Yes" : "No"}</td>
                                                    <td><Link to={`/admin/contactus/show/${item._id}`} className='btn btn-dark'><i className='bi bi-eye'></i></Link></td>
                                                    <td>{item.active ? null : <button onClick={() => deleteRecord(item._id)} className='btn btn-danger'><i className='bi bi-trash'></i></button>}</td>
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
