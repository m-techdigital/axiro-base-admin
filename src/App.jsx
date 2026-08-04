import { BrowserRouter } from 'react-router'
import AdminRouter from './app/router'
export default function App() {
    return (
        <BrowserRouter>
            <AdminRouter />
        </BrowserRouter>
    )
}
