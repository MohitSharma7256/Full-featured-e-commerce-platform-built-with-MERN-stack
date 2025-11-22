import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../../../components/Sidebar'

import { getContactUs, deleteContactUs, updateContactUs } from "../../../Redux/ActionCreators/ContactUsActionCreators"
import { useNavigate, useParams } from 'react-router-dom';
export default function AdminContactUsShowPage() {
    let { _id } = useParams()
    let [data, setData] = useState({})
    let [flag, setFlag] = useState(false)

    let ContactUsStateData = useSelector(state => state.ContactUsStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function deleteRecord() {
        if (confirm("Are You Sure to Delete That Item  : ")) {
            dispatch(deleteContactUs({ _id: _id }))
            navigate("/admin/contactus")
        }
    }

    function updateRecord() {
        if (confirm("Are You Sure to Update Status of That Item  : ")) {
            data.active = !data.active
            dispatch(updateContactUs({ ...data }))
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getContactUs())
        if (ContactUsStateData.length){
            setData(ContactUsStateData.find(x=>x._id===_id))
        }
    }
    useEffect(() => {
        getAPIData()
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
                            <h5 className='bg-dark text-light p-2 text-center'>ContactUs Query</h5>
                            <div className="table-responsive">
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <th>Id</th>
                                            <td>{data.id}</td>
                                        </tr>
                                         <tr>
                                            <th>Name</th>
                                            <td>{data.name}</td>
                                        </tr>
                                         <tr>
                                            <th>Email Address</th>
                                            <td>{data.email}</td>
                                        </tr>
                                         <tr>
                                            <th>Phone Number</th>
                                            <td>{data.phone}</td>
                                        </tr>
                                         <tr>
                                            <th>Subject</th>
                                            <td>{data.subject}</td>
                                        </tr>
                                        <tr>
                                            <th>Message</th>
                                            <td>{data.message}</td>
                                        </tr>
                                         <tr>
                                            <th>Date</th>
                                            <td>{new Date(data.date).toLocaleString()}</td>
                                        </tr>
                                         <tr>
                                            <th>Active</th>
                                            <td>{data.active?"Yes":"No"}</td>
                                        </tr>
                                         <tr>
                                            <td colSpan={2}>
                                                {
                                                    data.active?
                                                    <button onClick={updateRecord} className='btn btn-dark w-100'>Update</button>:
                                                    <button onClick={deleteRecord} className='btn btn-danger w-100'>Delete</button>
                                                }
                                            </td>
                                        </tr>
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
