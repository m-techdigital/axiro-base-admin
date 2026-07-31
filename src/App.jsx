import { BrowserRouter } from 'react-router-dom'
import AdminRouter from './app/router'
export default function App() {
    return (
        <BrowserRouter>
            <AdminRouter />
        </BrowserRouter>
    )
}
