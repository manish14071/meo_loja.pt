import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import AdminSidebar from "./AdminSidebar"

const AdminRoutes = () => {

    const { userInfo } = useSelector((state) => state.auth);

    return userInfo && userInfo.isadmin ? (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <Outlet />
            </div>
        </div>
    ) : (
        <Navigate to="/login" replace />
    )
}
export default AdminRoutes