import { Navigate, useLocation } from 'react-router-dom'
import ContractCompatibilityBanner from '../components/system/ContractCompatibilityBanner'
import { useAuth } from '../hooks/useAuth'
export default function RequireAuth({ children }) {
    const { user, loading } = useAuth()
    const location = useLocation()
    if (loading)
        return <div className="center">Đang khôi phục phiên làm việc…</div>
    if (!user)
        return <Navigate to="/login" replace state={{ from: location }} />
    return (
        <>
            <ContractCompatibilityBanner />
            {children}
        </>
    )
}
