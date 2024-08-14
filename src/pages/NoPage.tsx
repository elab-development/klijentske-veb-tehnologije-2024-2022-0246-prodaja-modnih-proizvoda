import { Link, useLocation } from 'react-router-dom';
import './NoPage.css'
import logo from '/img/logo.png'

function NoPage() {
    const location = useLocation();
    return (
        <div id="no-page">
            <Link to="/"><img src={logo} style={{borderRadius: '15px'}} /></Link>
            <div>Page {location.pathname} cannot be found.</div>
            <div><a onClick={() => { history.back(); }}>Back</a></div>
        </div>
    )
}

export default NoPage