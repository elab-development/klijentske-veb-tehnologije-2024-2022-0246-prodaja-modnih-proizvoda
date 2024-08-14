import Footer from '../components/Footer'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { User } from '../models/userModel'

interface LayoutProps {
    user: User | Record<string, never>;
    loginUser: (email?: string | undefined, password?: string | undefined) => void;
}

const Layout = ({user, loginUser}: LayoutProps) => {
    

    // Header CSS settings according to URL: different CSS position and background color for home page pathname /
    const location = useLocation()
    const pos : React.CSSProperties["position"] = location.pathname === '/' ? 'absolute' : 'static'
    const color : React.CSSProperties["backgroundColor"] = location.pathname === '/' ? 'transparent' : "#DED5CE"
    return (
        <div className="content">
            <Header position={pos} backgroundColor={color} user={ user } loginUser={loginUser} />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout