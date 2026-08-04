import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
export default function GuestOnly({ children }) {
    const { user, loading } = useAuth()
    if (loading)
        return <div className="center">Đang khôi phục phiên làm việc…</div>
    return user ? <Navigate to="/" replace /> : children
}
