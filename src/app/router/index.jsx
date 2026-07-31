import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import Login from '../../modules/auth/pages/Login'
import RequireAuth from '../../middleware/RequireAuth'
import GuestOnly from '../../middleware/GuestOnly'
import { ADMIN_ROUTES } from '../../routes/adminRoutes'
export default function AdminRouter() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <GuestOnly>
                        <Login />
                    </GuestOnly>
                }
            />
            <Route
                element={
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                {ADMIN_ROUTES.map((route) => (
                    <Route
                        key={route.index ? 'index' : route.path}
                        {...route}
                    />
                ))}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
