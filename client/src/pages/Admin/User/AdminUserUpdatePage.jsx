import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'

import Sidebar from '../../../components/Sidebar'

import ImageValidator from '../../../Validators/ImageValidator'
import FormValidator from '../../../Validators/FormValidator'

import { getUser, updateUser } from "../../../Redux/ActionCreators/UserActionCreators"
export default function AdminUserUpdatePage() {
    let { _id } = useParams()

    let [data, setData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        cpassword: "",
        active: true
    })
    let [errorMessage, setErrorMessage] = useState({
        name: "",
        username: "",
        email: "",
        phone: ""
    })
    let [show, setShow] = useState(false)

    let UserStateData = useSelector(state => state.UserStateData)
    let dispatch = useDispatch()

    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value } = e.target

        setErrorMessage((old) => {
            return {
                ...old,
                [name]: name === "pic" ? ImageValidator(e) : FormValidator(e)
            }
        })
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }
    function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find(x => x !== "")
        if (error)
            setShow(true)
        else {
            let item = UserStateData.find(x => x._id !== _id && (x.username.toLowerCase() === data.username.toLocaleLowerCase() || x.email.toLowerCase() === data.email.toLocaleLowerCase()))
            if (item) {
                setErrorMessage((old) => {
                    return {
                        ...old,
                        'username': x.username.toLowerCase() === data.username.toLocaleLowerCase() ? 'User With This User Name is Already Exist' : null,
                        'email': x.email.toLowerCase() === data.email.toLocaleLowerCase() ? 'User With This Email Address is Already Exist' : null
                    }
                })
                setShow(true)
                return
            }
            dispatch(updateUser({ ...data }))
            navigate("/admin/user")
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getUser())
            if (UserStateData.length) {
                let item = UserStateData.find(x => x._id === _id)
                if (item)
                    setData({ ...data, ...item })
                else
                    navigate("/admin/user")
            }
        })()
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
                            <h5 className='bg-dark text-light p-2 text-center'>User <Link to="/admin/user"><i className='bi bi-arrow-left fs-3 float-end text-light'></i></Link></h5>
                            <form onSubmit={postData}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Name*</label>
                                        <input type="text" name="name" value={data.name} onChange={getInputData} className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} placeholder='User Full Name' />
                                        {show && errorMessage.name ? <p className='text-danger'>{errorMessage.name}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Phone*</label>
                                        <input type="text" name="phone" value={data.phone} onChange={getInputData} className={`form-control ${show && errorMessage.phone ? 'border-danger' : 'border-dark'}`} placeholder='Phone Number' />
                                        {show && errorMessage.phone ? <p className='text-danger'>{errorMessage.phone}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Username*</label>
                                        <input type="text" name="username" value={data.username} onChange={getInputData} className={`form-control ${show && errorMessage.username ? 'border-danger' : 'border-dark'}`} placeholder='Username' />
                                        {show && errorMessage.username ? <p className='text-danger'>{errorMessage.username}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Email*</label>
                                        <input type="text" name="email" value={data.email} onChange={getInputData} className={`form-control ${show && errorMessage.email ? 'border-danger' : 'border-dark'}`} placeholder='Email Address' />
                                        {show && errorMessage.email ? <p className='text-danger'>{errorMessage.email}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Role*</label>
                                        <select name="role" onChange={getInputData} value={data.role} className='form-select border-dark'>
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Active*</label>
                                        <select name="active" onChange={getInputData} value={data.active ? "1" : "0"} className='form-select border-dark'>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <button type="submit" className='btn btn-dark w-100'>Update</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
