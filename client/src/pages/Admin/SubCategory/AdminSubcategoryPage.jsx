import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import $ from 'jquery';  // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables styles
import 'datatables.net';

import Sidebar from '../../../components/Sidebar'

import { getSubcategory, deleteSubcategory } from "../../../Redux/ActionCreators/SubcategoryActionCreators"
export default function AdminSubcategoryPage() {
    let SubcategoryStateDataRaw = useSelector(state => state.SubcategoryStateData)
    const SubcategoryStateData = Array.isArray(SubcategoryStateDataRaw) ? SubcategoryStateDataRaw : []
    let dispatch = useDispatch()

    function deleteRecord(_id) {
        if (confirm("Are You Sure to Delete That Item  : ")) {
            dispatch(deleteSubcategory({ _id: _id }))
            getAPIData()
        }
    }
    function getAPIData() {
        dispatch(getSubcategory())
        let time = setTimeout(() => {
            $('#DataTable').DataTable()
        }, 500)
        return time
    }
    useEffect(() => {
        let time = getAPIData()
        return () => clearTimeout(time)
    }, [SubcategoryStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Subcategory <Link to="/admin/subcategory/create"><i className='bi bi-plus fs-3 float-end text-light'></i></Link></h5>
                            <div className="table-responsive">
                                <table id='DataTable' className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Pic</th>
                                            <th>Active</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            SubcategoryStateData.map(item => {
                                                const key = item._id || item._id || item.name
                                                return <tr key={key}>
                                                    <td>{item._id || item._id}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <Link to={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.pic}`} target='_blank' rel='noreferrer'>
                                                            <img src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${item.pic}`} height={50} width={80} alt="" />
                                                        </Link>
                                                    </td>
                                                    <td>{item.active ? "Yes" : "No"}</td>
                                                    <td><Link to={`/admin/subcategory/edit/${item._id || item._id}`} className='btn btn-primary'><i className='bi bi-pencil-square'></i></Link></td>
                                                    <td>{localStorage.getItem("role")==="Super Admin"?<button onClick={() => deleteRecord(item._id || item._id)} className='btn btn-danger'><i className='bi bi-trash'></i></button>:null}</td>
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
