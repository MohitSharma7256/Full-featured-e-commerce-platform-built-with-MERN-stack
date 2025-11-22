import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

export default function AdminPage() {
    let [user, setUser] = useState({})

    useEffect(() => {
        (async () => {
            let response = await fetch(`${import.meta.env.VITE_SITE_BACKEND_SERVER}/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "authorization": localStorage.getItem("token"),
                    "content-type": "application/json"
                }
            })
            response = await response.json()
            setUser({ ...response.data })
        })()
    }, [])
    return (
        <>
            <div className="page-content">
                <div className="container-fluid my-3 px-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <h5 className='bg-dark text-light p-2 text-center'>Admin Profile</h5>
                            <table className='table table-bordered'>
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <th>{user.name}</th>
                                    </tr> <tr>
                                        <th>User Name</th>
                                        <th>{user.username}</th>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <th>{user.email}</th>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <th>{user.phone}</th>
                                    </tr>
                                    <tr>
                                        <th>Role</th>
                                        <th>{user.role}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
