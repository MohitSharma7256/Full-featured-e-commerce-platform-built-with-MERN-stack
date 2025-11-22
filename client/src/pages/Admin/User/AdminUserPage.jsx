import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import $ from 'jquery';  // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables styles
import 'datatables.net';

import Sidebar from '../../../components/Sidebar'

import { getUser, deleteUser, updateUser } from "../../../Redux/ActionCreators/UserActionCreators"
export default function AdminUserPage() {
    let [data, setData] = useState([])
    let [flag, setFlag] = useState(false)

    let UserStateData = useSelector(state => state.UserStateData)
    let dispatch = useDispatch()

    function updateRecord(_id) {
        if (confirm("Are You Sure to Update Status of That Item  : ")) {
            let item = data.find(x => x._id === _id)
            let index = data.findIndex(x => x._id === _id)
            item.active = !item.active
            data[index].active = item.active
            dispatch(updateUser({ ...item }))
            setFlag(!flag)
        }
    }

    function deleteRecord(_id) {
        if (confirm("Are You Sure to Delete That Item  : ")) {
            dispatch(deleteUser({ _id: _id }))
            getAPIData()
        }
    }
    function getAPIData() {
        dispatch(getUser())
        if (UserStateData.length) {
            setData(UserStateData)
        }
        let time = setTimeout(() => {
            $('#DataTable').DataTable()
        }, 500)
        return time
    }
    useEffect(() => {
        let time = getAPIData()
        return () => clearTimeout(time)
    }, [UserStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>User <Link to="/admin/user/create"><i className='bi bi-plus fs-3 float-end text-light'></i></Link></h5>
                            <div className="table-responsive">
                                <table id='DataTable' className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>UserName</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
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
                                                    <td>{item.username}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.role}</td>
                                                    <td style={{ cursor: "pointer" }} onClick={() => updateRecord(item._id)}>{item.active ? "Yes" : "No"}</td>
                                                    <td>{item.role === "Buyer" ? null : <Link to={`/admin/user/edit/${item._id}`} className='btn btn-primary'><i className='bi bi-pencil-square'></i></Link>}</td>
                                                    <td>{item.role === "Buyer" ? null : <button onClick={() => deleteRecord(item._id)} className='btn btn-danger'><i className='bi bi-trash'></i></button>}</td>
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
