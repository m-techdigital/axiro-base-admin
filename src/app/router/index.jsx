import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from '../../middleware/RequireAuth'
import GuestOnly from '../../middleware/GuestOnly'
import { ADMIN_ROUTES } from '../../routes/adminRoutes'

const AdminLayout = lazy(() => import('../../layouts/AdminLayout'))
const Login = lazy(() => import('../../modules/auth/pages/Login'))

const RouteFallback = () => <div className="route-loading">Đang tải...</div>
const withSuspense = (element) => (
    <Suspense fallback={<RouteFallback />}>{element}</Suspense>
)

export default function AdminRouter() {
    return (
        <Routes>
            <Route
                path="/login"
                element={withSuspense(
                    <GuestOnly>
                        <Login />
                    </GuestOnly>,
                )}
            />
            <Route
                element={withSuspense(
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>,
                )}
            >
                {ADMIN_ROUTES.map((route) => (
                    <Route
                        key={route.index ? 'index' : route.path}
                        {...route}
                        element={withSuspense(route.element)}
                    />
                ))}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
