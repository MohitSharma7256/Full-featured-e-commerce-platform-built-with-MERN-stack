import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/Sidebar'
import ImageValidator from '../../../Validators/ImageValidator'
import FormValidator from '../../../Validators/FormValidator'
import { getMaincategory, createMaincategory } from "../../../Redux/ActionCreators/MaincategoryActionCreators"

export default function AdminMaincategoryCreatePage() {
    let [data, setData] = useState({ name: "", pic: "", active: true })
    let [errorMessage, setErrorMessage] = useState({ name: "Name Field is Mendatory", pic: "Pic Field is Mendatory" })
    let [show, setShow] = useState(false)

    let MaincategoryStateData = useSelector(state => state.MaincategoryStateData)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value, files } = e.target
        if (name === "pic") {
            value = files[0]
        }
        if (name === "active") {
            value = value === "1"
        }

        setErrorMessage((old) => ({
            ...old,
            [name]: name === "pic" ? ImageValidator(e) : FormValidator(e)
        }))

        setData((old) => ({ ...old, [name]: value }))
    }

    function postData(e) {
        e.preventDefault()
        let error = Object.values(errorMessage).find(x => x !== "")
        if (error) {
            setShow(true)
            return
        }

        let item = MaincategoryStateData.find(x => x.name.toLowerCase() === data.name.toLowerCase())
        if (item) {
            setErrorMessage({ ...errorMessage, name: "Maincategory Already Exists" })
            setShow(true)
            return
        }

        let formData = new FormData()
        formData.append("name", data.name)
        formData.append("pic", data.pic)  // actual file
        formData.append("active", data.active)

        dispatch(createMaincategory(formData))
        navigate("/admin/maincategory")
    }

    useEffect(() => {
        dispatch(getMaincategory())
    }, [dispatch])

    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>
                                Create Maincategory 
                                <Link to="/admin/maincategory">
                                    <i className='bi bi-arrow-left fs-3 float-end text-light'></i>
                                </Link>
                            </h5>

                            <form onSubmit={postData}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label>Name*</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            onChange={getInputData} 
                                            className={`form-control ${show && errorMessage.name ? 'border-danger' : 'border-dark'}`} 
                                            placeholder='Enter Name' 
                                        />
                                        {show && errorMessage.name && <p className='text-danger'>{errorMessage.name}</p>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Image*</label>
                                        <input 
                                            type="file" 
                                            name="pic" 
                                            onChange={getInputData} 
                                            className={`form-control ${show && errorMessage.pic ? 'border-danger' : 'border-dark'}`} 
                                        />
                                        {show && errorMessage.pic && <p className='text-danger'>{errorMessage.pic}</p>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Active*</label>
                                        <select name="active" onChange={getInputData} className='form-select border-dark' defaultValue="1">
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mb-3">
                                        <button type="submit" className='btn btn-dark w-100'>Create Maincategory</button>
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