import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import Sidebar from '../../../components/Sidebar'

import FormValidator from '../../../Validators/FormValidator'

import { getFeature, createFeature } from "../../../Redux/ActionCreators/FeatureActionCreators"
export default function AdminFeatureCreatePage() {
    let [data, setData] = useState({
        name: "",
        shortDescription: "",
        icon: "",
        active: true
    })
    let [errorMessage, setErrorMessage] = useState({
        name: "Name Field is Mendatory",
        shortDescription: "Description Field is Mendatory",
        icon: "Icon Field is Mendatory"
    })
    let [show, setShow] = useState(false)

    let FeatureStateData = useSelector(state => state.FeatureStateData)
    let dispatch = useDispatch()

    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value } = e.target
        setShow(false)
        setErrorMessage((old) => {
            return {
                ...old,
                [name]: FormValidator(e)
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
            let item = FeatureStateData.find(x => x.name.toLowerCase() === data.name.toLocaleLowerCase())
            if (item) {
                setErrorMessage((old) => {
                    return {
                        ...old,
                        'name': 'Feature With This Name is Already Exist'
                    }
                })
                setShow(true)
                return
            }
            dispatch(createFeature({ ...data }))
            navigate("/admin/feature")
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getFeature())
        })()
    }, [FeatureStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Feature <Link to="/admin/feature"><i className='bi bi-arrow-left fs-3 float-end text-light'></i></Link></h5>
                            <form onSubmit={postData}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label>Name*</label>
                                        <input type="text" name="name" onChange={getInputData} className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} placeholder='Feature Full Name' />
                                        {show && errorMessage.name ? <p className='text-danger'>{errorMessage.name}</p> : null}
                                    </div>

                                     <div className="col-12 mb-3">
                                        <label>Short Description*</label>
                                        <textarea name="shortDescription" rows={2} onChange={getInputData} className={`form-control ${show && errorMessage.shortDescription ? 'border-danger' : 'border-dark'}`} placeholder='Short Description' />
                                        {show && errorMessage.shortDescription ? <p className='text-danger'>{errorMessage.shortDescription}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Icon*</label>
                                        <input type="text" name="icon" onChange={getInputData} className={`form-control ${show && errorMessage.icon ? 'border-danger' : 'border-dark'}`} placeholder='Icon Tag' />
                                        {show && errorMessage.icon ? <p className='text-danger'>{errorMessage.icon}</p> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Active*</label>
                                        <select name="active" onChange={getInputData} className='form-select border-dark'>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <button type="submit" className='btn btn-dark w-100'>Create</button>
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
