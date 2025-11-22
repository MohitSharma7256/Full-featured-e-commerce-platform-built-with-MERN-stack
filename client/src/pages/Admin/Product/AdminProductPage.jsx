import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import $ from 'jquery';  // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables styles
import 'datatables.net';

import Sidebar from '../../../components/Sidebar'

import { getProduct, deleteProduct } from "../../../Redux/ActionCreators/ProductActionCreators"

export default function AdminProductPage() {
    let ProductStateDataRaw = useSelector(state => state.ProductStateData)
    const ProductStateData = Array.isArray(ProductStateDataRaw) ? ProductStateDataRaw : []
    let dispatch = useDispatch()

    function deleteRecord(_id) {
        if (confirm("Are You Sure to Delete That Item  : ")) {
            dispatch(deleteProduct({ _id: _id }))
            getAPIData()
        }
    }
    
    function getAPIData() {
        dispatch(getProduct())
        let time = setTimeout(() => {
            // Destroy existing DataTable instance if it exists
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy()
            }
            $('#DataTable').DataTable()
        }, 500)
        return time
    }
    
    useEffect(() => {
        let time = getAPIData()
        return () => {
            clearTimeout(time)
            // Clean up DataTable on unmount
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy()
            }
        }
    }, [ProductStateData.length])
    
    // Helper function to safely get name from object or string
    const getDisplayName = (value) => {
        if (!value) return 'N/A'
        if (typeof value === 'string') return value
        if (typeof value === 'object' && value.name) return value.name
        return 'N/A'
    }
    
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Product <Link to="/admin/product/create"><i className='bi bi-plus fs-3 float-end text-light'></i></Link></h5>
                            <div className="table-responsive">
                                <table id='DataTable' className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Maincategory</th>
                                            <th>Subcategory</th>
                                            <th>Brand</th>
                                            <th>Color</th>
                                            <th>Size</th>
                                            <th>Base Price</th>
                                            <th>Discount</th>
                                            <th>Final Price</th>
                                            <th>Stock</th>
                                            <th>Stock Quantity</th>
                                            <th>Pic</th>
                                            <th>Active</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ProductStateData.map(item => {
                                                const key = item._id || item.id || `${item.name}-${item.basePrice}`
                                                return <tr key={key}>
                                                    <td>{item._id || item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{getDisplayName(item.maincategory)}</td>
                                                    <td>{getDisplayName(item.subcategory)}</td>
                                                    <td>{getDisplayName(item.brand)}</td>
                                                    <td>{Array.isArray(item.color) ? item.color.join(', ') : item.color}</td>
                                                    <td>{Array.isArray(item.size) ? item.size.join(', ') : item.size}</td>
                                                    <td>&#8377;{item.basePrice}</td>
                                                    <td>{item.discount}%</td>
                                                    <td>&#8377;{item.finalPrice}</td>
                                                    <td>{item.stock ? "Yes" : "No"}</td>
                                                    <td>{item.stockQuantity}</td>
                                                    <td>
                                                        <div style={{width:350}}>
                                                            {
                                                                (Array.isArray(item?.pic) ? item.pic : []).map((p, index) => {
                                                                    const pkey = `${key}-pic-${index}`
                                                                    return <Link key={pkey} to={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${p}`} target='_blank' rel='noreferrer'>
                                                                        <img src={`${import.meta.env.VITE_SITE_IMAGE_SERVER}/${p}`} height={50} width={80} className='m-1' alt="" />
                                                                    </Link>
                                                                })
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>{item.active ? "Yes" : "No"}</td>
                                                    <td><Link to={`/admin/product/edit/${item._id || item.id}`} className='btn btn-primary'><i className='bi bi-pencil-square'></i></Link></td>
                                                    <td>{localStorage.getItem("role") === "Super Admin" ? <button onClick={() => deleteRecord(item._id || item.id)} className='btn btn-danger'><i className='bi bi-trash'></i></button> : null}</td>
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