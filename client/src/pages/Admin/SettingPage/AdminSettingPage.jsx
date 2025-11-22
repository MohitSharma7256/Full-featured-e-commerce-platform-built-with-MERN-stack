import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../../components/Sidebar'
import { createSetting, getSetting, updateSetting } from "../../../Redux/ActionCreators/SettingActionCreators"

export default function AdminSettingPage() {
    const [data, setData] = useState({
        map1: "",
        map2: "",
        address: "",
        siteName: "",
        email: "",
        phone: "",
        whatsapp: "",
        facebook: "",
        youtube: "",
        linkedin: "",
        twitter: "",
        instagram: "",
    })

    const SettingStateData = useSelector(state => state.SettingStateData || []) // ✅ Default empty array
    const dispatch = useDispatch()

    function getInputData(e) {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    function postData(e) {
        e.preventDefault()
        if (SettingStateData.length > 0)
            dispatch(updateSetting({ ...data }))
        else
            dispatch(createSetting({ ...data }))
        alert("Data Has Been Updated")
    }

    function getAPIData() {
        dispatch(getSetting())
    }

    useEffect(() => {
        getAPIData()
    }, [])

    // ✅ This will safely set the form data once data arrives
    useEffect(() => {
        if (SettingStateData && SettingStateData.length > 0) {
            setData(prev => ({ ...prev, ...SettingStateData[0] }))
        }
    }, [SettingStateData])

    return (
        <div className="page-content">
            <div className="container-fluid my-3 px-5">
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <h5 className='bg-dark text-light p-2 text-center'>Setting</h5>
                        <form onSubmit={postData}>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label>Google Map URL1</label>
                                    <input type="url" name="map1" value={data.map1} onChange={getInputData} className='form-control border-dark' placeholder='Google Map Link' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Google Map URL2</label>
                                    <input type="url" name="map2" value={data.map2} onChange={getInputData} className='form-control border-dark' placeholder='Google Map Link' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Address</label>
                                    <textarea name="address" value={data.address} onChange={getInputData} className='form-control border-dark' placeholder='Address'></textarea>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Site Name</label>
                                    <input type="text" name="siteName" value={data.siteName} onChange={getInputData} className='form-control border-dark' placeholder='Site Name' />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={data.email} onChange={getInputData} className='form-control border-dark' placeholder='Email' />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Phone</label>
                                    <input type="text" name="phone" value={data.phone} onChange={getInputData} className='form-control border-dark' placeholder='Phone Number' />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>WhatsApp Number</label>
                                    <input type="text" name="whatsapp" value={data.whatsapp} onChange={getInputData} className='form-control border-dark' placeholder='WhatsApp Number' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Facebook Profile Page URL</label>
                                    <input type="url" name="facebook" value={data.facebook} onChange={getInputData} className='form-control border-dark' placeholder='Facebook URL' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Youtube Profile Page URL</label>
                                    <input type="url" name="youtube" value={data.youtube} onChange={getInputData} className='form-control border-dark' placeholder='YouTube URL' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Instagram Profile Page URL</label>
                                    <input type="url" name="instagram" value={data.instagram} onChange={getInputData} className='form-control border-dark' placeholder='Instagram URL' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Twitter Profile Page URL</label>
                                    <input type="url" name="twitter" value={data.twitter} onChange={getInputData} className='form-control border-dark' placeholder='Twitter URL' />
                                </div>

                                <div className="col-12 mb-3">
                                    <label>Linkedin Profile Page URL</label>
                                    <input type="url" name="linkedin" value={data.linkedin} onChange={getInputData} className='form-control border-dark' placeholder='LinkedIn URL' />
                                </div>

                                <div className="mb-3">
                                    <button type="submit" className='btn btn-dark w-100'>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
