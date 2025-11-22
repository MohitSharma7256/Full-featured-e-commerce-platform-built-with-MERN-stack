import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import Sidebar from '../../../components/Sidebar'

import FormValidator from '../../../Validators/FormValidator'

import { getFaq, createFaq } from "../../../Redux/ActionCreators/FaqActionCreators"
export default function AdminFaqCreatePage() {
    let [data, setData] = useState({
        question: "",
        answer: "",
        active: true
    })
    let [errorMessage, setErrorMessage] = useState({
        question: "Question Field is Mendatory",
        answer: "Answer Field is Mendatory"
    })
    let [show, setShow] = useState(false)

    let FaqStateData = useSelector(state => state.FaqStateData)
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
            let item = FaqStateData.find(x => x.question.toLowerCase() === data.question.toLocaleLowerCase())
            if (item) {
                setErrorMessage((old) => {
                    return {
                        ...old,
                        'question': 'Faq With This Question is Already Exist'
                    }
                })
                setShow(true)
                return
            }
            dispatch(createFaq({ ...data }))
            navigate("/admin/faq")
        }
    }

    useEffect(() => {
        (() => {
            dispatch(getFaq())
        })()
    }, [FaqStateData.length])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Faq <Link to="/admin/faq"><i className='bi bi-arrow-left fs-3 float-end text-light'></i></Link></h5>
                            <form onSubmit={postData}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label>Question*</label>
                                        <input type="text" name="question" onChange={getInputData} className={`form-control ${show && errorMessage.question ? 'border-danger' : 'border-dark'}`} placeholder='Faq Full Name' />
                                        {show && errorMessage.question ? <p className='text-danger'>{errorMessage.question}</p> : null}
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label>Answer*</label>
                                        <textarea name="answer" rows={2} onChange={getInputData} className={`form-control ${show && errorMessage.answer ? 'border-danger' : 'border-dark'}`} placeholder='Short Description' />
                                        {show && errorMessage.answer ? <p className='text-danger'>{errorMessage.answer}</p> : null}
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
